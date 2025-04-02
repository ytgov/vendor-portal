<template>
  <h3 class="mb-3">Linked Accounts</h3>
  <v-skeleton-loader
    v-if="isNil(vendor)"
    type="card"
  />
  <div v-else>
    <v-card class="mb-5">
      <v-card-title>Michael Johnson (Vendor Admin)</v-card-title>
      <v-card-text>
        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-account</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Linked to {{ vendor.name }} on: </strong><br />February 10, 2024<br />
            <strong>Approved by: </strong><br />Department of Finance
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Jack London</v-card-title>
      <v-card-text>
        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-account</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Linked to {{ vendor.name }} on: </strong><br />February 25, 2024<br />
            <strong>Approved by: </strong><br />Michael Johnson
          </div>
        </div>
        <v-btn color="warning">Unlink</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import { useVendor } from "@/use/use-vendor"

const props = defineProps<{ vendorId: string }>()
const vendorIdNumber = computed(() => parseInt(props.vendorId))
const { vendor } = useVendor(vendorIdNumber)
</script>
