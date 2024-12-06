<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="image"
  ></v-skeleton-loader>

  <v-card
    v-else-if="vendor"
    class="mb-5"
    @click="goToVendor"
  >
    <v-card-title>{{ vendor.name }} <small style="color: #888"></small></v-card-title>
    <!--  <v-card-subtitle>{{ vendor.vendorId }}</v-card-subtitle> -->
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

      <div class="d-flex mb-3">
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

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-handshake</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Programs: </strong><br />
          Paid Sick Leave Rebate
        </div>
      </div>
    </v-card-text>
    <v-card-text>
      <v-btn
        block
        @click="goToVendor"
        >Go To Vendor
      </v-btn>
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
