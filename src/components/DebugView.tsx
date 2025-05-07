import { EvalResponse } from '../types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface DebugViewProps {
  data: EvalResponse
}

export const DebugView = ({ data }: DebugViewProps) => {
  return (
    <div className="debug-view">
      <SyntaxHighlighter
        language="json"
        style={tomorrow}
        customStyle={{
          margin: 0,
          borderRadius: '4px',
          padding: '1rem'
        }}
      >
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
    </div>
  )
}