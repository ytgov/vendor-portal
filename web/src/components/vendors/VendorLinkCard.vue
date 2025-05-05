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
          <strong>Address:</strong>
          <div
            v-for="(line, index) in formatAddressLines(vendor)"
            :key="index"
          >
            {{ line }}
          </div>
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

          <div
            v-for="(program, index) in programs"
            :key="index"
          >
            {{ program.name }}
          </div>
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
import { computed, toRefs } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import useVendor, { Vendor } from "@/use/use-vendor"
import usePrograms, { ProgramQueryOptions } from "@/use/use-programs"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)

const router = useRouter()

const { vendor, isLoading } = useVendor(vendorId)

const programsQuery = computed<ProgramQueryOptions>(() => {
  if (isNil(vendor.value)) return {} // where 1 == 0 ?

  return {
    filters: {
      withAcceptedVendor: vendor.value.id,
    },
  }
})

const { programs } = usePrograms(programsQuery, { skipWatchIf: () => isNil(vendor.value) })

function formatAddressLines(vendor: Vendor): string[] {
  const parts = []

  if (vendor.addressLine1) {
    parts.push(vendor.addressLine1)
  } else if (vendor.addressLine2) {
    parts.push(vendor.addressLine2)
  }

  parts.push(`${vendor.addressCity} ${vendor.addressProvince}, ${vendor.addressPostal}`)

  return parts.filter((part) => part.trim() !== "")
}

function goToVendor() {
  router.push({ name: "vendor/HomePage", params: { vendorId: vendor.value?.vendorId } })
}
</script>
