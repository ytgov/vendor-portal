<template>
  <v-card variant="outlined">
    <v-card-title>Vendor Information</v-card-title>
    <v-card-text>
      <v-form
        horizontal
        readonly
      >
        <v-label>Name</v-label>
        <v-text-field
          :model-value="vendor.name"
          append-inner-icon="mdi-lock"
        />
        <v-label>Vendor ID</v-label>
        <v-text-field
          :model-value="vendor.vendorId"
          append-inner-icon="mdi-lock"
        />
        <v-label>Address</v-label>
        <v-textarea
          :model-value="vendor.address"
          append-inner-icon="mdi-lock"
          rows="3"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Vendor } from "@/use/use-vendor"
import { computed } from "vue"

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)
</script>
