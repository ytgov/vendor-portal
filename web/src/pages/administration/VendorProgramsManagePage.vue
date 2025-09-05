<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
          density="compact"
        />
      </div>

      <VendorProgramsDataTableServer
        :filters="filters"
        @clicked="goToVendorProgramPage"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorProgramsDataTableServer from "@/components/vendor-programs/VendorProgramsDataTableServer.vue"

const router = useRouter()

const search = ref("")

const filters = computed(() => ({
  search: search.value,
}))

function goToVendorProgramPage(vendorProgramId: number) {
  router.push({ name: "administration/VendorProgramPage", params: { vendorProgramId } })
}

useBreadcrumbs("Manage Vendor Programs", [
  { title: "Vendor Programs", to: { name: "administration/VendorProgramsManagePage" } },
])
</script>
