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
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useVendorLinkRequests, {
  VendorLinkRequest,
  VendorLinkRequestFiltersOptions,
  VendorLinkRequestQueryOptions,
  VendorLinkRequestWhereOptions,
} from "@/use/use-vendor-link-requests"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Purpose", key: "purpose" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: VendorLinkRequestFiltersOptions
    where?: VendorLinkRequestWhereOptions
    waiting?: boolean
  }>(),
  {
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
  vendorvendorLinkRequestsQuery
)

type VendorLinkRequestTableRow = {
  item: VendorLinkRequest
}

const emit = defineEmits<{ click: [vendorLinkRequestId: number] }>()

function rowClicked(_event: unknown, row: VendorLinkRequestTableRow) {
  const vendorLinkRequestId = row.item.id
  emit("click", vendorLinkRequestId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
