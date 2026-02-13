<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '../i18n'

const route = useRoute()

const crumbs = computed(() =>
  route.matched
    .filter((record) => record.meta?.title)
    .map((record) => ({
      label: record.meta?.titleKey ? t(record.meta.titleKey) : record.meta.title,
      to: record.path
    }))
)
</script>

<template>
  <nav class="breadcrumbs">
    <RouterLink
      v-for="(crumb, index) in crumbs"
      :key="crumb.to"
      :to="crumb.to"
      class="breadcrumb"
      :class="{ current: index === crumbs.length - 1 }"
    >
      {{ crumb.label }}
      <span v-if="index !== crumbs.length - 1" class="breadcrumb-sep">/</span>
    </RouterLink>
  </nav>
</template>
