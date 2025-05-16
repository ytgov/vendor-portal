<template>
  <v-skeleton-loader
    v-if="isNil(documentations) || isLoading"
    type="card"
  />
  <v-form
    v-else
    ref="formRef"
    @submit.prevent="validateAndSave"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <VendorSelect
          v-model="vendorId"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        Self employed ?
      </v-col>
    </v-row>
    <div
      v-for="(documentation, index) in documentations"
      :key="index"
    >
      <template v-if="documentation.format === DocumentationFormats.TEXT">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="textFormData[documentation.id]"
              :label="documentation.name"
              rows="3"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else-if="documentation.format === DocumentationFormats.FILE">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-file-input
              v-model="fileFormData[documentation.id]"
              :label="documentation.name"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div v-if="documentation.expires">
              <DatePickerMenu
                v-model="fileExpiresAtFormData[documentation.id]"
                :field-options="{ label: 'Document expiration', hideDetails: true }"
              />
            </div>
          </v-col>
        </v-row>
      </template>
    </div>

    <v-btn
      type="submit"
      :disabled="!isValid"
      :loading="isSaving"
      text="Save"
    />
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref } from "vue"
import { VForm } from "vuetify/lib/components/index.mjs"

import vendorDocumentationsApi, { VendorDocumentation } from "@/api/vendor-documentations-api"
import vendorProgramsApi from "@/api/vendor-programs-api"
import { DocumentationFormats } from "@/api/documentations-api"

import useSnack from "@/use/use-snack"
import useProgram from "@/use/use-program"
import useDocumentations, { DocumentationQueryOptions } from "@/use/use-documentations"

import VendorSelect from "@/components/vendors/VendorSelect.vue"
import DatePickerMenu from "@/components/common/DatePickerMenu.vue"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))
useProgram(programIdNumber)

const query = ref<DocumentationQueryOptions>({
  filters: {
    inProgram: programIdNumber.value,
  },
})

const { documentations, isLoading } = useDocumentations(query)

const vendorId = ref<number | null>(null)
const textFormData = ref<Record<number, string | null | undefined>>({})
const fileFormData = ref<Record<number, File | null | undefined>>({})
const fileExpiresAtFormData = ref<Record<number, string | null | undefined>>({})

// If the save button can be pressed, currently idk how this should be implemented
const isValid = computed(() => {
  return true
})

const snack = useSnack()
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const isSaving = ref(false)

async function createTextVendorDocumentation(
  vendorId: number,
  documentationId: number,
  data: string
) {
  const attributes: Partial<VendorDocumentation> = {
    vendorId,
    documentationId,
    textValue: data,
  }

  await vendorDocumentationsApi.create(attributes)
}

async function createFileVendorDocumentation(
  vendorId: number,
  documentationId: number,
  data: File,
  expiresAt: string | null | undefined
) {
  const attributes: Partial<VendorDocumentation> = {
    vendorId,
    documentationId,
    expiresAt,
    fileName: data.name,
    mimeType: data.type,
    size: data.size.toString(),
    content: data,
  }

  await vendorDocumentationsApi.create(attributes)
}

async function createVendorDocumentations(vendorId: number) {
  for (const key in textFormData.value) {
    const data = textFormData.value[key]

    if (isNil(data)) continue

    await createTextVendorDocumentation(vendorId, parseInt(key), data)
  }

  for (const key in fileFormData.value) {
    const data = fileFormData.value[key]

    const expiresAt = fileExpiresAtFormData.value[key]

    if (isNil(data)) continue

    await createFileVendorDocumentation(vendorId, parseInt(key), data, expiresAt)
  }
}

const emit = defineEmits<{ saved: [programId: number] }>()

async function validateAndSave() {
  if (isNil(programIdNumber.value)) return
  if (formRef.value === null) return
  if (isNil(vendorId.value)) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isSaving.value = true

    await createVendorDocumentations(vendorId.value)
    await vendorProgramsApi.create({
      vendorId: vendorId.value,
      programId: programIdNumber.value,
    })

    emit("saved", programIdNumber.value)
    snack.notify("Application Submitted", {
      color: "success",
    })
  } catch (error) {
    snack.notify(`Failed to submit application: ${error}`, {
      color: "error",
    })
  } finally {
    isSaving.value = false
  }
}
</script>
