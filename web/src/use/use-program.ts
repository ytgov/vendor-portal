import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil, isNumber } from "lodash"

import programsApi, { type Program } from "@/api/programs-api"

export { type Program }

export function useProgram(id: Ref<string | number | null | undefined>) {
  const state = reactive<{
    program: Program | null
    isLoading: boolean
    isErrored: boolean
  }>({
    program: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<Program> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id/slug is required")
    }

    state.isLoading = true
    try {
      const { program } = await programsApi.get(staticId)
      state.isErrored = false
      state.program = program
      return program
    } catch (error) {
      console.error("Failed to fetch program:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<Program> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    if (isNil(state.program) || !isNumber(staticId)) {
      throw new Error("No user to save")
    }

    state.isLoading = true
    try {
      const { program } = await programsApi.update(staticId, state.program)
      state.isErrored = false
      state.program = program
      return program
    } catch (error) {
      console.error("Failed to save program:", error)
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

export default useProgram
