import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorDocumentationsApi, { type VendorDocumentation } from "@/api/vendor-documentations-api"

export { type VendorDocumentation }

export function useVendorDocumentation(id: Ref<number | null | undefined>) {
  const state = reactive<{
    vendorDocumentation: VendorDocumentation | null
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorDocumentation: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorDocumentation> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { vendorDocumentation } = await vendorDocumentationsApi.get(staticId)
      state.isErrored = false
      state.vendorDocumentation = vendorDocumentation
      return vendorDocumentation
    } catch (error) {
      console.error("Failed to fetch vendorDocumentation:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<VendorDocumentation> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.vendorDocumentation)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { vendorDocumentation } = await vendorDocumentationsApi.update(
        staticId,
        state.vendorDocumentation
      )
      state.isErrored = false
      state.vendorDocumentation = vendorDocumentation
      return vendorDocumentation
    } catch (error) {
      console.error("Failed to save vendorDocumentation:", error)
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

export default useVendorDocumentation
