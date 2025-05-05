import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import vendorsApi, {
  type Vendor,
  type VendorWhereOptions,
  type VendorFiltersOptions,
  type VendorQueryOptions,
} from "@/api/vendors-api"

export { type Vendor, type VendorQueryOptions, type VendorWhereOptions, type VendorFiltersOptions }

export function useVendors(
  queryOptions: Ref<VendorQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    vendors: Vendor[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    vendors: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Vendor[]> {
    state.isLoading = true
    try {
      const { vendors, totalCount } = await vendorsApi.list(unref(queryOptions))
      state.isErrored = false
      state.vendors = vendors
      state.totalCount = totalCount
      return vendors
    } catch (error) {
      console.error("Failed to fetch vendors:", error)
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

export default useVendors
