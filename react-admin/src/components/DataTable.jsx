import { useMemo, useState } from 'react'

function DataTable({ columns, rows, pageSizeOptions = [5, 10, 20] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [sortKey, setSortKey] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [hiddenColumns, setHiddenColumns] = useState(new Set())

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hiddenColumns.has(column.key)),
    [columns, hiddenColumns],
  )

  // Search across filterable columns.
  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((row) =>
      columns.some((column) => {
        if (column.filterable === false) return false
        const value = row[column.key]
        return String(value ?? '').toLowerCase().includes(term)
      }),
    )
  }, [columns, rows, searchTerm])

  // Stable, client-side sorting for demo tables.
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows
    const rowsCopy = [...filteredRows]
    rowsCopy.sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      if (typeof left === 'number' && typeof right === 'number') {
        return sortDirection === 'asc' ? left - right : right - left
      }
      const leftText = String(left ?? '')
      const rightText = String(right ?? '')
      return sortDirection === 'asc'
        ? leftText.localeCompare(rightText)
        : rightText.localeCompare(leftText)
    })
    return rowsCopy
  }, [filteredRows, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const pagedRows = sortedRows.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  const gridStyle = {
    gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))`,
  }

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setPage(1)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  return (
    <div className="data-table">
      <div className="table-controls">
        <input
          className="input"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="table-actions">
          <label className="table-select">
            <span>Rows</span>
            <select
              className="input small-input"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <details className="table-columns">
            <summary>Columns</summary>
            <div className="table-columns-list">
              {columns.map((column) => (
                <label key={column.key}>
                  <input
                    type="checkbox"
                    checked={!hiddenColumns.has(column.key)}
                    onChange={() => toggleColumn(column.key)}
                  />
                  {column.label}
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="table">
        <div className="table-head" style={gridStyle}>
          {visibleColumns.map((column) => (
            <button
              key={column.key}
              type="button"
              className="table-head-cell"
              onClick={() =>
                column.sortable === false ? null : toggleSort(column.key)
              }
            >
              {column.label}
              {sortKey === column.key ? (
                <span className="sort-indicator">
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {pagedRows.map((row) => (
          <div key={row.id || row.name} className="table-row" style={gridStyle}>
            {visibleColumns.map((column) => (
              <span key={column.key}>{row[column.key]}</span>
            ))}
          </div>
        ))}
        {pagedRows.length === 0 ? (
          <div className="table-row empty" style={gridStyle}>
            <span>No results</span>
          </div>
        ) : null}
      </div>

      <div className="table-footer">
        <span>
          Page {page} of {totalPages} · {sortedRows.length} results
        </span>
        <div className="pager">
          <button
            className="secondary-button"
            type="button"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Prev
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(Math.min(totalPages, page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
