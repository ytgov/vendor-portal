import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorProgramsApi, { type VendorProgram } from "@/api/vendor-programs-api"

export { type VendorProgram }

export function useVendorProgram(id: Ref<number | null | undefined>) {
  const state = reactive<{
    vendorProgram: VendorProgram | null
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorProgram: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorProgram> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { vendorProgram } = await vendorProgramsApi.get(staticId)
      state.isErrored = false
      state.vendorProgram = vendorProgram
      return vendorProgram
    } catch (error) {
      console.error("Failed to fetch vendorProgram:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<VendorProgram> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.vendorProgram)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { vendorProgram } = await vendorProgramsApi.update(staticId, state.vendorProgram)
      state.isErrored = false
      state.vendorProgram = vendorProgram
      return vendorProgram
    } catch (error) {
      console.error("Failed to save vendorProgram:", error)
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

export default useVendorProgram
