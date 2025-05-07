import { EvalResponse, ObjectValue, ArrayValue, ErrorValue } from '../types'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

// Register JSON language
SyntaxHighlighter.registerLanguage('json', json)

interface InteractiveViewProps {
  data: EvalResponse
}

export const InteractiveView = ({ data }: InteractiveViewProps) => {
  const convertToJSON = (id: string): any => {
    const value = data.serialized[id]
    if (!value) return undefined

    switch (value.type) {
      case 'object':
        return Object.fromEntries(
          (value.value as ObjectValue).map(({ key, value: valId }) => {
            const keyValue = convertToJSON(key)
            const valValue = convertToJSON(valId)
            return [keyValue, valValue]
          })
        )
      case 'array':
        return (value.value as ArrayValue).map(convertToJSON)
      case 'error':
        const error = value.value as ErrorValue
        return { error: { name: error.name, message: error.message } }
      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
        return value.value
      default:
        return value.value
    }
  }

  const jsonData = convertToJSON(data.root)
  const formattedJSON = JSON.stringify(jsonData, null, 2)

  return (
    <div className="interactive-view">
      <div style={{
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        padding: '1rem',
        overflow: 'auto',
        textAlign: 'left'
      }}>
        <SyntaxHighlighter
          language="json"
          style={docco}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            textAlign: 'left'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {formattedJSON}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}