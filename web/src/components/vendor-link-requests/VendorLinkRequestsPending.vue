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
      :subtitle="makeSubmittedDateString(vendorLinkRequest)"
      @click="goToVendorLinkRequest(vendorLinkRequest)"
    />
  </v-list>
</template>

<script setup lang="ts">
import { DateTime } from "luxon"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { template } from "lodash"

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

const formatDateString = (date: Date) => {
  const dateTime = DateTime.fromJSDate(date)
  return dateTime.toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const formatTimeAgo = (date: Date) => {
  const dateTime = DateTime.fromJSDate(date)
  return dateTime.toRelative({ unit: "days" })
}

const makeSubmittedDateString = computed(() => (vendorLinkRequest: VendorLinkRequest) => {
  const submittedDate = new Date(vendorLinkRequest.createdAt)
  const formattedDate = formatDateString(submittedDate)
  const timeAgo = formatTimeAgo(submittedDate)
  return template("Submitted <%= formattedDate %> (<%= timeAgo %>)")({ formattedDate, timeAgo })
})

const router = useRouter()

function goToVendorLinkRequest(vendorLinkRequest: VendorLinkRequest) {
  router.push({
    name: "administration/VendorLinkRequest",
    params: { vendorLinkRequestId: vendorLinkRequest.id },
  })
}
</script>
