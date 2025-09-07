<template>
  <v-skeleton-loader
    v-if="isNil(programDocumentation)"
    type="card"
  />
  <v-card
    v-else-if="!isNil(programDocumentation.documentation)"
    class="mb-5"
  >
    <v-card-title>{{ programDocumentation.documentation.name }}</v-card-title>
    <v-card-text>
      <div v-if="programDocumentation.documentation.format === DocumentationFormats.FILE">
        <div
          v-for="(vendorDocumentation, index) in vendorDocumentations"
          :key="index"
        >
          <p class="mb-2">
            File name: <strong>{{ vendorDocumentation.fileName }}</strong>
          </p>
          <!-- <p class="mb-5">
            Expires on: <strong> {{ formatDate(vendorDocumentation.expiresAt) }}</strong>
          </p> -->
          <div class="d-flex">
            <v-btn
              class="mr-4"
              size="small"
              text="View"
              :disabled="!canPreview(vendorDocumentation.mimeType)"
              @click="previewPdf(vendorDocumentation, true)"
            />
            <DownloadFileForm
              :download-url="getDownloadUrl(vendorDocumentation)"
              text="Download"
              size="small"
            />
          </div>
        </div>
      </div>
      <div v-else-if="programDocumentation.documentation.format === DocumentationFormats.TEXT">
        <div
          v-for="(vendorDocumentation, index) in vendorDocumentations"
          :key="index"
        >
          <p>
            {{ vendorDocumentation.textValue }}
          </p>
        </div>
      </div>
      <div v-else-if="programDocumentation.documentation.format === DocumentationFormats.BOOLEAN">
        <div
          v-for="(vendorDocumentation, index) in vendorDocumentations"
          :key="index"
        >
          <p>
            {{ vendorDocumentation.textValue == "true" ? "Yes" : "No" }}
          </p>
        </div>
      </div>
    </v-card-text>
    <PdfPreviewDialog />
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import { API_BASE_URL } from "@/config"
import { DocumentationFormats } from "@/api/documentations-api"

import usePdfPreview from "@/use/vendor-documentations/use-preview"
import useProgramDocumentation from "@/use/use-program-documentation"
import useVendorDocumentations, {
  VendorDocumentation,
  VendorDocumentationQueryOptions,
} from "@/use/use-vendor-documentations"

import DownloadFileForm from "@/components/common/DownloadFileForm.vue"
import PdfPreviewDialog from "@/components/vendor-documentations/PdfPreviewDialog.vue"

const props = defineProps<{ vendorId: number; programDocumentationId: number }>()

const { vendorId, programDocumentationId } = toRefs(props)

const { programDocumentation } = useProgramDocumentation(programDocumentationId)

const vendorDocumentationsQuery = computed<VendorDocumentationQueryOptions>(() => {
  if (isNil(programDocumentation.value)) return {} // where 1 == 0 ?

  return {
    where: {
      documentationId: programDocumentation.value.documentationId,
      vendorId: vendorId.value,
    },
    filters: {},
    perPage: 10,
    page: 1,
  }
})

const { vendorDocumentations } = useVendorDocumentations(vendorDocumentationsQuery, {
  skipWatchIf: () => isNil(programDocumentation.value),
})

function getDownloadUrl(vendorDocumentation: VendorDocumentation) {
  return `${API_BASE_URL}/api/vendor-documentations/${vendorDocumentation.id}/download`
}

const { canPreview, showPreview } = usePdfPreview()

async function previewPdf(vendorDocumentation: VendorDocumentation, usePdf: boolean = false) {
  await showPreview(vendorDocumentation, usePdf)
}
</script>
