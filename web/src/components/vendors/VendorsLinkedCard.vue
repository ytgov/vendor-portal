<template>
  <div
    v-for="(vendor, index) in vendors"
    :key="index"
  >
    <VendorLinkCard :vendor-id="vendor.id" />
  </div>
  <div v-if="isEmpty(vendors)">
    <p>No linked vendors</p>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"
import { computed } from "vue"

import useVendors, { VendorQueryOptions } from "@/use/use-vendors"

import VendorLinkCard from "@/components/vendors/VendorLinkCard.vue"

const query = computed<VendorQueryOptions>(() => {
  return {
    where: {},
    filters: {},
    perPage: 10,
    page: 1,
  }
})

const { vendors } = useVendors(query)
</script>
