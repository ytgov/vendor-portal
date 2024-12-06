import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import vendorApi, { type Vendor } from "@/api/vendors-api"

export { type Vendor }

export function useVendor(id: Ref<string | null | undefined>) {
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

    //await sleep(1)

    const vendor = {
      id: 12,
      name: "Ice Fog Analytics Inc.",
      vendorId: "CDICEFOGANAL",
      address: `2 Stope Way
Whitehorse, YT Y1A0B3`,
      createdAt: "",
      updatedAt: "",
      programs: [
        {
          id: 123,
          department: "Economic Development",
          name: "Paid Sick Leave Rebate",
          slug: "EcDev-PSLR",
          createdAt: "",
          updatedAt: "",
        },
      ],
    }

    state.vendor = vendor
    state.isLoading = false

    return vendor

    /* try {
      const { vendor } = await vendorApi.get(staticId)
      state.isErrored = false
      state.vendor = vendor
      return vendor
    } catch (error) {
      console.error("Failed to fetch vendor:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    } */
  }

  async function save(): Promise<Vendor> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.vendor)) {
      throw new Error("No vendor to save")
    }

    state.isLoading = true
    try {
      const { vendor } = await vendorApi.update(staticId, state.vendor)
      state.isErrored = false
      state.vendor = vendor
      return vendor
    } catch (error) {
      console.error("Failed to save vendor:", error)
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
function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
export default useVendor
