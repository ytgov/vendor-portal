<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :search="search"
    :items="programs"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
  >
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import usePrograms, { ProgramQueryOptions } from "@/use/use-programs"

const headers = ref([
  { title: "ID", key: "id" },
  { title: "Purpose", key: "purpose" },
  { title: "Created At", key: "createdAt" },
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

const programsQuery = computed<ProgramQueryOptions>(() => {
  return {
    perPage: perPage.value,
    page: page.value,
  }
})

const { programs, totalCount, isLoading, refresh } = usePrograms(programsQuery)

useBreadcrumbs("Manage Program Documentations", [ADMIN_CRUMB])

defineExpose({ refresh })
</script>
