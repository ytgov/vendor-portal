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
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useDocumentations, {
  Documentation,
  DocumentationFiltersOptions,
  DocumentationQueryOptions,
  DocumentationWhereOptions,
} from "@/use/use-documentations"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Purpose", key: "purpose" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: DocumentationFiltersOptions
    where?: DocumentationWhereOptions
    waiting?: boolean
  }>(),
  {
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
