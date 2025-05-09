<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <div v-if="vendor">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <VendorDetailsCard :vendor-id="vendor.id" />
        <VendorPeopleCard :vendor-id="vendor.id" />
      </v-col>
      <v-col>
        <VendorProgramPendingListAlerts :vendor-id="vendor.id" />

        <h3 class="mb-3">Enrolled Programs</h3>

        <VendorProgramListCards :vendor-id="vendor.id" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"

import VendorDetailsCard from "@/components/vendors/VendorDetailsCard.vue"
import VendorPeopleCard from "@/components/vendors/VendorPeopleCard.vue"
import VendorProgramPendingListAlerts from "@/components/vendor-programs/VendorProgramPendingListAlerts.vue"
import VendorProgramListCards from "@/components/vendor-programs/VendorProgramListCards.vue"

const props = defineProps<{ vendorId: string }>()
const { vendorId } = toRefs(props)

const { vendor, isLoading } = useVendor(vendorId)

const breadcrumbs = computed(() => {
  if (vendor.value) {
    return [{ title: `${vendor.value.name}`, to: "" }]
  }

  return [{ title: "Loading...", to: "" }]
})

useBreadcrumbs("", breadcrumbs)
</script>
