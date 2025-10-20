import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import programsApi, {
  type Program,
  type ProgramWhereOptions,
  type ProgramFiltersOptions,
  type ProgramQueryOptions,
} from "@/api/programs-api"

export {
  type Program,
  type ProgramQueryOptions,
  type ProgramWhereOptions,
  type ProgramFiltersOptions,
}

export function usePrograms(
  queryOptions: Ref<ProgramQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    programs: Program[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    programs: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Program[]> {
    state.isLoading = true
    try {
      const { programs, totalCount } = await programsApi.list(unref(queryOptions))
      state.isErrored = false
      state.programs = programs
      state.totalCount = totalCount
      return programs
    } catch (error) {
      console.error("Failed to fetch programs:", error)
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

export default usePrograms
