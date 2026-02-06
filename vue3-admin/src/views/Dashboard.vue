<script setup>
const stats = [
  { label: 'Active users', value: '1,248', change: '+12%' },
  { label: 'New orders', value: '320', change: '+8%' },
  { label: 'Tickets', value: '18', change: '-4%' },
  { label: 'Conversion', value: '4.6%', change: '+0.8%' }
]

const tasks = [
  { title: 'Review new merchant requests', owner: 'Cindy', due: 'Today' },
  { title: 'Approve refund batch', owner: 'Leo', due: 'Tomorrow' },
  { title: 'Check inventory alerts', owner: 'Mia', due: 'This week' }
]

const activities = [
  { title: 'Payment confirmed for order #3841', time: '2 min ago' },
  { title: 'New user registered: Omar K.', time: '18 min ago' },
  { title: 'Server autoscaling completed', time: '1 hour ago' }
]

const orders = [
  { id: 'ORD-3841', customer: 'Ava Wilson', total: '$1,240', status: 'Paid' },
  { id: 'ORD-3842', customer: 'Noah Carter', total: '$980', status: 'Pending' },
  { id: 'ORD-3843', customer: 'Liam Hart', total: '$320', status: 'Refund' },
  { id: 'ORD-3844', customer: 'Emma Stone', total: '$540', status: 'Paid' }
]
</script>

<template>
  <section class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="card stat-card">
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-change">{{ stat.change }}</div>
      </div>
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
        <div class="table-head">
          <span>Order</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
        </div>
        <div v-for="order in orders" :key="order.id" class="table-row">
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
