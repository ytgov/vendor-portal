<template>
  <v-skeleton-loader
    v-if="isNil(vendorProgram)"
    type="card"
  />
  <div v-else>
    <ProgramDocumentationAttachmentsCard
      v-for="(programDocumentation, index) in programDocumentations"
      :key="index"
      class="mb-5"
      :program-documentation-id="programDocumentation.id"
    />
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import useVendorProgram from "@/use/use-vendor-program"
import useProgramDocumentations, {
  ProgramDocumentationQueryOptions,
} from "@/use/use-program-documentations"

import ProgramDocumentationAttachmentsCard from "@/components/program-documentations/ProgramDocumentationAttachmentsCard.vue"

const props = defineProps<{ vendorProgramId: number }>()

const { vendorProgramId } = toRefs(props)

const { vendorProgram } = useVendorProgram(vendorProgramId)

const programDocumentationsQuery = computed<ProgramDocumentationQueryOptions>(() => {
  if (isNil(vendorProgram.value)) return {} // where 1 == 0 ?

  return {
    where: {
      programId: vendorProgram.value.programId,
    },
    filters: {},
    perPage: 10,
    page: 1,
  }
})

const { programDocumentations } = useProgramDocumentations(programDocumentationsQuery, {
  skipWatchIf: () => isNil(vendorProgram.value),
})
</script>
