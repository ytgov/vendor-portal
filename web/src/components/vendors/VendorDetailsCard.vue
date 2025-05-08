<template>
  <v-skeleton-loader
    v-if="isNil(vendor)"
    type="card"
  />
  <v-card
    v-else
    class="mb-5"
  >
    <v-card-title>Vendor Information</v-card-title>
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
        >
          mdi-store
        </v-icon>
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor ID: </strong><br />{{ vendor.vendorId }}
        </div>
      </div>

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
        >
          mdi-map
        </v-icon>
        <div class="ml-2 text-subtitle-1">
          <strong>Address: </strong><br />2 Stope Way<br />Whitehorse YT, Y1A0B3
        </div>
      </div>
    </v-card-text>

    <v-card-text>
      <v-btn block>Update this Information</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { toRefs } from "vue"

import { useVendor } from "@/use/use-vendor"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)
const { vendor } = useVendor(vendorId)
</script>
