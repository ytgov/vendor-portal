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
    @update:page="updatePage"
  >
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useRouteQuery } from "@vueuse/router"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useProgramDocumentations, {
  ProgramDocumentationQueryOptions,
} from "@/use/use-program-documentations"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))

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

const programDocumentationsQuery = computed<ProgramDocumentationQueryOptions>(() => {
  return {
    where: {
      programId: programIdNumber.value,
    },
    perPage: perPage.value,
    page: page.value,
  }
})

const { programDocumentations, totalCount, isLoading, refresh } = useProgramDocumentations(
  programDocumentationsQuery
)

useBreadcrumbs("Manage Program Documentations", [ADMIN_CRUMB])

// Necessary to avoid wiping page value due to bug in Vuetify table implementation
// which causes page value to be wiped if changed during loading state.
function updatePage(newPage: number) {
  if (isLoading.value) return

  page.value = newPage
}

defineExpose({ refresh })
</script>
