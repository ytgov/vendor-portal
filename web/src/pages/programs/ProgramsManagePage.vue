<template>
  <v-skeleton-loader
    v-if="isNil(programs)"
    type="table"
  />
  <v-card>
    <v-card-text>
      <div>
        <v-text-field
          v-model="search"
          label="Search"
        />
      </div>
      <v-data-table-server
        v-model:items-per-page="perPage"
        :page="page"
        :headers="headers"
        :search="search"
        :items="programs"
        :items-length="totalCount"
        :loading="isLoading"
        style="border: 1px #ccc solid; border-radius: 3px"
        @click:row="(_event: unknown, { item }: ProgramTableRow) => goToProgramEdit(item.id)"
      >
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import usePrograms, {
  Program,
  ProgramFiltersOptions,
  ProgramQueryOptions,
} from "@/use/use-programs"

type ProgramTableRow = {
  item: Program
}

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Department", key: "department" },
  { title: "Offered By", key: "offeredBy" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
])

const search = ref("")

const route = useRoute()
const router = useRouter()

const page = useRouteQuery<number>("page", 1, {
  route,
  router,
  transform: {
    get: (value: number) => value,
    set: (value: number) => value,
  },
})

const perPage = useRouteQuery<number>("perPage", 10, {
  route,
  router,
  transform: {
    get: (value: number) => value,
    set: (value: number) => value,
  },
})

const searchFilter = computed<Pick<ProgramFiltersOptions, "search">>(() => {
  if (isEmpty(search.value)) {
    return {}
  }

  return {
    search: search.value,
  }
})

const filters = computed<ProgramFiltersOptions>(() => {
  return {
    ...searchFilter.value,
  }
})

const programsQuery = computed<ProgramQueryOptions>(() => {
  return {
    filters: filters.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const { programs, totalCount, isLoading, refresh } = usePrograms(programsQuery)

useBreadcrumbs("Manage Programs", [ADMIN_CRUMB])

function goToProgramEdit(programId: number) {
  router.push({
    name: "administration/ProgramManagePage",
    params: { programId },
  })
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
