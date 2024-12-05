<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="image"
  ></v-skeleton-loader>

  <v-card
    v-else-if="vendor"
    variant="outlined"
    @click="goToVendor"
  >
    <v-card-title>{{ vendor.name }}</v-card-title>
    <v-card-subtitle>{{ vendor.vendorId }}</v-card-subtitle>
    <v-card-text>
      <pre
        style="
          font-family:
            Roboto,
            sans serif;
        "
        >{{ vendor.address }}</pre
      >
      <br />{{ programText }}
    </v-card-text>
  </v-card>
  <div v-else>Error loading vendor information</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import useVendor from "@/use/use-vendor"

const props = defineProps<{ vendorId: string }>()
const vendorId = computed(() => {
  return props.vendorId
})

const router = useRouter()
const { vendor, isLoading } = useVendor(vendorId)

const programText = computed(() => {
  if (vendor.value) {
    return (
      `Currently enrolled in ${vendor.value.programs.length} program` +
      (vendor.value.programs.length != 1 ? "s" : "")
    )
  }
  return ""
})

function goToVendor() {
  router.push({ name: "vendor/HomePage", params: { vendorId: vendor.value?.vendorId } })
}
</script>
