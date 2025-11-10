import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorLinkRequestsApi, { type VendorLinkRequest } from "@/api/vendor-link-requests-api"

export { type VendorLinkRequest }

export function useVendorLinkRequest(
  id: Ref<number | null | undefined>,
  onComplete?: (value: VendorLinkRequest | null) => void
) {
  const state = reactive<{
    vendorLinkRequest: VendorLinkRequest | null
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorLinkRequest: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorLinkRequest> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { vendorLinkRequest } = await vendorLinkRequestsApi.get(staticId)
      state.isErrored = false
      state.vendorLinkRequest = vendorLinkRequest

      if (onComplete) onComplete(vendorLinkRequest)

      return vendorLinkRequest
    } catch (error) {
      console.error("Failed to fetch vendorLinkRequest:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<VendorLinkRequest> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.vendorLinkRequest)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { vendorLinkRequest } = await vendorLinkRequestsApi.update(
        staticId,
        state.vendorLinkRequest
      )
      state.isErrored = false
      state.vendorLinkRequest = vendorLinkRequest
      return vendorLinkRequest
    } catch (error) {
      console.error("Failed to save vendorLinkRequest:", error)
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
    save,
  }
}

export default useVendorLinkRequest
