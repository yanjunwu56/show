import { useEffect, useState } from 'react'

// Keep state in sync with localStorage.
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export { useLocalStorage }
