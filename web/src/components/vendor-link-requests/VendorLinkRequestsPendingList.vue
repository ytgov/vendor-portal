<template>
  <v-list
    class="py-0 mt-0"
    title="Pending Link Request"
  >
    <div
      v-for="(vendorLinkRequest, idx) of vendorLinkRequests"
      :key="vendorLinkRequest.id"
    >
      <v-list-item
        class="py-2"
        :title="`${vendorLinkRequest.user?.displayName} - (${vendorLinkRequest.businessName})`"
        :subtitle="buildSubtitle(vendorLinkRequest)"
        @click="goToVendorLinkRequest(vendorLinkRequest)"
      />
      <v-divider v-if="idx < vendorLinkRequests.length - 1" />
    </div>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

import { formatDate, formatDateRelative } from "@/utils/formatters"

import { VendorLinkRequest, VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"

import useVendorLinkRequests, {
  type VendorLinkRequestQueryOptions,
} from "@/use/use-vendor-link-requests"

const query = ref<VendorLinkRequestQueryOptions>({
  where: {
    status: VendorLinkRequestStatuses.PENDING,
  },
})

const { vendorLinkRequests } = useVendorLinkRequests(query)

const router = useRouter()

function buildSubtitle(vendorLinkRequest: VendorLinkRequest) {
  return (
    "Submitted " +
    formatDate(vendorLinkRequest.createdAt) +
    " (" +
    formatDateRelative(vendorLinkRequest.createdAt) +
    ")"
  )
}

function goToVendorLinkRequest(vendorLinkRequest: VendorLinkRequest) {
  router.push({
    name: "administration/VendorLinkRequestPage",
    params: { vendorLinkRequestId: vendorLinkRequest.id },
  })
}
</script>
