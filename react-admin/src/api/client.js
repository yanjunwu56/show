import { getAccessToken, refreshTokens } from '../auth/auth'
import { handleRequest } from './handlers'

const delay = (value, ms = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })

const createClient = () => {
  const requestInterceptors = []
  const responseInterceptors = []

  const useRequest = (interceptor) => {
    requestInterceptors.push(interceptor)
  }

  const useResponse = (interceptor) => {
    responseInterceptors.push(interceptor)
  }

  const runRequestInterceptors = async (config) => {
    let next = config
    for (const interceptor of requestInterceptors) {
      next = (await interceptor(next)) || next
    }
    return next
  }

  const runResponseInterceptors = async (response, config) => {
    let next = response
    for (const interceptor of responseInterceptors) {
      next = (await interceptor(next, config)) || next
    }
    return next
  }

  const request = async (config) => {
    let prepared = await runRequestInterceptors({
      method: 'GET',
      headers: {},
      data: null,
      ...config,
    })

    let response = await delay(handleRequest(prepared))
    response = await runResponseInterceptors(response, prepared)

    if (response.status === 401) {
      // Refresh token and retry once when access token expired.
      try {
        refreshTokens()
        prepared = await runRequestInterceptors(prepared)
        response = await delay(handleRequest(prepared))
      } catch (error) {
        const sessionError = new Error('Session expired')
        sessionError.status = 401
        throw sessionError
      }
    }

    if (response.status >= 400) {
      const error = new Error(response.data?.message || 'Request failed')
      error.status = response.status
      throw error
    }

    return response.data
  }

  return {
    request,
    useRequest,
    useResponse,
  }
}

const client = createClient()

client.useRequest((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.useResponse((response) => {
  if (response.status >= 400) {
    console.error('[API] error response', response.status)
  }
  return response
})

const get = (url) => client.request({ url, method: 'GET' })
const post = (url, data) => client.request({ url, method: 'POST', data })

export { get, post }
