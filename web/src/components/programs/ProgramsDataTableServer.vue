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
    <template #item.createdAt="{ value }">
      {{ formatDate(value) }}
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import usePrograms, {
  Program,
  ProgramFiltersOptions,
  ProgramQueryOptions,
  ProgramWhereOptions,
} from "@/use/use-programs"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Created At", key: "createdAt" },
])

const props = withDefaults(
  defineProps<{
    filters?: ProgramFiltersOptions
    where?: ProgramWhereOptions
    waiting?: boolean
  }>(),
  {
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

const { programs, totalCount, isLoading, refresh } = usePrograms(programsQuery)

type ProgramTableRow = {
  item: Program
}

const emit = defineEmits<{ click: [programId: number] }>()

function rowClicked(_event: unknown, row: ProgramTableRow) {
  const programId = row.item.id
  emit("click", programId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
