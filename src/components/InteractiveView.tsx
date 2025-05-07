import { EvalResponse, SerializedValue, ObjectValue, ArrayValue, ErrorValue } from '../types'

interface InteractiveViewProps {
  data: EvalResponse
}

export const InteractiveView = ({ data }: InteractiveViewProps) => {
  const formatValue = (value: SerializedValue): string => {
    switch (value.type) {
      case 'object':
        return `{${(value.value as ObjectValue).map(({ key, value }) =>
          `${key}: ${value}`
        ).join(', ')}}`
      case 'array':
        return `[${(value.value as ArrayValue).join(', ')}]`
      case 'error':
        const error = value.value as ErrorValue
        return `Error: ${error.name} - ${error.message}`
      case 'string':
        return `"${value.value}"`
      case 'number':
      case 'boolean':
        return String(value.value)
      case 'undefined':
        return 'undefined'
      default:
        return String(value.value)
    }
  }

  return (
    <div className="interactive-view">
      <h3>Interactive View</h3>
      <pre>
        {Object.entries(data.serialized).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {formatValue(value)}
          </div>
        ))}
      </pre>
    </div>
  )
}