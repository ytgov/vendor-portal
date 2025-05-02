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
    <template #item.createdAt="{ value }">
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

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Vendor ID", key: "vendorId" },
  { title: "Program ID", key: "programId" },
  { title: "Created At", key: "createdAt" },
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

const emit = defineEmits<{ click: [vendorProgramId: number] }>()

function rowClicked(_event: unknown, row: VendorProgramTableRow) {
  const vendorProgramId = row.item.id
  emit("click", vendorProgramId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
