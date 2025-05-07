import { EvalResponse } from '../types'

interface DebugViewProps {
  data: EvalResponse
}

export const DebugView = ({ data }: DebugViewProps) => {
  return (
    <div className="debug-view">
      <h3>Debug View</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}