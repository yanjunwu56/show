<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  pageSizeOptions: {
    type: Array,
    default: () => [5, 10, 20]
  },
  initialSort: {
    type: Object,
    default: () => ({ key: '', direction: 'asc' })
  }
})

const searchTerm = ref('')
const page = ref(1)
const pageSize = ref(props.pageSizeOptions[0])
const sortKey = ref(props.initialSort.key)
const sortDirection = ref(props.initialSort.direction)
const hiddenColumns = ref(new Set())

const visibleColumns = computed(() =>
  props.columns.filter((column) => !hiddenColumns.value.has(column.key))
)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${visibleColumns.value.length}, minmax(0, 1fr))`
}))

// Search across filterable columns.
const filteredRows = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return props.rows
  return props.rows.filter((row) =>
    props.columns.some((column) => {
      if (column.filterable === false) return false
      const value = row[column.key]
      return String(value ?? '').toLowerCase().includes(term)
    })
  )
})

// Stable, client-side sorting for demo tables.
const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value
  const rowsCopy = [...filteredRows.value]
  rowsCopy.sort((a, b) => {
    const left = a[sortKey.value]
    const right = b[sortKey.value]
    if (typeof left === 'number' && typeof right === 'number') {
      return sortDirection.value === 'asc' ? left - right : right - left
    }
    const leftText = String(left ?? '')
    const rightText = String(right ?? '')
    return sortDirection.value === 'asc'
      ? leftText.localeCompare(rightText)
      : rightText.localeCompare(leftText)
  })
  return rowsCopy
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
)

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const toggleColumn = (key) => {
  const next = new Set(hiddenColumns.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  hiddenColumns.value = next
}

watch([searchTerm, pageSize, filteredRows], () => {
  page.value = 1
})
</script>

<template>
  <div class="data-table">
    <div class="table-controls">
      <input
        v-model="searchTerm"
        class="input"
        type="text"
        placeholder="Search"
      />
      <div class="table-actions">
        <label class="table-select">
          <span>Rows</span>
          <select v-model.number="pageSize" class="input small-input">
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </label>
        <details class="table-columns">
          <summary>Columns</summary>
          <div class="table-columns-list">
            <label v-for="column in columns" :key="column.key">
              <input
                type="checkbox"
                :checked="!hiddenColumns.has(column.key)"
                @change="toggleColumn(column.key)"
              />
              {{ column.label }}
            </label>
          </div>
        </details>
      </div>
    </div>

    <div class="table">
      <div class="table-head" :style="gridStyle">
        <button
          v-for="column in visibleColumns"
          :key="column.key"
          class="table-head-cell"
          type="button"
          @click="column.sortable === false ? null : toggleSort(column.key)"
        >
          {{ column.label }}
          <span v-if="sortKey === column.key" class="sort-indicator">
            {{ sortDirection === 'asc' ? '▲' : '▼' }}
          </span>
        </button>
      </div>
      <div
        v-for="row in pagedRows"
        :key="row.id || row.name"
        class="table-row"
        :style="gridStyle"
      >
        <span v-for="column in visibleColumns" :key="column.key">
          {{ row[column.key] }}
        </span>
      </div>
      <div v-if="!pagedRows.length" class="table-row empty" :style="gridStyle">
        <span>No results</span>
      </div>
    </div>

    <div class="table-footer">
      <span>
        Page {{ page }} of {{ totalPages }} · {{ sortedRows.length }} results
      </span>
      <div class="pager">
        <button
          class="secondary-button"
          type="button"
          :disabled="page === 1"
          @click="page = Math.max(1, page - 1)"
        >
          Prev
        </button>
        <button
          class="secondary-button"
          type="button"
          :disabled="page === totalPages"
          @click="page = Math.min(totalPages, page + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
