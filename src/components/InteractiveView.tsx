import { EvalResponse, ObjectValue, ArrayValue, ErrorValue } from '../types'
import { useState } from 'react'
import './InteractiveView.css'

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
    return <span className="json-null">null</span>
  }

  if (typeof data === 'string') {
    return <span className="json-string">"{data}"</span>
  }

  if (typeof data === 'number') {
    return <span className="json-number">{data}</span>
  }

  if (typeof data === 'boolean') {
    return <span className="json-boolean">{data.toString()}</span>
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
                <span className="json-key">"{key}"</span>: <CollapsibleJSONViewer data={value} level={level + 1} />
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
      <div className="json-viewer">
        <CollapsibleJSONViewer data={jsonData} />
      </div>
    </div>
  )
}