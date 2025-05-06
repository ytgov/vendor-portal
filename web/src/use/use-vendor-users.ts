import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"

import vendorUsersApi, {
  type VendorUser,
  type VendorUserWhereOptions,
  type VendorUserFiltersOptions,
  type VendorUserQueryOptions,
} from "@/api/vendor-users-api"

export {
  type VendorUser,
  type VendorUserQueryOptions,
  type VendorUserWhereOptions,
  type VendorUserFiltersOptions,
}

export function useVendorUsers(
  queryOptions: Ref<VendorUserQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    vendorUsers: VendorUser[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorUsers: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorUser[]> {
    state.isLoading = true
    try {
      const { vendorUsers, totalCount } = await vendorUsersApi.list(unref(queryOptions))
      state.isErrored = false
      state.vendorUsers = vendorUsers
      state.totalCount = totalCount
      return vendorUsers
    } catch (error) {
      console.error("Failed to fetch vendorUsers:", error)
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

export default useVendorUsers
