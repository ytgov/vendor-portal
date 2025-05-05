<template>
  <v-list
    class="mb-5 white-text"
    title="Pending Link Request"
  >
    <v-list-item
      v-for="vendorLinkRequest of vendorLinkRequests"
      :key="vendorLinkRequest.id"
      class="pt-0"
      :title="vendorLinkRequest.user?.displayName + ' :: ' + vendorLinkRequest.businessName"
      :subtitle="
        'Submitted ' +
        formatDate(vendorLinkRequest.createdAt) +
        ' (' +
        formatDateRelative(vendorLinkRequest.createdAt) +
        ')'
      "
      @click="goToVendorLinkRequest(vendorLinkRequest)"
    />
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

function goToVendorLinkRequest(vendorLinkRequest: VendorLinkRequest) {
  router.push({
    name: "administration/VendorLinkRequest",
    params: { vendorLinkRequestId: vendorLinkRequest.id },
  })
}
</script>
