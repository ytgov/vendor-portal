<template>
  <v-skeleton-loader
    v-if="isNil(program)"
    type="card"
  />
  <v-card v-else>
    <v-stepper
      v-model="step"
      :items="[
        'Welcome',
        'Program Information',
        'ATIPP Confirmation',
        'Vendor Information',
        'Review',
      ]"
      color="primary"
      elevation="0"
      hide-actions
    >
      <template #item.1>
        <v-row>
          <v-col cols="12">
            <SimpleCard title="Welcome">
              <p class="mb-4 text-subtitle-1">
                This wizard will guide you through the process of applying for the
                <strong>{{ program.name }}</strong> program.
              </p>
              <v-divider class="mb-2" />
              <p class="mb-2 text-body-1 font-weight-bold">
                If you run into any issues, please contact us for assistance.
              </p>
            </SimpleCard>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-spacer />
            <v-btn
              append-icon="mdi-chevron-right"
              text="Continue"
              @click="goNextStep"
            />
          </v-col>
        </v-row>
      </template>
      <template #item.2>
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <ProgramInfoCard
              :program-slug="program.slug"
              :show-apply="false"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-chevron-left"
              text="Previous"
              @click="goBackStep"
            />
            <v-spacer />
            <v-btn
              append-icon="mdi-chevron-right"
              text="Continue"
              @click="goNextStep"
            />
          </v-col>
        </v-row>
      </template>
      <template #item.3>
        <v-row>
          <v-col cols="12">
            <SimpleCard>
              <h2>Before you can continue</h2>
              <p class="mt-4 mb-2">
                You must agree to the following declarations as a legal representative of this
                business.
              </p>
              <v-form ref="canApplyPSLRFormRef">
                <v-checkbox
                  v-model="hasSubmittedAllDocumentsWithinSickLeavePeriod"
                  :rules="[requiredCheckbox]"
                >
                  <template #label>
                    <p class="text-black">
                      I understand that I must submit all documentation within 30 days of the end of
                      the employee's sick leave period
                    </p>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="isEmployeeSickFromIllness"
                  :rules="[requiredCheckbox]"
                >
                  <template #label>
                    <p class="text-black">
                      I have a declaration from the employee that they are sick due to illness (or
                      injury not covered by any other Act, benefit or program)
                    </p>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="isApplyingInGoodFaith"
                  :rules="[requiredCheckbox]"
                >
                  <template #label>
                    <p class="text-black">
                      I am submitting this application for the purpose of obtaining financial
                      assistance from the Government of Yukon in the form of a rebate on wages
                      already paid. The statements herein are to the best of my knowledge, true and
                      correct. I affirm that I understand the criteria and intent of the rebate
                      program and am applying to it in good faith
                    </p>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="isInAccordanceWithATIPP"
                  :rules="[requiredCheckbox]"
                >
                  <template #label>
                    <p class="text-black">
                      I understand that all or part of this application may be made available to the
                      public in accordance with the
                      <em>Access to Information and Protection of Privacy Act</em>
                    </p>
                  </template>
                </v-checkbox>
                <v-checkbox
                  v-model="hasConsentToAudit"
                  :rules="[requiredCheckbox]"
                  hide-details
                >
                  <template #label>
                    <p class="text-black">
                      I understand the Government of Yukon or its agents may audit any or all of the
                      records, including financial records of the recipient or its agents as is
                      necessary to satisfy the Government of Yukon that the objectives and
                      activities of the rebate program have been carried out and that the funds have
                      been spent in accordance with the terms of this rebate program
                    </p>
                  </template>
                </v-checkbox>
              </v-form>
            </SimpleCard>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-chevron-left"
              text="Previous"
              @click="goBackStep"
            />
            <v-spacer />
            <v-btn
              append-icon="mdi-chevron-right"
              text="Continue"
              @click="validateATIPPStepAndContinue"
            />
          </v-col>
        </v-row>
      </template>
      <template #item.4>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Vendor Information</v-card-title>
              <v-card-text>
                <p class="mb-3">
                  To apply for this program, you must upload your current Yukon Corporate Online
                  Registry (YCOR) Certificate along with your Business License or a CRA Remittance.
                  If your business offers a paid sick leave program, please also include that policy
                  in your submission.
                </p>
                <p class="mb-5">
                  Once you submit the required documents, we will review them and contact you with
                  any questions we may have. When your application is approved, you will be notified
                  via email and you will be able to submit claims through this portal at that point.
                  This process generally takes less than 2 business days.
                </p>
                <v-skeleton-loader
                  v-if="isNil(documentations) || isLoading"
                  type="card"
                />
                <v-form
                  v-else
                  ref="formRef"
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
                  </v-row>
                  <div v-if="showCorporateDocumentsDropdown">
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          v-model="selectedCorporateDocumentName"
                          :items="CORPORATE_DOCUMENTS"
                          label="Select corporate document to upload"
                          :rules="[required]"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-skeleton-loader
                          v-if="
                            isNil(selectCorporateDocumentId) || isNil(selectedCorporateDocumentName)
                          "
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
                            <strong>outside of the Yukon Paid Sick Leave Program</strong>, please
                            provide supporting policy documents.
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
                            rows="2"
                            auto-grow
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
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-chevron-left"
              text="Previous"
              @click="goBackStep"
            />
            <v-spacer />
            <v-btn
              append-icon="mdi-chevron-right"
              text="Continue"
              @click="validateVendorInformationStepAndContinue"
            />
          </v-col>
        </v-row>
      </template>
      <template #item.5>
        <v-row>
          <v-col cols="12">
            <SimpleCard>
              <p>
                <strong>
                  I understand that I must submit all documentation within 30 days of the end of the
                  employee's sick leave period.
                </strong>
              </p>
              <p v-if="hasSubmittedAllDocumentsWithinSickLeavePeriod">Yes</p>
              <p v-else>No</p>

              <p class="mt-2">
                <strong>
                  I have a declaration from the employee that they are sick due to illness (or
                  injury not covered by any other Act, benefit or program).
                </strong>
              </p>
              <p v-if="hasSubmittedAllDocumentsWithinSickLeavePeriod">Yes</p>
              <p v-else>No</p>

              <p class="mt-2">
                <strong>
                  I am submitting this application for the purpose of obtaining financial assistance
                  from the Government of Yukon in the form of a rebate on wages already paid. The
                  statements herein are to the best of my knowledge, true and correct. I affirm that
                  I understand the criteria and intent of the rebate program and am applying to it
                  in good faith.
                </strong>
              </p>
              <p v-if="hasSubmittedAllDocumentsWithinSickLeavePeriod">Yes</p>
              <p v-else>No</p>

              <p class="mt-2">
                <strong>
                  I understand that all or part of this application may be made available to the
                  public in accordance with the
                  <em>Access to Information and Protection of Privacy Act.</em>
                </strong>
              </p>
              <p v-if="hasSubmittedAllDocumentsWithinSickLeavePeriod">Yes</p>
              <p v-else>No</p>

              <p class="mt-2">
                <strong>
                  I understand the Government of Yukon or its agents may audit any or all of the
                  records, including financial records of the recipient or its agents as is
                  necessary to satisfy the Government of Yukon that the objectives and activities of
                  the rebate program have been carried out and that the funds have been spent in
                  accordance with the terms of this rebate program.
                </strong>
              </p>
              <p v-if="hasSubmittedAllDocumentsWithinSickLeavePeriod">Yes</p>
              <p v-else>No</p>
            </SimpleCard>
          </v-col>
          <v-col cols="12">
            <SimpleCard>
              <v-skeleton-loader
                v-if="isNil(documentations) || isLoading"
                type="card"
              />
              <v-form
                v-else
                ref="formRef"
                readonly
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
                      append-icon="mdi-lock"
                    />
                  </v-col>
                </v-row>
                <div v-if="showCorporateDocumentsDropdown">
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        v-model="selectedCorporateDocumentName"
                        :items="CORPORATE_DOCUMENTS"
                        label="Select corporate document to upload"
                        :rules="[required]"
                        append-icon="mdi-lock"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-skeleton-loader
                        v-if="
                          isNil(selectCorporateDocumentId) || isNil(selectedCorporateDocumentName)
                        "
                        type="paragraph"
                      />
                      <v-file-input
                        v-else
                        v-model="fileFormData[selectCorporateDocumentId]"
                        :label="selectedCorporateDocumentName"
                        :rules="[required]"
                        append-icon="mdi-lock"
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
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-file-input
                          v-model="fileFormData[documentation.id]"
                          :label="documentation.name"
                          append-icon="mdi-lock"
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
                          append-icon="mdi-lock"
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
                          append-icon="mdi-lock"
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
                            append-icon="mdi-lock"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </template>
                </div>
              </v-form>
              <v-btn
                variant="outlined"
                text="Edit"
                @click="goBackStep"
              />
            </SimpleCard>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-chevron-left"
              text="Previous"
              @click="goBackStep"
            />
            <v-spacer />
            <v-btn
              text="Finish and Submit"
              @click="submitProgramApplication"
            />
          </v-col>
        </v-row>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { clamp, isNil } from "lodash"
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/components"

import { required } from "@/utils/validators"

import vendorDocumentationsApi, { VendorDocumentation } from "@/api/vendor-documentations-api"
import { VendorFiltersOptions } from "@/api/vendors-api"
import vendorProgramsApi from "@/api/vendor-programs-api"
import { DocumentationFormats } from "@/api/documentations-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"
import useProgram from "@/use/use-program"
import useDocumentations, { DocumentationQueryOptions } from "@/use/use-documentations"

import SimpleCard from "@/components/common/SimpleCard.vue"
import DatePickerMenu from "@/components/common/DatePickerMenu.vue"
import VendorSelect from "@/components/vendors/VendorSelect.vue"
import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"
import useVendor from "@/use/use-vendor"

const programSlug = ref("paid-sick-leave-rebate")
const { program } = useProgram(programSlug)

const FIRST_STEP = 1
const LAST_STEP = 5
const step = ref(1)

function goNextStep() {
  step.value = clamp(step.value + 1, FIRST_STEP, LAST_STEP)
}

function goBackStep() {
  step.value = clamp(step.value - 1, FIRST_STEP, LAST_STEP)
}

// BEGIN STEP 3
const hasSubmittedAllDocumentsWithinSickLeavePeriod = ref(false)
const isEmployeeSickFromIllness = ref(false)
const isApplyingInGoodFaith = ref(false)
const isInAccordanceWithATIPP = ref(false)
const hasConsentToAudit = ref(false)

function requiredCheckbox(v: unknown): boolean | string {
  if (isNil(v)) {
    return "This field is required"
  }

  if (!v) {
    return "This field is required"
  }

  return true
}

const canApplyPSLRFormRef = ref<InstanceType<typeof VForm> | null>(null)

async function validateATIPPStepAndContinue() {
  if (canApplyPSLRFormRef.value === null) return

  const { valid } = await canApplyPSLRFormRef.value.validate()
  if (!valid) return

  goNextStep()
}
// END STEP 3

// BEGIN STEP 4
const vendorsFilter = computed<VendorFiltersOptions>(() => {
  return {
    withoutPendingProgram: program.value?.id,
  }
})

const query = computed<DocumentationQueryOptions>(() => {
  return {
    filters: {
      inProgram: program.value?.id,
    },
  }
})

const { documentations, isLoading } = useDocumentations(query, {
  skipWatchIf() {
    return isNil(program.value)
  },
})

const vendorId = ref<number | null>(null)
const textFormData = ref<Record<number, string | null | undefined>>({})
const fileFormData = ref<Record<number, File | null | undefined>>({})
const fileExpiresAtFormData = ref<Record<number, string | null | undefined>>({})

watch(
  () => vendorId.value,
  async (newVendorId) => {
    if (isNil(newVendorId)) return

    const { fetch } = useVendor(ref(newVendorId))

    const vend = await fetch()

    if (!isNil(vend)) {
      const address = `${vend.addressLine1}
${vend.addressLine2}
${vend.addressCity}, ${vend.addressProvince} ${vend.addressPostal}`.trim()

      if (!isNil(documentations)) {
        const mailingDocumentation = documentations.value.find(
          (doc) => doc.name === "Mailing Address"
        )
        const physicalDocumentation = documentations.value.find(
          (doc) => doc.name === "Physical Address"
        )

        if (!isNil(textFormData.value) && !isNil(mailingDocumentation)) {
          textFormData.value[mailingDocumentation.id] = address
        }
        if (!isNil(textFormData.value) && !isNil(physicalDocumentation)) {
          textFormData.value[physicalDocumentation.id] = address
        }
      }
    }
  }
)

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
  if (isNil(program.value)) return
  if (isNil(vendorId.value)) return

  const valid = await validateForm()
  if (!valid) return

  try {
    isSaving.value = true

    await createVendorDocumentations(vendorId.value)
    await vendorProgramsApi.create({
      vendorId: vendorId.value,
      programId: program.value.id,
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

async function validateVendorInformationStepAndContinue() {
  const valid = await validateForm()
  if (!valid) return

  goNextStep()
}
// END STEP 4

// BEGIN STEP 5

const router = useRouter()

async function submitProgramApplication() {
  try {
    await validateAndSave()
    router.push({ name: "vendor/HomePage", params: { vendorId: vendorId.value } })
  } catch (error) {
    snack.notify(`Failed to submit application: ${error}`, {
      color: "error",
    })
  }
}

// END STEP 5

useBreadcrumbs("Apply", [
  {
    title: "Programs available in this portal",
    to: {
      name: "programs/ProgramsAvailablePage",
    },
  },
  { title: "Apply", to: "" },
])
</script>
