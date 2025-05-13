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
  { title: "ID", key: "id" },
  { title: "Purpose", key: "purpose" },
  { title: "Created At", key: "createdAt" },
]
</script>

<script setup lang="ts">
import { computed, ref } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useProgramDocumentations, {
  ProgramDocumentationFiltersOptions,
  ProgramDocumentationWhereOptions,
  ProgramDocumentationQueryOptions,
} from "@/use/use-program-documentations"

const props = withDefaults(
  defineProps<{
    headers?: { title: string; key: string }[]
    filters?: ProgramDocumentationFiltersOptions
    where?: ProgramDocumentationWhereOptions
    waiting?: boolean
  }>(),
  {
    headers: () => defaultHeaders,
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
