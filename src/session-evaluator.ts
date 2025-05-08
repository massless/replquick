import * as vm from "node:vm";

// Define interfaces for our type structure
interface EvaluationResult {
  success: boolean;
  result?: any;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  newGlobals?: Array<{
    name: string;
    type: string;
    timestamp: number;
    size: number;
  }>;
}

interface ContextMap {
  [key: string]: any;
}

export class SessionEvaluator {
  private contexts: Map<string, vm.Context>;
  private timeout: number = 5000; // 5 second default timeout

  constructor() {
    this.contexts = new Map();
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
   * Get the list of global variables in a context
   * @param {vm.Context} context - The VM context to inspect
   * @returns {string[]} List of global variable names
   */
  private getGlobalVariables(context: vm.Context): string[] {
    const globalVars = Object.keys(context);
    console.log("[SessionEvaluator] getGlobalVariables", globalVars);
    return globalVars;
  }

  /**
   * Get information about a global variable
   * @param {vm.Context} context - The VM context
   * @param {string} name - The name of the global variable
   * @returns {Object} Information about the global variable
   */
  private getGlobalInfo(context: vm.Context, name: string) {
    const value = context[name];
    const type = typeof value;
    const size = new Blob([JSON.stringify(value)]).size;
    return {
      name,
      type,
      timestamp: Date.now(),
      size
    };
  }

  /**
   * Get the list of new global variables added during code execution
   * @param {vm.Context} context - The VM context to inspect
   * @param {string[]} beforeVars - List of variables before execution
   * @returns {Array} List of newly added global variable information
   */
  private getNewGlobalVariables(context: vm.Context, beforeVars: string[]): Array<{
    name: string;
    type: string;
    timestamp: number;
    size: number;
  }> {
    const afterVars = this.getGlobalVariables(context);
    return afterVars
      .filter(v => !beforeVars.includes(v))
      .map(v => this.getGlobalInfo(context, v));
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
    const beforeVars = this.getGlobalVariables(context);

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

      // Get list of new global variables with their information
      const newGlobals = this.getNewGlobalVariables(context, beforeVars);

      return {
        success: true,
        result,
        newGlobals: newGlobals.length > 0 ? newGlobals : undefined
      };
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