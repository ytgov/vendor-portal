<template>
  <v-skeleton-loader
    v-if="isNil(vendor) || isLoading"
    type="chip"
  />
  <div v-else>
    {{ vendor.name }}
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import useVendor from "@/use/use-vendor"

const props = defineProps<{
  vendorId: number
}>()

const { vendorId } = toRefs(props)
const { vendor, isLoading } = useVendor(vendorId)
</script>
