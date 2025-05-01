import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import programDocumentationsApi, {
  type ProgramDocumentation,
} from "@/api/program-documentations-api"

export { type ProgramDocumentation }

export function useProgramDocumentation(id: Ref<number | null | undefined>) {
  const state = reactive<{
    programDocumentation: ProgramDocumentation | null
    isLoading: boolean
    isErrored: boolean
  }>({
    programDocumentation: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<ProgramDocumentation> {
    const staticId = unref(id)
    if (isNil(staticId)) {
      throw new Error("id is required")
    }

    state.isLoading = true
    try {
      const { programDocumentation } = await programDocumentationsApi.get(staticId)
      state.isErrored = false
      state.programDocumentation = programDocumentation
      return programDocumentation
    } catch (error) {
      console.error("Failed to fetch programDocumentation:", error)
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

export default useProgramDocumentation
