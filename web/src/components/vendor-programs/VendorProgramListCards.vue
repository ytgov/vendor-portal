<template>
  <v-skeleton-loader
    v-if="isNil(programs)"
    type="card"
  />
  <div v-else>
    <v-card
      v-for="(program, index) of programs"
      :key="index"
      class="mb-5"
      @click="openVendorProgram(program.id)"
    >
      <v-card-title>{{ program.name }}</v-card-title>
      <v-card-text>
        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-office-building</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Department: </strong><br />{{ program.department }}
          </div>
        </div>
        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-calendar</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Enrolled Since: </strong><br />
            {{ formatDate(program.createdAt) }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <router-link :to="{ name: 'programs/ProgramsAvailablePage' }">
    <v-icon>mdi-magnify</v-icon> Find additional programs
  </router-link>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, toRefs, watch } from "vue"

import { formatDate } from "@/utils/formatters"

import programsApi, { Program, ProgramQueryOptions } from "@/api/programs-api"

import { useVendor } from "@/use/use-vendor"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)
const { vendor } = useVendor(vendorId)

const programs = ref<Program[] | null>(null)

watch(
  () => vendor.value,
  async () => {
    if (!isNil(vendor.value)) {
      const query: ProgramQueryOptions = {
        filters: {
          withAcceptedVendor: vendor.value.id,
        },
      }

      const data = await programsApi.list(query)
      programs.value = data.programs
    }
  }
)

function openVendorProgram(programId: number) {
  console.log("openVendorProgram ", { programId })
}
</script>
