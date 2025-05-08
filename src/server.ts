// session-evaluator.ts
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import Redis from "redis";
import { RedisStore } from "connect-redis";
import type { EvalRequestBody, EvalResponse } from "./types.js";
import { Serializer } from "./serializer.js";
import { SessionEvaluator } from "./session-evaluator.js";

// Extend the express session with our own properties
declare module "express-session" {
  interface SessionData {
    touched?: boolean;
  }
}

// Example Express server implementation
const app = express();
const PORT = process.env.PORT || 3000;

// Create Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff: 2^retries * 100ms
      const delay = Math.min(2 ** retries * 100, 3000);
      console.log(`Redis reconnecting in ${delay}ms...`);
      return delay;
    }
  }
});

// Handle Redis connection events
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  console.error('Redis URL:', process.env.REDIS_URL ? 'REDIS_URL is set' : 'REDIS_URL is not set');
});
redisClient.on('connect', () => {
  console.log('Redis Client Connected');
  console.log('Environment:', process.env.NODE_ENV);
});
redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));

// Configure session middleware with Redis store
app.use(
  session({
    store: process.env.NODE_ENV === "production"
      ? new RedisStore({
          client: redisClient,
          prefix: "sess:",
          ttl: 86400 // 24 hours in seconds
        })
      : new session.MemoryStore(),
    secret: process.env.SESSION_SECRET || "a-very-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh session on activity
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
      httpOnly: true
    }
  })
);

// Add session debugging middleware
// app.use((req: Request, _res: Response, next: NextFunction) => {
//   console.log('Session ID:', req.sessionID);
//   console.log('Session exists:', !!req.session);
//   console.log('Session touched:', req.session?.touched);
//   next();
// });

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL || "https://replquick.onrender.com"
    : "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// Create an evaluator instance
const evaluator = new SessionEvaluator();

// API endpoint to evaluate JavaScript code
app.post("/eval", (req: Request, res: Response) => {
  const { code, sessionId: clientSessionId } = req.body as EvalRequestBody;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Use the client's session ID if provided, otherwise use the server's session ID
  const sessionId = clientSessionId || req.session.id;

  // Evaluate the code in the session's context
  const evaluated = evaluator.evaluate(sessionId, code);

  // Create a new serializer for this evaluation
  const serializer = new Serializer();

  const rootId = serializer.serialize(evaluated.error ?? evaluated.result);

  const response: EvalResponse = {
    root: rootId,
    serialized: serializer.getSerialized(),
    sessionId,
    newGlobals: evaluated.newGlobals
  };

  console.log("[Server] Evaluation successful:", sessionId);
  res.json(response);
});

// API endpoint to start a new session
app.post("/session/create", (req: Request, res: Response) => {
  // Regenerate the session ID to create a new session
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to create new session" });
    }

    // Clear any existing context for this session
    evaluator.clearContext(req.session.id);

    res.json({
      sessionId: req.session.id,
      message: "New session created successfully"
    });
  });
});

// Clean up when a session expires
app.use((req: Request, _res: Response, next: NextFunction) => {
  const sessionId = req.session.id;

  // Set up cleanup for when the session is destroyed
  if (req.session && !req.session.touched) {
    req.session.touched = true;
    // Store the session ID in the session data for cleanup
    const originalDestroy = req.session.destroy;
    req.session.destroy = function(callback) {
      evaluator.clearContext(sessionId);
      return originalDestroy.call(this, callback);
    };
  }

  next();
});

// Start the server
const startServer = async () => {
  try {
    // Only connect to Redis in production
    if (process.env.NODE_ENV === "production") {
      await redisClient.connect();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing Redis connection...');
  if (process.env.NODE_ENV === "production") {
    await redisClient.quit();
  }
  process.exit(0);
});

startServer();

export default SessionEvaluator;
