<template>
  <v-card class="mb-5">
    <v-card-title>Matched Vendor Information</v-card-title>
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-store</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor Name: </strong><br />{{ vendor.name }}
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
      <p class="mt-5">If this match is correct, please click the "Continue" button below.</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Vendor } from "@/use/use-vendor"
import { computed } from "vue"

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)
</script>
