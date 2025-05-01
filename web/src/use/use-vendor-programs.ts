import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import vendorProgramsApi, {
  type VendorProgram,
  type VendorProgramWhereOptions,
  type VendorProgramFiltersOptions,
  type VendorProgramQueryOptions,
} from "@/api/vendor-programs-api"

export {
  type VendorProgram,
  type VendorProgramQueryOptions,
  type VendorProgramWhereOptions,
  type VendorProgramFiltersOptions,
}

export function useVendorPrograms(
  queryOptions: Ref<VendorProgramQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    vendorPrograms: VendorProgram[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorPrograms: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorProgram[]> {
    state.isLoading = true
    try {
      const { vendorPrograms, totalCount } = await vendorProgramsApi.list(unref(queryOptions))
      state.isErrored = false
      state.vendorPrograms = vendorPrograms
      state.totalCount = totalCount
      return vendorPrograms
    } catch (error) {
      console.error("Failed to fetch vendorPrograms:", error)
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

export default useVendorPrograms
