<template>
  <v-chip
    variant="flat"
    :color="computeStatusIconColor(status)"
    theme="dark"
  >
    <span class="text-white">{{ status }}</span>
  </v-chip>
</template>

<script setup lang="ts">
import { VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"

defineProps<{
  status: VendorLinkRequestStatuses
}>()

function computeStatusIconColor(status: VendorLinkRequestStatuses) {
  switch (status) {
    case VendorLinkRequestStatuses.PENDING:
      return "warning"
    case VendorLinkRequestStatuses.ACCEPTED:
      return "success"
    default:
      return "grey"
  }
}
</script>
