<template>
  <h3 class="mb-3">Enrolled Programs</h3>

  <v-skeleton-loader
    v-if="isNil(vendor)"
    type="card"
  />
  <div v-else>
    <v-card
      v-for="program of vendor.programs"
      :key="program.id"
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
            <strong>Enrolled Since: </strong><br />November 2, 2023
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>

  <router-link :to="{ name: `programs/HomePage` }">
    <v-icon>mdi-magnify</v-icon> Find additional programs
  </router-link>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { useVendor } from "@/use/use-vendor"

const router = useRouter()

const props = defineProps<{ vendorId: string }>()
const vendorIdNumber = computed(() => parseInt(props.vendorId))
const { vendor } = useVendor(vendorIdNumber)

function openVendorProgram(programId: number) {
  /**
   * Seems like there is a predefined list of programs?
   */

  console.log("opening vendor program with id: ", programId)

  router.push({
    name: "vendor/PSLRVendorPage",
    params: { vendorId: props.vendorId },
  })
}
</script>
