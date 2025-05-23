<template>
  <v-skeleton-loader
    v-if="isNil(programs) || isLoading"
    type="card"
  />
  <div v-else>
    <v-alert
      v-for="(program, index) of programs"
      :key="index"
      type="info"
      color="success"
      class="mb-5 white-text"
      title="Pending Program Application"
    >
      We are still processing an application for the {{ program.name }} program, submitted on
      {{ formatDate(program.createdAt) }}.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import { formatDate } from "@/utils/formatters"

import useVendor from "@/use/use-vendor"
import usePrograms from "@/use/use-programs"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)
const { vendor } = useVendor(vendorId)

const query = computed(() => {
  if (isNil(vendor.value)) return {}

  return {
    filters: {
      withPendingVendor: vendor.value.id,
    },
  }
})

const { programs, isLoading } = usePrograms(query, { skipWatchIf: () => isNil(vendor.value) })
</script>
