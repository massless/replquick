import express from 'express';
import { Serializer } from './serializer.js';
import type { EvalRequestBody, EvalResponse } from './types.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS
app.use(cors({
  origin: ['https://replquick.onrender.com', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Add error logging middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Store sessions in memory
const sessions = new Map<string, Record<string, unknown>>();

// Root route handler
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.post('/create-session', (_req, res) => {
  try {
    // Generate a random session ID
    const sessionId = Math.random().toString(36).substring(2, 15);

    // Initialize empty session context
    sessions.set(sessionId, {});

    console.log("[Server] Created session:", sessionId);
    res.json({
      success: true,
      sessionId,
      message: 'New session created successfully'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create new session' });
  }
});

app.post('/clear-session', (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required' });
      return;
    }

    // Clear the session context by setting it to an empty object
    console.log("[Server] Clearing session:", sessionId);
    sessions.set(sessionId, {});

    res.json({
      success: true,
      message: 'Session context cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing session:', error);
    res.status(500).json({ error: 'Failed to clear session context' });
  }
});

app.post('/eval', (req, res) => {
  try {
    const { code, sessionId } = req.body as EvalRequestBody;

    if (!code) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    // Get or create session context
    let context = sessions.get(sessionId || '');
    if (!context) {
      context = {};
      if (sessionId) {
        sessions.set(sessionId, context);
      }
    }

    // Create a new serializer for this evaluation
    const serializer = new Serializer();

    // Evaluate the code in a new context
    const result = new Function('context', `
      with (context) {
        return (${code});
      }
    `)(context);

    // Serialize the result
    const rootId = serializer.serialize(result);

    const response: EvalResponse = {
      root: rootId,
      serialized: serializer.getSerialized()
    };

    console.log("[Server] Evaluation successful:", sessionId);
    res.json(response);
  } catch (error) {
    console.error('Evaluation error:', error);
    const serializer = new Serializer();
    const rootId = serializer.serialize(error);

    const response: EvalResponse = {
      root: rootId,
      serialized: serializer.getSerialized()
    };

    res.json(response);
  }
});

app.get('/current-session', (req, res) => {
  try {
    // Get session ID from query parameters or headers
    const sessionId = req.query.sessionId as string || req.headers['x-session-id'] as string;

    if (!sessionId) {
      res.json({ sessionId: null });
      return;
    }

    // Check if session exists
    const sessionExists = sessions.has(sessionId);

    if (!sessionExists) {
      res.json({ sessionId: null });
      return;
    }

    res.json({ sessionId });
  } catch (error) {
    console.error('Error getting current session:', error);
    res.status(500).json({ error: 'Failed to get current session' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});