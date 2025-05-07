import { useState } from 'react'
import './App.css'

type ObjectValue = Array<{ key: string; value: string }>
type ArrayValue = string[]
type ErrorValue = { name: string; message: string; stack: string }

interface SerializedValue {
  type: 'object' | 'array' | 'error' | 'undefined' | 'string' | 'number' | 'boolean'
  value: ObjectValue | ArrayValue | ErrorValue | string | number | boolean
}

interface EvalResponse {
  root: string
  serialized: Record<string, SerializedValue>
}

function App() {
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState<EvalResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: inputValue,
          sessionId: sessionId || undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate code')
      }

      const data = await response.json()
      console.log("[App] data", data)
      setResult(data)
      // Update session ID if it's a new session
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleNewSession = () => {
    setSessionId('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h1>JavaScript Code Evaluator</h1>
        <div className="form-group">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter JavaScript code to evaluate..."
            className="input"
            rows={5}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Evaluating...' : 'Evaluate'}
          </button>
          <button type="button" onClick={handleNewSession} className="new-session-button">
            New Session
          </button>
        </div>
        {sessionId && (
          <div className="session-info">
            Session ID: {sessionId}
          </div>
        )}
      </form>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="result">
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
