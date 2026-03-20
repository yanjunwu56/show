// Shared utilities used across Vue and React apps in the monorepo.
const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

const buildRange = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

export { formatNumber, buildRange }
