<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="documentations"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
    @click:row="rowClicked"
  >
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
  { title: "Name", key: "name" },
  { title: "Format", key: "format" },
  { title: "Created At", key: "createdAt" },
]
</script>

<script setup lang="ts">
import { computed } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useDocumentations, {
  Documentation,
  DocumentationFiltersOptions,
  DocumentationQueryOptions,
  DocumentationWhereOptions,
} from "@/use/use-documentations"

const props = withDefaults(
  defineProps<{
    headers?: { title: string; key: string }[]
    filters?: DocumentationFiltersOptions
    where?: DocumentationWhereOptions
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
  routeQuerySuffix: "Documentations",
})

const documentationsQuery = computed<DocumentationQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { documentations, totalCount, isLoading, refresh } = useDocumentations(documentationsQuery)

type DocumentationTableRow = {
  item: Documentation
}

const emit = defineEmits<{ click: [documentationId: number] }>()

function rowClicked(_event: unknown, row: DocumentationTableRow) {
  const documentationId = row.item.id
  emit("click", documentationId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
