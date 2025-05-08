<template>
  <v-chip :color="computeStatusIconColor(status)">
    {{ status }}
  </v-chip>
</template>

<script setup lang="ts">
import { VendorProgramStatuses } from "@/api/vendor-programs-api"

defineProps<{
  status: VendorProgramStatuses
}>()

function computeStatusIconColor(status: VendorProgramStatuses) {
  switch (status) {
    case VendorProgramStatuses.PENDING:
      return "grey"
    case VendorProgramStatuses.ACCEPTED:
      return "green"
    case VendorProgramStatuses.REJECTED:
      return "red"
    default:
      return "grey"
  }
}
</script>
