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
        <VendorDetailsCard :vendor-id="vendorId" />
        <VendorPeopleCard :vendor-id="vendorId" />
      </v-col>
      <v-col>
        <v-alert
          type="info"
          color="success"
          class="mb-5 white-text"
          title="Pending Program Application"
          >We are still processing an application for the Paid Sick Leave Rebate program, submitted
          on Monday, November 21, 2024.
        </v-alert>
        <VendorProgramList :vendor-id="vendorId" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import useVendor from "@/use/use-vendor"
import { computed, watch } from "vue"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

import VendorDetailsCard from "@/components/vendor/VendorDetailsCard.vue"
import VendorPeopleCard from "@/components/vendor/VendorPeopleCard.vue"
import VendorProgramList from "@/components/vendor/VendorProgramList.vue"

const props = defineProps<{ vendorId: string }>()
const vendorIdNumber = computed(() => parseInt(props.vendorId))

const { vendor, isLoading } = useVendor(vendorIdNumber)

watch(
  () => vendor.value,
  (newVal) => {
    if (newVal && newVal.id) setBreadcrumbs()
  }
)

setBreadcrumbs()

function setBreadcrumbs() {
  if (vendor.value) {
    useBreadcrumbs(vendor.value.name, [BASE_CRUMB])
  } else {
    useBreadcrumbs("", [{ title: "Loading...", to: "" }])
  }
}
</script>
