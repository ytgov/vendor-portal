<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="vendors"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
    @click:row="rowClicked"
  >
    <template #item.createdAt="{ value }">
      {{ formatDate(value) }}
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useVendors, {
  Vendor,
  VendorFiltersOptions,
  VendorQueryOptions,
  VendorWhereOptions,
} from "@/use/use-vendors"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: VendorFiltersOptions
    where?: VendorWhereOptions
    waiting?: boolean
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "Vendors",
})

const vendorsQuery = computed<VendorQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { vendors, totalCount, isLoading, refresh } = useVendors(vendorsQuery)

type VendorTableRow = {
  item: Vendor
}

const emit = defineEmits<{ click: [vendorId: number] }>()

function rowClicked(_event: unknown, row: VendorTableRow) {
  const vendorId = row.item.id
  emit("click", vendorId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
