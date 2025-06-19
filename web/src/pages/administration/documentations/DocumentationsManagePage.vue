<template>
  <v-skeleton-loader
    v-if="isNil(documentations)"
    type="table"
  />
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
        />
        <v-btn
          color="primary"
          class="ml-4"
          :to="{ name: 'administration/DocumentationCreatePage' }"
          style="height: 46px"
          text="Create Documentation"
        />
      </div>
      <v-data-table-server
        v-model:items-per-page="perPage"
        :page="page"
        :headers="headers"
        :search="search"
        :items="documentations"
        :items-length="totalCount"
        :loading="isLoading"
        style="border: 1px #ccc solid; border-radius: 3px"
      >
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useDocumentations, {
  DocumentationFiltersOptions,
  DocumentationQueryOptions,
} from "@/use/use-documentations"
import { useRouteQuery } from "@vueuse/router"

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Format", key: "format" },
  { title: "Description", key: "description" },
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

const searchFilter = computed<Pick<DocumentationFiltersOptions, "search">>(() => {
  if (isEmpty(search.value)) {
    return {}
  }

  return {
    search: `${search.value}`,
  }
})

const filters = computed<DocumentationFiltersOptions>(() => {
  return {
    ...searchFilter.value,
  }
})

const documentationsQuery = computed<DocumentationQueryOptions>(() => {
  return {
    filters: filters.value,
    perPage: perPage.value,
    page: page.value,
  }
})

const { documentations, totalCount, isLoading, refresh } = useDocumentations(documentationsQuery)

useBreadcrumbs("Manage Documentation", [
  {
    title: "Manage Documentation",
    to: {
      name: "administration/DocumentationsPage",
    },
  },
])

defineExpose({ refresh })
</script>
