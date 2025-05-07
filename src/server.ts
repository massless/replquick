// session-evaluator.ts
import * as vm from "node:vm";
import express, { Request, Response, NextFunction, response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import type { EvalRequestBody, EvalResponse } from "./types.js";
import { Serializer } from "./serializer.js";

// Extend the express session with our own properties
declare module "express-session" {
  interface SessionData {
    touched?: boolean;
  }
}

// Define interfaces for our type structure
interface EvaluationResult {
  success: boolean;
  result?: any;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

interface ContextMap {
  [key: string]: any;
}

class SessionEvaluator {
  private contexts: Map<string, vm.Context>;
  private timeout: number;

  constructor() {
    // Store contexts by session ID
    this.contexts = new Map<string, vm.Context>();

    // Default timeout for script execution (in milliseconds)
    this.timeout = 5000;
  }

  /**
   * Get or create a context for a session
   * @param {string} sessionId - The unique session identifier
   * @param {ContextMap} initialContext - Optional initial context values
   * @returns {vm.Context} The VM context for this session
   */
  public getContext(
    sessionId: string,
    initialContext: ContextMap = {}
  ): vm.Context {
    if (!this.contexts.has(sessionId)) {
      // Create a new sandboxed context with the initial values
      const sandbox: ContextMap = {
        console: console,
        // Add any global objects/functions you want to expose
        // but be careful about security implications
        ...initialContext,
      };

      // Create and store the context
      const context = vm.createContext(sandbox);
      this.contexts.set(sessionId, context);
    }

    return this.contexts.get(sessionId)!;
  }

  /**
   * Evaluate JavaScript code in a session's context
   * @param {string} sessionId - The unique session identifier
   * @param {string} code - JavaScript code to evaluate
   * @param {ContextMap} additionalContext - Additional context variables for this execution only
   * @returns {EvaluationResult} Result of the evaluation
   */
  public evaluate(
    sessionId: string,
    code: string,
    additionalContext: ContextMap = {}
  ): EvaluationResult {
    const context = this.getContext(sessionId);

    // Add any temporary context variables
    Object.keys(additionalContext).forEach((key) => {
      context[key] = additionalContext[key];
    });

    try {
      // Create a script with the code
      const script = new vm.Script(code);

      // Run the script in the context with a timeout
      const result = script.runInContext(context, {
        timeout: this.timeout,
        displayErrors: true,
      });

      return { success: true, result };
    } catch (error) {
      const typedError = error as Error;
      return {
        success: false,
        error: {
          name: typedError.name,
          message: typedError.message,
          stack: typedError.stack,
        },
      };
    } finally {
      // Clean up any temporary context variables
      Object.keys(additionalContext).forEach((key) => {
        delete context[key];
      });
    }
  }

  /**
   * Remove a session's context when it's no longer needed
   * @param {string} sessionId - The session to clean up
   */
  public clearContext(sessionId: string): void {
    this.contexts.delete(sessionId);
  }

  /**
   * Set a new timeout value for script execution
   * @param {number} milliseconds - Timeout in milliseconds
   */
  public setTimeout(milliseconds: number): void {
    this.timeout = milliseconds;
  }
}

// Example Express server implementation
const app = express();
const PORT = process.env.PORT || 3000;

// Configure session middleware
app.use(
  session({
    secret: "a-very-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(bodyParser.json());

// Create an evaluator instance
const evaluator = new SessionEvaluator();

// API endpoint to evaluate JavaScript code
app.post("/eval", (req: Request, res: Response) => {
  const { code } = req.body as EvalRequestBody;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Use the session ID to maintain context
  const sessionId = req.session.id;

  // Evaluate the code in the session's context
  const evaluated = evaluator.evaluate(sessionId, code);

  // Create a new serializer for this evaluation
  const serializer = new Serializer();

  const rootId = serializer.serialize(evaluated.error ?? evaluated.result);

  const response: EvalResponse = {
    root: rootId,
    serialized: serializer.getSerialized(),
  };
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

  // Optional: Set up a listener for session destruction
  if (req.session && !req.session.touched) {
    req.session.touched = true;
    // Using any here because the destroy event is not well-typed in the session types
    (req.session as any).on("destroy", () => {
      evaluator.clearContext(sessionId);
    });
  }

  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default SessionEvaluator;
