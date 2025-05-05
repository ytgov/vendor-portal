<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :search="search"
    :items="programDocumentations"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
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
import useProgramDocumentations, {
  ProgramDocumentationFiltersOptions,
  ProgramDocumentationWhereOptions,
  ProgramDocumentationQueryOptions,
} from "@/use/use-program-documentations"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Purpose", key: "purpose" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: ProgramDocumentationFiltersOptions
    where?: ProgramDocumentationWhereOptions
    waiting?: boolean
  }>(),
  {
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const search = ref("")

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "ProgramDocumentations",
})

const programDocumentationsQuery = computed<ProgramDocumentationQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { programDocumentations, totalCount, isLoading, refresh } = useProgramDocumentations(
  programDocumentationsQuery
)

defineExpose({ refresh })
</script>
