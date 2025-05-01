import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import vendorDocumentationsApi, {
  type VendorDocumentation,
  type VendorDocumentationWhereOptions,
  type VendorDocumentationFiltersOptions,
  type VendorDocumentationQueryOptions,
} from "@/api/vendor-documentations-api"

export {
  type VendorDocumentation,
  type VendorDocumentationQueryOptions,
  type VendorDocumentationWhereOptions,
  type VendorDocumentationFiltersOptions,
}

export function useVendorDocumentations(
  queryOptions: Ref<VendorDocumentationQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    vendorDocumentations: VendorDocumentation[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorDocumentations: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorDocumentation[]> {
    state.isLoading = true
    try {
      const { vendorDocumentations, totalCount } = await vendorDocumentationsApi.list(
        unref(queryOptions)
      )
      state.isErrored = false
      state.vendorDocumentations = vendorDocumentations
      state.totalCount = totalCount
      return vendorDocumentations
    } catch (error) {
      console.error("Failed to fetch vendorDocumentations:", error)
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

export default useVendorDocumentations
