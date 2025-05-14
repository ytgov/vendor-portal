<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="vendorLinkRequests"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
    @click:row="rowClicked"
  >
    <template #item.status="{ value }">
      <VendorLinkRequestStatusChip :status="value" />
    </template>
    <template #item.updatedAt="{ value }">
      {{ formatDate(value) }}
    </template>
    <template #item.createdAt="{ value }">
      {{ formatDate(value) }}
    </template>
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps"
      ></slot>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
export const defaultHeaders = [
  { title: "User", key: "user.displayName" },
  { title: "Business Name", key: "businessName" },
  { title: "Status", key: "status" },
  { title: "Updated At", key: "updatedAt" },
  { title: "Created At", key: "createdAt" },
]
</script>

<script setup lang="ts">
import { computed } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useVendorLinkRequests, {
  VendorLinkRequest,
  VendorLinkRequestFiltersOptions,
  VendorLinkRequestQueryOptions,
  VendorLinkRequestWhereOptions,
} from "@/use/use-vendor-link-requests"

import VendorLinkRequestStatusChip from "@/components/vendor-link-requests/VendorLinkRequestStatusChip.vue"

const props = withDefaults(
  defineProps<{
    headers?: { title: string; key: string }[]
    filters?: VendorLinkRequestFiltersOptions
    where?: VendorLinkRequestWhereOptions
    waiting?: boolean
  }>(),
  {
    headers: () => defaultHeaders,
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "VendorLinkRequests",
})

const vendorvendorLinkRequestsQuery = computed<VendorLinkRequestQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { vendorLinkRequests, totalCount, isLoading, refresh } = useVendorLinkRequests(
  vendorvendorLinkRequestsQuery,
  {
    skipWatchIf: () => props.waiting,
  }
)

type VendorLinkRequestTableRow = {
  item: VendorLinkRequest
}

const emit = defineEmits<{ clicked: [vendorLinkRequestId: number] }>()

function rowClicked(_event: unknown, row: VendorLinkRequestTableRow) {
  const vendorLinkRequestId = row.item.id
  emit("clicked", vendorLinkRequestId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
