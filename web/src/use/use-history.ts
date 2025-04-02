import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import historiesApi, { type History } from "@/api/histories-api"

export { type History }

export function useHistory(id: Ref<number | null | undefined>) {
  const state = reactive<{
    history: History | null
    isLoading: boolean
    isErrored: boolean
  }>({
    history: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<History> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { history } = await historiesApi.get(staticId)
      state.isErrored = false
      state.history = history
      return history
    } catch (error) {
      console.error("Failed to fetch history:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<History> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.history)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { history } = await historiesApi.update(staticId, state.history)
      state.isErrored = false
      state.history = history
      return history
    } catch (error) {
      console.error("Failed to save history:", error)
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

export default useHistory
