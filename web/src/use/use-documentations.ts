import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import documentationsApi, {
  type Documentation,
  type DocumentationWhereOptions,
  type DocumentationFiltersOptions,
  type DocumentationQueryOptions,
} from "@/api/documentations-api"

export {
  type Documentation,
  type DocumentationQueryOptions,
  type DocumentationWhereOptions,
  type DocumentationFiltersOptions,
}

export function useDocumentations(
  queryOptions: Ref<DocumentationQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    documentations: Documentation[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    documentations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Documentation[]> {
    state.isLoading = true
    try {
      const { documentations, totalCount } = await documentationsApi.list(unref(queryOptions))
      state.isErrored = false
      state.documentations = documentations
      state.totalCount = totalCount
      return documentations
    } catch (error) {
      console.error("Failed to fetch documentations:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useDocumentations
