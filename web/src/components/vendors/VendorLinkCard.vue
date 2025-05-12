<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(vendor)"
    type="image"
  />
  <SimpleCard
    v-else
    class="mb-5"
    :title="vendor.name"
    @click="goToVendor"
  >
    <div class="d-flex mb-3">
      <v-icon
        class="mt-2"
        size="40"
        color="#7A9A01"
        icon="mdi-store"
      />
      <div class="ml-2 text-subtitle-1">
        <strong>Vendor ID: </strong><br />{{ vendor.vendorId }}
      </div>
    </div>

    <div class="d-flex mb-3">
      <v-icon
        class="mt-2"
        size="40"
        color="#7A9A01"
        icon="mdi-map"
      />
      <div class="ml-2 text-subtitle-1">
        <strong>Address:</strong>
        <div
          v-for="(line, index) in formatVendorAddressLines(vendor)"
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
        icon="mdi-handshake"
      />
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

    <v-btn
      block
      class="mt-5"
      text="Go To Vendor"
      @click="goToVendor"
    />
  </SimpleCard>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue"
import { useRouter } from "vue-router"
import { isNil } from "lodash"

import { formatVendorAddressLines } from "@/utils/format-vendor-address-lines"

import useVendor from "@/use/use-vendor"
import usePrograms, { ProgramQueryOptions } from "@/use/use-programs"

import SimpleCard from "@/components/common/SimpleCard.vue"

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

function goToVendor() {
  router.push({ name: "vendor/HomePage", params: { vendorId: vendor.value?.vendorId } })
}
</script>
