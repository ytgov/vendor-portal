import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorsApi, { type Vendor } from "@/api/vendors-api"

export { type Vendor }

export function useVendor(id: Ref<number | string | null | undefined>) {
  const state = reactive<{
    vendor: Vendor | null
    isLoading: boolean
    isErrored: boolean
  }>({
    vendor: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Vendor> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { vendor } = await vendorsApi.get(staticId)
      state.isErrored = false
      state.vendor = vendor
      return vendor
    } catch (error) {
      console.error("Failed to fetch vendor:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(id),
    async (newId) => {
      if (isNil(newId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useVendor
