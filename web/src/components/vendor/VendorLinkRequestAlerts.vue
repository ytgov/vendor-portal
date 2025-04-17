<template>
  <div>
    <v-alert
      v-for="{ id, matchedVendorId } of vendorLinkRequests"
      :key="id"
      type="info"
      color="success"
      class="mb-5 white-text"
      title="Pending Link Request"
    >
      We are still processing a request to link "{{ matchedVendorId }}" to your account, submitted
      on Monday, November 21, 2024.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

import { VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"

import useVendorLinkRequests, {
  type VendorLinkRequestQueryOptions,
} from "@/use/use-vendor-link-requests"

const query = ref<VendorLinkRequestQueryOptions>({
  where: {
    status: VendorLinkRequestStatuses.PENDING,
  },
})

const { vendorLinkRequests } = useVendorLinkRequests(query)
</script>
