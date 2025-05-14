<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="programs"
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
  { title: "Department", key: "department" },
  { title: "Offered By", key: "offeredBy" },
]
</script>

<script setup lang="ts">
import { computed } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import usePrograms, {
  Program,
  ProgramFiltersOptions,
  ProgramQueryOptions,
  ProgramWhereOptions,
} from "@/use/use-programs"

const props = withDefaults(
  defineProps<{
    headers?: { title: string; key: string }[]
    filters?: ProgramFiltersOptions
    where?: ProgramWhereOptions
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
  routeQuerySuffix: "Programs",
})

const programsQuery = computed<ProgramQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { programs, totalCount, isLoading, refresh } = usePrograms(programsQuery, {
  skipWatchIf: () => props.waiting,
})

type ProgramTableRow = {
  item: Program
}

const emit = defineEmits<{ clicked: [program: Program] }>()

function rowClicked(_event: unknown, row: ProgramTableRow) {
  emit("clicked", row.item)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
