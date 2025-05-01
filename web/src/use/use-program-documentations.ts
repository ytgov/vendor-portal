import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import programDocumentationsApi, {
  type ProgramDocumentation,
  type ProgramDocumentationWhereOptions,
  type ProgramDocumentationFiltersOptions,
  type ProgramDocumentationQueryOptions,
} from "@/api/program-documentations-api"

export {
  type ProgramDocumentation,
  type ProgramDocumentationQueryOptions,
  type ProgramDocumentationWhereOptions,
  type ProgramDocumentationFiltersOptions,
}

export function useProgramDocumentations(
  queryOptions: Ref<ProgramDocumentationQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    programDocumentations: ProgramDocumentation[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    programDocumentations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ProgramDocumentation[]> {
    state.isLoading = true
    try {
      const { programDocumentations, totalCount } = await programDocumentationsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.programDocumentations = programDocumentations
      state.totalCount = totalCount
      return programDocumentations
    } catch (error) {
      console.error("Failed to fetch programDocumentations:", error)
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

export default useProgramDocumentations
