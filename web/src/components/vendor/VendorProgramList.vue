<template>
  <h3 class="mb-3">Enrolled Programs</h3>

  <v-card
    v-for="program of vendor.programs"
    :key="program.id"
    class="mb-5"
    @click="openVendorProgram(program)"
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
  <router-link :to="`/programs`">
    <v-icon>mdi-magnify</v-icon> Find additional programs
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import { Vendor } from "@/use/use-vendor"
import { VendorProgram } from "@/api/vendor-programs-api"

const router = useRouter()

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)

function openVendorProgram(program: VendorProgram) {
  router.push(`/vendor/${vendor.value.vendorId}/programs/${program.slug}`)
}
</script>
