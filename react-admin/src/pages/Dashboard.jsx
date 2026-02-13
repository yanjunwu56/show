import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { fetchDashboard } from '../api'

const buildChart = (chart) => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Revenue', 'Orders'] },
  grid: { left: 8, right: 16, bottom: 8, top: 32, containLabel: true },
  xAxis: {
    type: 'category',
    data: chart.categories,
    axisLine: { lineStyle: { color: '#cbd5f5' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: '#e2e8f0' } },
  },
  series: [
    {
      name: 'Revenue',
      type: 'line',
      smooth: true,
      data: chart.revenue,
      color: '#38bdf8',
    },
    {
      name: 'Orders',
      type: 'bar',
      data: chart.orders,
      color: '#0f172a',
      barMaxWidth: 24,
    },
  ],
})

function Dashboard() {
  const orderGridStyle = { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }
  const [stats, setStats] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [orders, setOrders] = useState([])
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    let active = true
    fetchDashboard().then((data) => {
      if (!active) return
      setStats(data.stats)
      setTasks(data.tasks)
      setActivities(data.activities)
      setOrders(data.orders)
      setChartData(data.chart)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!chartData || !chartRef.current) return
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current)
    }
    chartInstanceRef.current.setOption(buildChart(chartData))
  }, [chartData])

  useEffect(() => {
    const handleResize = () => chartInstanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(
    () => () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    },
    [],
  )

  return (
    <section className="dashboard">
      <p className="page-description">
        This dashboard loads mock data and renders an ECharts summary. Use the
        sidebar star icons to build shortcuts, and follow breadcrumbs above.
      </p>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="card chart-card">
        <div className="card-title">Weekly revenue trend</div>
        <div className="card-subtitle">
          Combined line and bar chart rendered with ECharts.
        </div>
        {loading ? (
          <div className="loading">Loading chart...</div>
        ) : (
          <div ref={chartRef} className="chart-container"></div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Pending tasks</div>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.title} className="list-item">
                <div className="list-title">{task.title}</div>
                <div className="list-meta">
                  Owner: {task.owner} · Due: {task.due}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-title">Recent activity</div>
          <ul className="list">
            {activities.map((item) => (
              <li key={item.title} className="list-item">
                <div className="list-title">{item.title}</div>
                <div className="list-meta">{item.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-title">Latest orders</div>
        <div className="table">
          <div className="table-head" style={orderGridStyle}>
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {loading ? (
            <div className="table-row" style={orderGridStyle}>
              <span>Loading...</span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : null}
          {orders.map((order) => (
            <div key={order.id} className="table-row" style={orderGridStyle}>
              <span>{order.id}</span>
              <span>{order.customer}</span>
              <span>{order.total}</span>
              <span className={`tag tag-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
