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
        <VendorDetailsCard :vendor="vendor" />
      </v-col>
      <v-col>
        <VendorProgramList :vendor="vendor" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import VendorDetailsCard from "@/components/vendor/VendorDetailsCard.vue"
import VendorProgramList from "@/components/vendor/VendorProgramList.vue"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"
import { isArray } from "lodash"
import { computed, watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const vendorId = computed(() =>
  isArray(route.params.vendorId) ? route.params.vendorId[0] : route.params.vendorId
)

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
    useBreadcrumbs(vendor.value.name, [BASE_CRUMB])
  } else {
    useBreadcrumbs("", [{ title: "Loading...", to: "" }])
  }
}
</script>
