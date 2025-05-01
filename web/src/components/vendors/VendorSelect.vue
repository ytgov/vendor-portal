<template>
  <v-select
    label="Vendor"
    :items="vendors"
    item-title="name"
    item-value="id"
  />
</template>

<script setup lang="ts">
import useVendors from "@/use/use-vendors"

const { vendors } = useVendors()
</script>
