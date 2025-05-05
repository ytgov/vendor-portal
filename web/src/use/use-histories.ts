import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import historiesApi, {
  type History,
  type HistoryWhereOptions,
  type HistoryFiltersOptions,
  type HistoryQueryOptions,
} from "@/api/histories-api"

export {
  type History,
  type HistoryQueryOptions,
  type HistoryWhereOptions,
  type HistoryFiltersOptions,
}

export function useHistories(
  queryOptions: Ref<HistoryQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    histories: History[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    histories: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<History[]> {
    state.isLoading = true
    try {
      const { histories, totalCount } = await historiesApi.list(unref(queryOptions))
      state.isErrored = false
      state.histories = histories
      state.totalCount = totalCount
      return histories
    } catch (error) {
      console.error("Failed to fetch histories:", error)
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

export default useHistories
