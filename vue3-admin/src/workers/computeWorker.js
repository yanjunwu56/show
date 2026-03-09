/* eslint-disable no-restricted-globals */
// Heavy computation worker: sum primes up to a limit.
const isPrime = (value) => {
  if (value < 2) return false
  if (value === 2) return true
  if (value % 2 === 0) return false
  for (let i = 3; i * i <= value; i += 2) {
    if (value % i === 0) return false
  }
  return true
}

const sumPrimes = (limit) => {
  let sum = 0
  let count = 0
  for (let i = 2; i <= limit; i += 1) {
    if (isPrime(i)) {
      sum += i
      count += 1
    }
  }
  return { sum, count }
}

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {}
  if (type !== 'sumPrimes') return
  const limit = Number(payload?.limit) || 0
  const start = performance.now()
  const result = sumPrimes(limit)
  const duration = Math.round(performance.now() - start)
  self.postMessage({ type: 'sumPrimes', payload: { ...result, duration } })
})
