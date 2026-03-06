import { useState } from 'react'

// Boolean toggle with a setter.
const useToggle = (initial = false) => {
  const [value, setValue] = useState(initial)

  const toggle = () => setValue((prev) => !prev)
  const set = (next) => setValue(Boolean(next))

  return { value, toggle, set }
}

export { useToggle }
