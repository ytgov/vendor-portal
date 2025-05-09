<template>
  <VendorLinkRequestsDataTableServer @clicked="goToVendorLinkRequestPage" />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorLinkRequestsDataTableServer from "@/components/vendor-link-requests/VendorLinkRequestsDataTableServer.vue"

const router = useRouter()

function goToVendorLinkRequestPage(vendorLinkRequestId: number) {
  router.push({ name: "administration/VendorLinkRequestPage", params: { vendorLinkRequestId } })
}

useBreadcrumbs("Manage Vendor Link Requests", [
  { title: "Vendor Link Requests", to: { name: "administration/VendorLinkRequestsManagePage" } },
])
</script>
