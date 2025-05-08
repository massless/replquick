export interface EvalRequestBody {
  code: string;
  sessionId?: string;
}

export type ObjectValue = Array<{ key: string; value: string }>
export type ArrayValue = string[]
export type ErrorValue = { name: string; message: string; stack: string }

export interface SerializedValue {
  type: 'object' | 'array' | 'error' | 'undefined' | 'string' | 'number' | 'boolean'
  value: ObjectValue | ArrayValue | ErrorValue | string | number | boolean
}

export interface EvalResponse {
  root: string
  serialized: Record<string, SerializedValue>
  sessionId?: string
  newGlobals?: Array<{
    name: string;
    type: string;
    timestamp: number;
    size: number;
  }>
}

export interface EvaluationHistory {
  id: number;
  code: string;
  timestamp: number;
}