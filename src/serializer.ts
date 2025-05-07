import { v4 as uuidv4 } from 'uuid';
import type { SerializedValue } from './types.js';

export class Serializer {
  private serialized: Record<string, SerializedValue> = {};

  serialize(value: unknown): string {
    const id = uuidv4();
    this.serialized[id] = this.serializeValue(value);
    return id;
  }

  private serializeValue(value: unknown): SerializedValue {
    if (value === undefined) {
      return {
        type: 'undefined',
        value: ''
      };
    }

    if (value === null) {
      return {
        type: 'string',
        value: 'null'
      };
    }

    if (typeof value === 'string') {
      return {
        type: 'string',
        value
      };
    }

    if (typeof value === 'number') {
      return {
        type: 'number',
        value
      };
    }

    if (typeof value === 'boolean') {
      return {
        type: 'boolean',
        value
      };
    }

    if (value instanceof Error) {
      return {
        type: 'error',
        value: {
          name: value.name,
          message: value.message,
          stack: value.stack || ''
        }
      };
    }

    if (Array.isArray(value)) {
      return {
        type: 'array',
        value: value.map(item => this.serialize(item))
      };
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as object).map(([key, val]) => ({
        key: this.serialize(key),
        value: this.serialize(val)
      }));

      return {
        type: 'object',
        value: entries
      };
    }

    // Fallback for other types
    return {
      type: 'string',
      value: String(value)
    };
  }

  getSerialized(): Record<string, SerializedValue> {
    return this.serialized;
  }
}