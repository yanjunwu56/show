<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { fetchDashboard } from '../api'

const stats = ref([])
const tasks = ref([])
const activities = ref([])
const orders = ref([])
const chartRef = ref(null)
const loading = ref(true)
const orderGridStyle = { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }
let chartInstance = null
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

const buildChart = (chart) => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Revenue', 'Orders'] },
  grid: { left: 8, right: 16, bottom: 8, top: 32, containLabel: true },
  xAxis: {
    type: 'category',
    data: chart.categories,
    axisLine: { lineStyle: { color: '#cbd5f5' } },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#e2e8f0' } }
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      data: chart.revenue,
      color: '#38bdf8'
    },
    {
      name: 'Orders',
      type: 'bar',
      data: chart.orders,
      color: '#0f172a',
      barMaxWidth: 24
    }
  ]
})

const initChart = (chart) => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(buildChart(chart))
}

onMounted(async () => {
  const data = await fetchDashboard()
  stats.value = data.stats
  tasks.value = data.tasks
  activities.value = data.activities
  orders.value = data.orders
  loading.value = false
  await nextTick()
  initChart(data.chart)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<template>
  <section class="dashboard">
    <p class="page-description">
      This dashboard loads mock data and renders an ECharts summary. Use the
      sidebar star icons to build shortcuts, and follow breadcrumbs above.
    </p>
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="card stat-card">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-change">{{ stat.change }}</div>
      </div>
    </div>

    <div class="card chart-card">
      <div class="card-title">Weekly revenue trend</div>
      <div class="card-subtitle">
        Combined line and bar chart rendered with ECharts.
      </div>
      <div v-if="loading" class="loading">Loading chart...</div>
      <div v-else ref="chartRef" class="chart-container"></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">Pending tasks</div>
        <ul class="list">
          <li v-for="task in tasks" :key="task.title" class="list-item">
            <div class="list-title">{{ task.title }}</div>
            <div class="list-meta">
              Owner: {{ task.owner }} · Due: {{ task.due }}
            </div>
          </li>
        </ul>
      </div>
      <div class="card">
        <div class="card-title">Recent activity</div>
        <ul class="list">
          <li v-for="item in activities" :key="item.title" class="list-item">
            <div class="list-title">{{ item.title }}</div>
            <div class="list-meta">{{ item.time }}</div>
          </li>
        </ul>
      </div>
    </div>

    <div class="card table-card">
      <div class="card-title">Latest orders</div>
      <div class="table">
        <div class="table-head" :style="orderGridStyle">
          <span>Order</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
        </div>
        <div
          v-for="order in orders"
          :key="order.id"
          class="table-row"
          :style="orderGridStyle"
        >
          <span>{{ order.id }}</span>
          <span>{{ order.customer }}</span>
          <span>{{ order.total }}</span>
          <span class="tag" :class="`tag-${order.status.toLowerCase()}`">
            {{ order.status }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
