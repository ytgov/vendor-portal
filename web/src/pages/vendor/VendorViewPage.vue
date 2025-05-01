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
        <VendorProgramPendingList :vendor-id="vendorId" />

        <h3 class="mb-3">Enrolled Programs</h3>

        <VendorProgramList :vendor-id="vendorId" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"

import VendorDetailsCard from "@/components/vendors/VendorDetailsCard.vue"
import VendorPeopleCard from "@/components/vendors/VendorPeopleCard.vue"
import VendorProgramPendingList from "@/components/vendor-programs/VendorProgramPendingList.vue"
import VendorProgramList from "@/components/vendor-programs/VendorProgramList.vue"

const props = defineProps<{ vendorId: string }>()
const vendorId = ref(props.vendorId)
const { vendor, isLoading } = useVendor(vendorId)

watch(
  () => vendor.value,
  (newVal) => {
    if (newVal && newVal.id) setBreadcrumbs()
  }
)

setBreadcrumbs()

function setBreadcrumbs() {
  if (vendor.value) {
    useBreadcrumbs("", [{ title: `${vendor.value.name}`, to: "" }])
  } else {
    useBreadcrumbs("", [{ title: "Loading...", to: "" }])
  }
}
</script>
