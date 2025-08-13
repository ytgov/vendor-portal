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
          label="Vendor applying for this program"
          :filters="vendorsFilter"
          :rules="[required]"
        />
      </v-col>
      <!-- 
      <v-col
        cols="12"
        md="6"
      >
        Self employed ?
      </v-col> -->
    </v-row>
    <div v-if="showCorporateDocumentsDropdown">
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="selectedCorporateDocumentName"
            :items="CORPORATE_DOCUMENTS"
            label="Select document to upload"
            :rules="[required]"
          />
        </v-col>
        <v-col cols="6">
          <v-skeleton-loader
            v-if="isNil(selectCorporateDocumentId) || isNil(selectedCorporateDocumentName)"
            type="paragraph"
          />
          <v-file-input
            v-else
            v-model="fileFormData[selectCorporateDocumentId]"
            :label="selectedCorporateDocumentName"
            :rules="[required]"
          />
        </v-col>
      </v-row>
    </div>

    <div
      v-for="(documentation, index) in documentations"
      :key="index"
    >
      <!-- BEGIN HANDLING SPECIAL DOCUMENTATION CASES -->
      <template v-if="documentation.name === 'YCOR Certificate'"></template>
      <template v-else-if="documentation.name === 'Business License'"></template>
      <template v-else-if="documentation.name === 'CRA Remittance'"></template>
      <template v-else-if="documentation.name === 'Paid Sick Leave Policy'">
        <v-row>
          <v-col cols="12">
            <p>
              If your business offers paid sick leave benefits
              <strong>outside of the Yukon Paid Sick Leave Program</strong>, please provide
              supporting policy documents.
            </p>
          </v-col>
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
      <!-- END HANDLING SPECIAL DOCUMENTATION CASES -->
      <template v-else-if="documentation.format === DocumentationFormats.TEXT">
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
      <template v-else-if="documentation.format === DocumentationFormats.BOOLEAN">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-checkbox
              v-model="textFormData[documentation.id]"
              density="comfortable"
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

    <div class="d-flex">
      <v-spacer />
      <v-btn
        type="submit"
        :loading="isSaving"
        text="Apply Now"
      />
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref } from "vue"
import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"

import vendorDocumentationsApi, { VendorDocumentation } from "@/api/vendor-documentations-api"
import vendorProgramsApi from "@/api/vendor-programs-api"
import { DocumentationFormats } from "@/api/documentations-api"

import useSnack from "@/use/use-snack"
import useDocumentations, { DocumentationQueryOptions } from "@/use/use-documentations"

import VendorSelect from "@/components/vendors/VendorSelect.vue"
import DatePickerMenu from "@/components/common/DatePickerMenu.vue"
import { VendorFiltersOptions } from "@/api/vendors-api"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))

const vendorsFilter = computed<VendorFiltersOptions>(() => {
  return {
    withoutPendingProgram: programIdNumber.value,
  }
})

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

/* 
For handling special documentation cases

This is a bit of a hack to handle the special case of Business License and CRA Remittance documents.

If a program requires both documents, we show a dropdown to select which one to upload since both are not required.
*/
const CORPORATE_DOCUMENTS = ["Business License", "CRA Remittance"]

const showCorporateDocumentsDropdown = computed<boolean>(() => {
  const documentationNames = documentations.value.map((documentation) => documentation.name)

  return CORPORATE_DOCUMENTS.every((document) => documentationNames.includes(document))
})

const selectedCorporateDocumentName = ref<string | null>(CORPORATE_DOCUMENTS[0])

const selectCorporateDocumentId = computed<number | null>(() => {
  const documentation = documentations.value.find(
    (documentation) => documentation.name === selectedCorporateDocumentName.value
  )

  return documentation?.id ?? null
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

const emit = defineEmits<{ saved: [vendorId: number] }>()

function hasCorprateDocument() {
  return (
    !isNil(selectCorporateDocumentId.value) &&
    !isNil(fileFormData.value[selectCorporateDocumentId.value])
  )
}

async function validateForm() {
  if (formRef.value === null) return false

  const { valid: isFormValid } = await formRef.value.validate()

  const corporateDocumentSatisfied = hasCorprateDocument() || !showCorporateDocumentsDropdown.value

  return isFormValid && corporateDocumentSatisfied
}

async function validateAndSave() {
  if (isNil(programIdNumber.value)) return
  if (isNil(vendorId.value)) return

  const valid = await validateForm()
  if (!valid) return

  try {
    isSaving.value = true

    await createVendorDocumentations(vendorId.value)
    await vendorProgramsApi.create({
      vendorId: vendorId.value,
      programId: programIdNumber.value,
    })

    emit("saved", vendorId.value)
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

defineExpose({
  validate: validateForm,
})
</script>
