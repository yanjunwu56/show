import { useEffect, useRef } from 'react'

// Capture the previous value of a prop or state.
const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export { usePrevious }
