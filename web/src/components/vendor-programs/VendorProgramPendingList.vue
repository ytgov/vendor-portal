<template>
  <v-skeleton-loader
    v-if="isNil(programs)"
    type="card"
  />
  <div v-else>
    <v-alert
      v-for="program of programs"
      :key="program.id"
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
import { ref, watch } from "vue"

import { formatDate } from "@/utils/formatters"

import programsApi, { Program, ProgramQueryOptions } from "@/api/programs-api"

import useVendor from "@/use/use-vendor"

const props = defineProps<{ vendorId: string }>()
const vendorId = ref(props.vendorId)
const { vendor } = useVendor(vendorId)

const programs = ref<Program[] | null>(null)

watch(vendor, async () => {
  if (!isNil(vendor.value)) {
    const query: ProgramQueryOptions = {
      filters: {
        withPendingVendor: vendor.value.id,
      },
    }

    const data = await programsApi.list(query)
    programs.value = data.programs
  }
})
</script>
