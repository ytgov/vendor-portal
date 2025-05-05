<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="vendorPrograms"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
    @click:row="rowClicked"
  >
    <template #item.status="{ value }">
      <VendorProgramStatusChip :status="value" />
    </template>
    <template #item.vendorId="{ value }">
      <VendorChip :vendor-id="value" />
    </template>
    <template #item.startDate="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.endDate="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.requestedByUserId="{ value }">
      <UserChip :user-id="value" />
    </template>
    <template #item.requestedAt="{ value }">
      {{ formatDate(value) }}
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useVendorPrograms, {
  VendorProgram,
  VendorProgramFiltersOptions,
  VendorProgramQueryOptions,
  VendorProgramWhereOptions,
} from "@/use/use-vendor-programs"

import UserChip from "@/components/users/UserChip.vue"
import VendorChip from "@/components/vendors/VendorChip.vue"
import VendorProgramStatusChip from "@/components/vendor-programs/VendorProgramStatusChip.vue"

const headers = ref([
  // { title: "Status", key: "status" },
  { title: "Vendor", key: "vendorId" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "Requested By User ID", key: "requestedByUserId" },
  { title: "Requested At", key: "requestedAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: VendorProgramFiltersOptions
    where?: VendorProgramWhereOptions
    waiting?: boolean
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "VendorPrograms",
})

const vendorProgramsQuery = computed<VendorProgramQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { vendorPrograms, totalCount, isLoading, refresh } = useVendorPrograms(vendorProgramsQuery)

type VendorProgramTableRow = {
  item: VendorProgram
}

const emit = defineEmits<{ click: [vendorProgramId: VendorProgram] }>()

function rowClicked(_event: unknown, row: VendorProgramTableRow) {
  emit("click", row.item)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
