import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorUsersApi, { type VendorUser } from "@/api/vendor-users-api"

export { type VendorUser }

export function useVendorUser(id: Ref<number | null | undefined>) {
  const state = reactive<{
    vendorUser: VendorUser | null
    isLoading: boolean
    isErrored: boolean
  }>({
    vendorUser: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<VendorUser> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { vendorUser } = await vendorUsersApi.get(staticId)
      state.isErrored = false
      state.vendorUser = vendorUser
      return vendorUser
    } catch (error) {
      console.error("Failed to fetch vendorUser:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<VendorUser> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.vendorUser)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { vendorUser } = await vendorUsersApi.update(staticId, state.vendorUser)
      state.isErrored = false
      state.vendorUser = vendorUser
      return vendorUser
    } catch (error) {
      console.error("Failed to save vendorUser:", error)
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

export default useVendorUser
