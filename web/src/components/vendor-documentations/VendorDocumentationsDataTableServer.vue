<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="vendorDocumentations"
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
import useVendorDocumentations, {
  VendorDocumentation,
  VendorDocumentationFiltersOptions,
  VendorDocumentationQueryOptions,
  VendorDocumentationWhereOptions,
} from "@/use/use-vendor-documentations"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: VendorDocumentationFiltersOptions
    where?: VendorDocumentationWhereOptions
    waiting?: boolean
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "VendorDocumentations",
})

const vendorvendorDocumentationsQuery = computed<VendorDocumentationQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { vendorDocumentations, totalCount, isLoading, refresh } = useVendorDocumentations(
  vendorvendorDocumentationsQuery
)

type VendorDocumentationTableRow = {
  item: VendorDocumentation
}

const emit = defineEmits<{ click: [vendorDocumentationId: number] }>()

function rowClicked(_event: unknown, row: VendorDocumentationTableRow) {
  const vendorDocumentationId = row.item.id
  emit("click", vendorDocumentationId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
