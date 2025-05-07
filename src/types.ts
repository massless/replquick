export interface EvalRequestBody {
  code: string;
  sessionId?: string;
}

export interface SerializedValue {
  type: string;
  value: any;
}

export interface ObjectSerialized extends SerializedValue {
  type: 'object';
  value: Array<{
    key: string;
    value: string;
  }>;
}

export interface ArraySerialized extends SerializedValue {
  type: 'array';
  value: string[];
}

export interface ErrorSerialized extends SerializedValue {
  type: 'error';
  value: {
    name: string;
    message: string;
    stack: string;
  };
}

export interface UndefinedSerialized extends SerializedValue {
  type: 'undefined';
  value: string;
}

export interface StringSerialized extends SerializedValue {
  type: 'string';
  value: string;
}

export interface NumberSerialized extends SerializedValue {
  type: 'number';
  value: number;
}

export interface BooleanSerialized extends SerializedValue {
  type: 'boolean';
  value: boolean;
}

export type Serialized =
  | ObjectSerialized
  | ArraySerialized
  | ErrorSerialized
  | UndefinedSerialized
  | StringSerialized
  | NumberSerialized
  | BooleanSerialized;

export interface EvalResponseBody {
  root: string;
  serialized: Record<string, Serialized>;
}