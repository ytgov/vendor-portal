<template>
  <v-chip :color="computeStatusIconColor(status)">
    {{ status }}
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
      return "grey"
    case VendorLinkRequestStatuses.ACCEPTED:
      return "green"
    case VendorLinkRequestStatuses.REJECTED:
      return "red"
    default:
      return "grey"
  }
}
</script>
