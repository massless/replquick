import { EvalResponse, ObjectValue, ArrayValue, ErrorValue } from '../types'
import { useState } from 'react'

interface InteractiveViewProps {
  data: EvalResponse
}

interface CollapsibleJSONViewerProps {
  data: any
  level?: number
}

const CollapsibleJSONViewer = ({ data, level = 0 }: CollapsibleJSONViewerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const indent = '  '.repeat(level)

  if (data === null) {
    return <span style={{ color: '#808080' }}>null</span>
  }

  if (typeof data === 'string') {
    return <span style={{ color: '#008000' }}>"{data}"</span>
  }

  if (typeof data === 'number') {
    return <span style={{ color: '#0000ff' }}>{data}</span>
  }

  if (typeof data === 'boolean') {
    return <span style={{ color: '#800080' }}>{data.toString()}</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span>[]</span>
    }

    return (
      <div onClick={() => {
        if (isCollapsed) setIsCollapsed(false)
      }}>
        <span
          onClick={() => {
            if (!isCollapsed) setIsCollapsed(true)
          }}
          className="interactive-view-toggle"
        >
          {isCollapsed ? '▶' : '▼'} [
        </span>
        {!isCollapsed && (
          <>
            {data.map((item, index) => (
              <div key={index} style={{ marginLeft: '20px' }}>
                {indent}
                <CollapsibleJSONViewer data={item} level={level + 1} />
                {index < data.length - 1 && ','}
              </div>
            ))}
            <div>{indent}]</div>
          </>
        )}
        {isCollapsed && <span className="interactive-view-toggle">...{']'}</span>}
      </div>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data)
    if (entries.length === 0) {
      return <span>{'{}'}</span>
    }

    return (
      <div onClick={() => {
        if (isCollapsed) setIsCollapsed(false)
      }}>
        <span
          onClick={() => {
            if (!isCollapsed) setIsCollapsed(true)
          }}
          className="interactive-view-toggle"
        >
          {isCollapsed ? '▶' : '▼'} {'{'}
        </span>
        {!isCollapsed && (
          <>
            {entries.map(([key, value], index) => (
              <div key={key} style={{ marginLeft: '20px' }}>
                {indent}
                <span style={{ color: '#a52a2a' }}>"{key}"</span>: <CollapsibleJSONViewer data={value} level={level + 1} />
                {index < entries.length - 1 && ','}
              </div>
            ))}
            <div>{indent}{'}'}</div>
          </>
        )}
        {isCollapsed && <span className="interactive-view-toggle">...{'}'}</span>}
      </div>
    )
  }

  return <span>{String(data)}</span>
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

  return (
    <div className="interactive-view">
      <div style={{
        backgroundColor: '#f8f8f8',
        borderRadius: '4px',
        padding: '1rem',
        overflow: 'auto',
        textAlign: 'left',
        fontFamily: 'monospace'
      }}>
        <CollapsibleJSONViewer data={jsonData} />
      </div>
    </div>
  )
}