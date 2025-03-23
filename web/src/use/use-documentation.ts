import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import documentationsApi, { type Documentation } from "@/api/documentations-api"

export { type Documentation }

export function useDocumentation(id: Ref<number | null | undefined>) {
  const state = reactive<{
    documentation: Documentation | null
    isLoading: boolean
    isErrored: boolean
  }>({
    documentation: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Documentation> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { documentation } = await documentationsApi.get(staticId)
      state.isErrored = false
      state.documentation = documentation
      return documentation
    } catch (error) {
      console.error("Failed to fetch documentation:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Documentation> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.documentation)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { documentation } = await documentationsApi.update(staticId, state.documentation)
      state.isErrored = false
      state.documentation = documentation
      return documentation
    } catch (error) {
      console.error("Failed to save documentation:", error)
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

export default useDocumentation
