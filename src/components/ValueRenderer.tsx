import React from 'react'
import type { EvalResponse } from '../App';

type ObjectValue = Array<{ key: string; value: string }>
type ArrayValue = string[]
type ErrorValue = { name: string; message: string; stack: string }

interface SerializedValue {
  type: 'object' | 'array' | 'error' | 'undefined' | 'string' | 'number' | 'boolean'
  value: ObjectValue | ArrayValue | ErrorValue | string | number | boolean
}

interface ValueRendererProps {
  result: EvalResponse
  value: SerializedValue
}

const ValueRenderer: React.FC<ValueRendererProps> = ({ value, result }) => {
  const renderError = (errorValue: ErrorValue) => (
    <div className="value-error">
      <div className="error-name">{errorValue.name}</div>
      <div className="error-message">{errorValue.message}</div>
      <div className="error-stack">{errorValue.stack}</div>
    </div>
  )

  switch (value.type) {
    case 'string':
      return <span className="value-string">"{value.value as string}"</span>
    case 'number':
      return <span className="value-number">{value.value as number}</span>
    case 'boolean':
      return <span className="value-boolean">{(value.value as boolean).toString()}</span>
    case 'undefined':
      return <span className="value-undefined">undefined</span>
    case 'object':
      return (
        <div className="value-object">
          {(value.value as ObjectValue).map((item, index) => (
            <div key={index} className="object-item">
              <ValueRenderer result={result} value={result.serialized[item.value]} />
            </div>
          ))}
        </div>
      )
    case 'array':
      return (
        <div className="value-array">
          {(value.value as ArrayValue).map((item, index) => (
            <div key={index} className="array-item">
              {item}
            </div>
          ))}
        </div>
      )
    case 'error':
      return renderError(value.value as ErrorValue)
    default:
      return <span>Unknown type: {value.type}</span>
  }
}

export default ValueRenderer