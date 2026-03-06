import { useCallback, useState } from 'react'

// Wrap an async function with loading and error handling.
const useAsync = (asyncFn) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError('')
      try {
        const result = await asyncFn(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err?.message || 'Request failed')
        throw err
      } finally {
        setLoading(false)
      }
    },
    [asyncFn],
  )

  return { data, loading, error, run }
}

export { useAsync }
