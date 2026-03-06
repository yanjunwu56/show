import { useMemo, useState } from 'react'

// Simple counter with derived state and actions.
const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial)
  const double = useMemo(() => count * 2, [count])

  const increment = (step = 1) => {
    setCount((prev) => prev + step)
  }

  const decrement = (step = 1) => {
    setCount((prev) => prev - step)
  }

  const reset = () => {
    setCount(initial)
  }

  return { count, double, increment, decrement, reset }
}

export { useCounter }
