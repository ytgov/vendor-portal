<template>
  <v-card class="mb-5">
    <v-card-title>Matched Vendor Information</v-card-title>
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          icon="mdi-store"
        />
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor Name: </strong><br />{{ vendor.name }}
        </div>
      </div>

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          icon="mdi-map"
        />
        <div class="ml-2 text-subtitle-1">
          <strong>Address:</strong>
          <div>
            <span>{{ vendor.addressLine1 }} {{ vendor.addressLine2 }}</span>
          </div>
          <strong>City:</strong>
          <div>
            {{ vendor.addressCity }}
          </div>
          <strong>Province:</strong>
          <div>
            {{ vendor.addressProvince }}
          </div>
          <strong>Postal Code:</strong>
          <div>
            {{ vendor.addressPostal }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"

import { Vendor } from "@/use/use-vendor"

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)
</script>
