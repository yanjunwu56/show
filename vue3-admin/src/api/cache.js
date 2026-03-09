const cache = new Map()

// Cache wrapper with a simple TTL.
const cached = async (key, ttl, fetcher) => {
  const now = Date.now()
  const entry = cache.get(key)
  if (entry && entry.expiresAt > now) {
    return entry.value
  }
  const value = await fetcher()
  cache.set(key, { value, expiresAt: now + ttl })
  return value
}

const clearCache = (key) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

export { cached, clearCache }
