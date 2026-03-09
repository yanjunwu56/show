import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useAsync } from '../hooks/useAsync'
import { useCounter } from '../hooks/useCounter'
import { useDebounce } from '../hooks/useDebounce'
import { useEventListener } from '../hooks/useEventListener'
import { useInterval } from '../hooks/useInterval'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePagination } from '../hooks/usePagination'
import { usePrevious } from '../hooks/usePrevious'
import { useThrottle } from '../hooks/useThrottle'
import { useToggle } from '../hooks/useToggle'

const DemoContext = createContext('default')

function ContextConsumer({ valueLabel, onToggle }) {
  const contextLabel = useContext(DemoContext)
  return (
    <div className="hook-card">
      <div className="hook-title">useContext</div>
      <div className="hook-meta">
        Value: {contextLabel} ({valueLabel})
      </div>
      <button className="secondary-button" onClick={onToggle}>
        Toggle context
      </button>
    </div>
  )
}

const reducer = (state, action) => {
  // Simple reducer for demo.
  if (action.type === 'add') {
    return { total: state.total + 1 }
  }
  if (action.type === 'reset') {
    return { total: 0 }
  }
  return state
}

function Hooks() {
  const [message, setMessage] = useState('hello hooks')
  const upperMessage = useMemo(() => message.toUpperCase(), [message])
  const prevMessage = usePrevious(message)
  const inputId = useId()

  const [log, setLog] = useState([])
  useEffect(() => {
    // Track message changes for demo.
    setLog((prev) => [`${prevMessage} -> ${message}`, ...prev].slice(0, 5))
  }, [message, prevMessage])

  const pointer = useRef({ x: 0, y: 0 })
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  useEventListener(window, 'mousemove', (event) => {
    pointer.current = { x: event.clientX, y: event.clientY }
    forceUpdate()
  })

  const { count, double, increment, decrement, reset } = useCounter(2)
  const { value: isOn, toggle: toggleSwitch } = useToggle(false)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [throttleInput, setThrottleInput] = useState('')
  const [throttledValue, setThrottledValue] = useState('')
  const throttledUpdate = useThrottle((value) => {
    // Throttle expensive search updates.
    setThrottledValue(value)
  }, 300)

  const [note, setNote] = useLocalStorage(
    'react-admin-note',
    'Remember to review.',
  )

  const { page, totalPages, pagedItems, next, prev } = usePagination(
    Array.from({ length: 24 }, (_, index) => `Item ${index + 1}`),
    6,
  )

  const { data, loading, error, run } = useAsync(async () => {
    // Mock async call for demo purposes.
    await new Promise((resolve) => setTimeout(resolve, 800))
    return `Fetched at ${new Date().toLocaleTimeString()}`
  })

  const [ticks, setTicks] = useState(0)
  useInterval(() => {
    setTicks((prev) => prev + 1)
  }, 1000)

  const [reducerState, dispatch] = useReducer(reducer, { total: 0 })
  const { value: contextValue, toggle: toggleContext } = useToggle(false)

  const [isPending, startTransition] = useTransition()
  const [filterInput, setFilterInput] = useState('')
  const [filter, setFilter] = useState('')
  const deferredFilter = useDeferredValue(filter)
  const filteredItems = useMemo(() => {
    const list = Array.from({ length: 120 }, (_, index) => `Entry ${index + 1}`)
    return list.filter((item) =>
      item.toLowerCase().includes(deferredFilter.toLowerCase()),
    )
  }, [deferredFilter])

  const stableCallback = useCallback(() => {
    // Demonstrates useCallback memoization.
    setMessage((prev) => prev + '!')
  }, [])

  return (
    <DemoContext.Provider value={contextValue ? 'Enabled' : 'Disabled'}>
      <section className="hooks">
        <div className="card">
        <div className="card-title">Official React hooks</div>
        <p className="page-description">
          These blocks demonstrate useState, useEffect, useMemo, useRef,
          useReducer, useContext, and more.
        </p>
        <div className="hooks-grid">
          <div className="hook-card">
            <div className="hook-title">useState + useMemo</div>
            <label className="hook-meta" htmlFor={inputId}>
              Message
            </label>
            <input
              id={inputId}
              className="input"
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <div className="hook-meta">Upper: {upperMessage}</div>
            <button className="secondary-button" onClick={stableCallback}>
              useCallback
            </button>
          </div>
          <div className="hook-card">
            <div className="hook-title">useEffect</div>
            <div className="hook-meta">Latest changes:</div>
            <ul className="hook-list">
              {log.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hook-card">
            <div className="hook-title">useRef</div>
            <div className="hook-meta">
              Pointer: {pointer.current.x}, {pointer.current.y}
            </div>
          </div>
          <div className="hook-card">
            <div className="hook-title">useReducer</div>
            <div className="hook-meta">Total: {reducerState.total}</div>
            <div className="hook-actions">
              <button
                className="secondary-button"
                onClick={() => dispatch({ type: 'add' })}
              >
                Add
              </button>
              <button
                className="secondary-button"
                onClick={() => dispatch({ type: 'reset' })}
              >
                Reset
              </button>
            </div>
          </div>
          <ContextConsumer
            valueLabel={contextValue ? 'Enabled' : 'Disabled'}
            onToggle={toggleContext}
          />
          <div className="hook-card">
            <div className="hook-title">useTransition + useDeferredValue</div>
            <input
              className="input"
              type="text"
              placeholder="Filter list"
              value={filterInput}
              onChange={(event) => {
                const next = event.target.value
                setFilterInput(next)
                startTransition(() => setFilter(next))
              }}
            />
            <div className="hook-meta">
              {isPending ? 'Updating list...' : `${filteredItems.length} items`}
            </div>
          </div>
        </div>
        </div>

        <div className="card">
          <div className="card-title">Custom hooks</div>
          <p className="page-description">
            Custom hooks start simple and grow to handle async work and
            pagination.
          </p>
          <div className="hooks-grid">
            <div className="hook-card">
              <div className="hook-title">useCounter</div>
              <div className="hook-meta">
                Count: {count} (double: {double})
              </div>
              <div className="hook-actions">
                <button className="secondary-button" onClick={() => decrement()}>
                  -
                </button>
                <button className="secondary-button" onClick={() => increment()}>
                  +
                </button>
                <button className="secondary-button" onClick={reset}>
                  Reset
                </button>
              </div>
            </div>
            <div className="hook-card">
              <div className="hook-title">useToggle</div>
              <div className="hook-meta">Switch is {isOn ? 'ON' : 'OFF'}</div>
              <button className="secondary-button" onClick={toggleSwitch}>
                Toggle
              </button>
            </div>
            <div className="hook-card">
              <div className="hook-title">useDebounce</div>
              <input
                className="input"
                type="text"
                placeholder="Type to debounce"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="hook-meta">Debounced: {debouncedSearch}</div>
            </div>
            <div className="hook-card">
              <div className="hook-title">useThrottle</div>
              <input
                className="input"
                type="text"
                placeholder="Type to throttle"
                value={throttleInput}
                onChange={(event) => {
                  const next = event.target.value
                  setThrottleInput(next)
                  throttledUpdate(next)
                }}
              />
              <div className="hook-meta">Throttled: {throttledValue}</div>
            </div>
            <div className="hook-card">
              <div className="hook-title">useLocalStorage</div>
              <input
                className="input"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <div className="hook-meta">Stored across reloads.</div>
            </div>
            <div className="hook-card">
              <div className="hook-title">usePagination</div>
              <div className="hook-meta">
                Page {page} / {totalPages}
              </div>
              <ul className="hook-list">
                {pagedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="hook-actions">
                <button className="secondary-button" onClick={prev}>
                  Prev
                </button>
                <button className="secondary-button" onClick={next}>
                  Next
                </button>
              </div>
            </div>
            <div className="hook-card">
              <div className="hook-title">useAsync</div>
              <div className="hook-meta">{data || 'No data yet'}</div>
              {error ? <div className="error">{error}</div> : null}
              <button className="secondary-button" onClick={run}>
                {loading ? 'Loading...' : 'Run async'}
              </button>
            </div>
            <div className="hook-card">
              <div className="hook-title">useInterval</div>
              <div className="hook-meta">Ticks: {ticks}</div>
            </div>
          </div>
        </div>
      </section>
    </DemoContext.Provider>
  )
}

export default Hooks
