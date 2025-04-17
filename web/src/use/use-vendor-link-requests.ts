import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import vendorLinkRequestsApi, {
  type VendorLinkRequest,
  type VendorLinkRequestWhereOptions,
  type VendorLinkRequestFiltersOptions,
  type VendorLinkRequestQueryOptions,
} from "@/api/vendor-link-requests-api"

export {
  type VendorLinkRequest,
  type VendorLinkRequestQueryOptions,
  type VendorLinkRequestWhereOptions,
  type VendorLinkRequestFiltersOptions,
}

export function useVendorLinkRequests(
  queryOptions: Ref<VendorLinkRequestQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    vendorLinkRequests: VendorLinkRequest[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorLinkRequests: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorLinkRequest[]> {
    state.isLoading = true
    try {
      const { vendorLinkRequests, totalCount } = await vendorLinkRequestsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.vendorLinkRequests = vendorLinkRequests
      state.totalCount = totalCount
      return vendorLinkRequests
    } catch (error) {
      console.error("Failed to fetch vendorLinkRequests:", error)
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

export default useVendorLinkRequests
