<template>
  <v-select
    label="Vendor"
    :items="vendors"
    item-title="name"
    item-value="id"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

import useVendors, {
  VendorFiltersOptions,
  VendorQueryOptions,
  VendorWhereOptions,
} from "@/use/use-vendors"

const props = withDefaults(
  defineProps<{
    filters?: VendorFiltersOptions
    where?: VendorWhereOptions
    waiting?: boolean
    perPage?: number
    page?: number
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
    perPage: 10,
    page: 1,
  }
)

const vendorsQuery = computed<VendorQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: props.perPage,
    page: props.page,
  }
})

const { vendors } = useVendors(vendorsQuery)
</script>
