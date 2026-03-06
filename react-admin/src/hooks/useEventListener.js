import { useEffect, useRef } from 'react'

// Attach and clean up a DOM event listener.
const useEventListener = (target, event, handler) => {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const element = target?.current || target || window
    const listener = (evt) => handlerRef.current(evt)
    element.addEventListener(event, listener)
    return () => element.removeEventListener(event, listener)
  }, [event, target])
}

export { useEventListener }
