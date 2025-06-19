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

      <VendorLinkRequestsDataTableServer
        :filters="filters"
        @clicked="goToVendorLinkRequestPage"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorLinkRequestsDataTableServer from "@/components/vendor-link-requests/VendorLinkRequestsDataTableServer.vue"

const router = useRouter()

const search = ref("")

const filters = computed(() => ({
  search: search.value,
}))

function goToVendorLinkRequestPage(vendorLinkRequestId: number) {
  router.push({ name: "administration/VendorLinkRequestPage", params: { vendorLinkRequestId } })
}

useBreadcrumbs("Manage Vendor Link Requests", [
  { title: "Vendor Link Requests", to: { name: "administration/VendorLinkRequestsManagePage" } },
])
</script>
