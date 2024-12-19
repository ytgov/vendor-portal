<template>
  <v-select
    label="Vendor"
    :items="items"
    item-title="name"
    item-value="id"
  />
</template>

<script setup lang="ts">
import { ref } from "vue"

const items = ref([{ id: 12, name: "Ice Fog Analytics Inc." }])
</script>
