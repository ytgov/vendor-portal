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
          class="mb-5"
        >
          <p class="mb-2">
            File name: <strong>{{ vendorDocumentation.fileName }}</strong>
          </p>
          <p class="mb-5">
            Expires on: <strong> {{ formatDate(vendorDocumentation.expiresAt) }}</strong>
          </p>
          <v-btn
            class="mr-5"
            size="small"
            text="View"
          />
          <v-btn
            size="small"
            text="Download"
          />
        </div>
      </div>
      <div v-else-if="programDocumentation.documentation.format === DocumentationFormats.TEXT">
        <div
          v-for="(vendorDocumentation, index) in vendorDocumentations"
          :key="index"
          class="mb-5"
        >
          <p>
            {{ vendorDocumentation.textValue }}
          </p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import { formatDate } from "@/utils/formatters"

import useProgramDocumentation from "@/use/use-program-documentation"
import useVendorDocumentations, {
  VendorDocumentationQueryOptions,
} from "@/use/use-vendor-documentations"
import { DocumentationFormats } from "@/api/documentations-api"

const props = defineProps<{ programDocumentationId: number }>()

const { programDocumentationId } = toRefs(props)

const { programDocumentation } = useProgramDocumentation(programDocumentationId)

const vendorDocumentationsQuery = computed<VendorDocumentationQueryOptions>(() => {
  if (isNil(programDocumentation.value)) return {} // where 1 == 0 ?

  return {
    where: {
      documentationId: programDocumentation.value.documentationId,
    },
    filters: {},
    perPage: 10,
    page: 1,
  }
})

const { vendorDocumentations } = useVendorDocumentations(vendorDocumentationsQuery, {
  skipWatchIf: () => isNil(programDocumentation.value),
})
</script>
