import { describe, expect, it } from 'vitest'
import { buildRange, formatNumber } from '@admin/shared'

// Unit tests verify shared utilities in the monorepo.
describe('shared utilities', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('builds an inclusive range', () => {
    expect(buildRange(3, 5)).toEqual([3, 4, 5])
  })
})
