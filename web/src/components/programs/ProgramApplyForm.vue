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
      <template v-if="documentation.format === 'text'">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-textarea
              v-model="textFormData[index]"
              :label="documentation.name"
              rows="3"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else-if="documentation.format === 'file'">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-file-input
              v-model="fileFormData[index]"
              :label="documentation.name"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <DatePickerMenu
              v-model="fileExpiresAtFormData[index]"
              :field-options="{ label: 'Document expiration', hideDetails: true }"
            />
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
import vendorProgramsApi, { VendorProgram } from "@/api/vendor-programs-api"

import useSnack from "@/use/use-snack"
import useCurrentUser from "@/use/use-current-user"
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

const { currentUser } = useCurrentUser<true>()

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
    createdByUserId: currentUser.value.id,
    textValue: data,
  }

  await vendorDocumentationsApi.create(attributes)
}

async function createFileVendorDocumentation(
  vendorId: number,
  documentationId: number,
  data: File,
  expiresAt: string
) {
  const attributes: Partial<VendorDocumentation> = {
    vendorId,
    documentationId,
    createdByUserId: currentUser.value.id,
    expiresAt,
    fileName: data.name,
    mimeType: data.type,
    size: data.size.toString(),
    content: data, // this just doesnt go to backend?
  }

  await vendorDocumentationsApi.create(attributes)
}

async function createVendorDocumentations(vendorId: number) {
  for (const key in textFormData.value) {
    const data = textFormData.value[key]

    if (isNil(data)) continue

    await createTextVendorDocumentation(vendorId, parseInt(key) + 1, data)
  }

  for (const key in fileFormData.value) {
    const data = fileFormData.value[key]

    const expiresAt = fileExpiresAtFormData.value[key]

    if (isNil(data)) continue
    if (isNil(expiresAt)) continue

    await createFileVendorDocumentation(vendorId, parseInt(key) + 1, data, expiresAt)
  }
}

async function createVendorProgram(vendorId: number, programId: number) {
  const attributes: Partial<VendorProgram> = {
    vendorId,
    programId,
    requestedByUserId: currentUser.value.id,
  }

  await vendorProgramsApi.create(attributes)
}

async function validateAndSave() {
  if (isNil(programIdNumber.value)) return
  if (formRef.value === null) return
  if (isNil(vendorId.value)) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isSaving.value = true

    await createVendorDocumentations(vendorId.value)
    await createVendorProgram(vendorId.value, programIdNumber.value)

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
