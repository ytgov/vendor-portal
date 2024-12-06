<template>
  <v-card>
    <v-card-title>Vendor Information</v-card-title>
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-store</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor ID: </strong><br />{{ vendor.vendorId }}
        </div>
      </div>

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-map</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Address: </strong><br />2 Stope Way<br />Whitehorse YT, Y1A0B3
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Vendor } from "@/use/use-vendor"
import { computed } from "vue"

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)
</script>
