import { isNil } from "lodash"
import { reactive, toRefs } from "vue"

import vendorDocumentationsApi, { type VendorDocumentation } from "@/api/vendor-documentations-api"
import useSnack from "@/use/use-snack"

const snack = useSnack()

// Global state for preview
const state = reactive<{
  showDialog: boolean
  isLoading: boolean
  previewBlob?: Blob | null
  title?: string | null
  file?: Blob | null
  mimeType?: string | null
  usePdf: boolean
}>({
  isLoading: false,
  showDialog: false,
  previewBlob: undefined,
  title: null,
  usePdf: false,
})

export function usePdfPreview() {
  function canPreview(mimeType: string | null): boolean {
    if (isNil(mimeType) || mimeType.length == 0) return false

    if (mimeType.includes("pdf")) return true
    if (mimeType.includes("image")) return true

    console.log("checking canPreview", mimeType)
    return false
  }

  async function showPreview(
    vendorDocumentation: VendorDocumentation | null,
    usePdf: boolean = false
  ) {
    if (isNil(vendorDocumentation)) return
    state.isLoading = true
    state.title = vendorDocumentation.fileName ?? "Preview"
    state.file = vendorDocumentation.content
    state.mimeType = vendorDocumentation.mimeType
    state.usePdf = usePdf
    state.showDialog = true

    const result = await vendorDocumentationsApi
      .download(vendorDocumentation.id)
      .then((resp) => resp)
      .catch(() => {})

    if (!result) {
      snack.error("Failed to load preview")
    } else {
      const newBlob = new Blob([result], {
        type: usePdf
          ? "application/pdf"
          : (vendorDocumentation.mimeType ?? "application/octet-stream"),
      })
      state.previewBlob = newBlob
    }
    state.isLoading = false
  }

  function hidePreview() {
    state.showDialog = false
    state.previewBlob = null
    state.title = null
    state.file = null
    state.mimeType = null
    state.usePdf = false
  }

  function previewType(mimeType: string | null): string {
    if (isNil(mimeType) || mimeType.length == 0) return "Unknown"

    if (mimeType.includes("pdf")) {
      return "PDF"
    }
    if (mimeType.includes("image")) {
      return "Image"
    }

    return "Unknown"
  }

  return {
    ...toRefs(state),
    canPreview,
    showPreview,
    hidePreview,
    previewType,
  }
}

export default usePdfPreview
