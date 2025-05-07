import express from 'express';
import { Serializer } from './serializer.js';
import type { EvalRequestBody, EvalResponseBody } from './types.js';

const app = express();
app.use(express.json());

// Store sessions in memory
const sessions = new Map<string, Record<string, unknown>>();

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

    const response: EvalResponseBody = {
      root: rootId,
      serialized: serializer.getSerialized()
    };

    res.json(response);
  } catch (error) {
    const serializer = new Serializer();
    const rootId = serializer.serialize(error);

    const response: EvalResponseBody = {
      root: rootId,
      serialized: serializer.getSerialized()
    };

    res.json(response);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});