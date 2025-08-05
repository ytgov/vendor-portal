<template>
  <v-list
    class="py-0 mt-0"
    title="Pending Program Applications"
  >
    <div
      v-for="(vendorProgram, index) of vendorPrograms"
      :key="index"
    >
      <v-list-item
        class="py-2"
        :title="`${vendorProgram.requestedByUser?.displayName} - (${vendorProgram.program?.name})`"
        :subtitle="buildSubtitle(vendorProgram)"
        @click="goToVendorProgram(vendorProgram)"
      />
      <v-divider v-if="index < vendorPrograms.length - 1" />
    </div>
    <v-list-item v-if="vendorPrograms.length == 0">No pending requests</v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

import { formatDate, formatDateRelative } from "@/utils/formatters"

import { VendorProgram, VendorProgramStatuses } from "@/api/vendor-programs-api"

import useVendorPrograms, { type VendorProgramQueryOptions } from "@/use/use-vendor-programs"

const query = ref<VendorProgramQueryOptions>({
  where: {
    status: VendorProgramStatuses.PENDING,
  },
})

const { vendorPrograms } = useVendorPrograms(query)

const router = useRouter()

function buildSubtitle(vendorProgram: VendorProgram) {
  return (
    "Submitted " +
    formatDate(vendorProgram.createdAt) +
    " (" +
    formatDateRelative(vendorProgram.createdAt) +
    ")"
  )
}

function goToVendorProgram(vendorProgram: VendorProgram) {
  router.push({
    name: "administration/VendorProgramRequestPage",
    params: {
      programId: vendorProgram.programId,
      vendorId: vendorProgram.vendorId,
      vendorProgramId: vendorProgram.id,
    },
  })
}
</script>
