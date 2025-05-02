<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(vendor)"
    type="image"
  />
  <v-card
    v-else
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
        >
          mdi-store
        </v-icon>
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor ID: </strong><br />{{ vendor.vendorId }}
        </div>
      </div>

      <div class="d-flex mb-3">
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

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
        >
          mdi-handshake
        </v-icon>
        <div class="ml-2 text-subtitle-1">
          <strong>Programs: </strong><br />
          Paid Sick Leave Rebate
        </div>
      </div>
    </v-card-text>
    <v-card-text>
      <v-btn
        block
        text="Go To Vendor"
        @click="goToVendor"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toRefs } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import useVendor from "@/use/use-vendor"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)

const router = useRouter()

const { vendor, isLoading } = useVendor(vendorId)

function goToVendor() {
  router.push({ name: "vendor/HomePage", params: { vendorId: vendor.value?.vendorId } })
}
</script>
