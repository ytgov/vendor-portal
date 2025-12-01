<template>
  <v-skeleton-loader
    v-if="isNil(vendor) || isNil(program)"
    type="card"
  />
  <SimpleCard
    v-else
    title="Add Submission"
  >
    <v-form
      ref="formRef"
      v-model="isValid"
      @submit.prevent="validateAndSave"
    >
      <v-window
        v-model="step"
        :items="[{ title: 'te' }, { title: 'g2' }, { title: 't3' }]"
      >
        <v-window-item :value="1">
          <SimpleCard>
            <h2>Before you continue</h2>
            <p class="mt-4 font-weight-bold">
              I understand that I must submit all documentation within 30 days of the end of the
              employee's sick leave period.
            </p>
            <v-checkbox
              v-model="acknowledgement1"
              label="Yes"
              :rules="[requiredCheckbox]"
              class="my-0"
              density="comfortable"
              hide-details
            />

            <p class="mt-4 font-weight-bold">
              I have a declaration from the employee that they are sick due to illness (or injury
              not covered by any other Act, benefit or program).
            </p>
            <v-checkbox
              v-model="acknowledgement2"
              label="Yes"
              :rules="[requiredCheckbox]"
              class="my-0"
              density="comfortable"
              hide-details
            />

            <p class="mt-4 font-weight-bold">
              I am submitting this application for the purpose of obtaining financial assistance
              from the Government of Yukon in the form of a rebate on wages already paid. The
              statements herein are to the best of my knowledge, true and correct. I affirm that I
              understand the criteria and intent of the rebate program and am applying to it in good
              faith.
            </p>
            <v-checkbox
              v-model="acknowledgement3"
              label="Yes"
              :rules="[requiredCheckbox]"
              class="my-0"
              density="comfortable"
              hide-details
            />

            <p class="mt-4 font-weight-bold">
              I understand that all or part of this application may be made available to the public
              in accordance with the <em>Access to Information and Protection of Privacy Act</em>.
            </p>

            <v-checkbox
              v-model="acknowledgement4"
              label="Yes"
              :rules="[requiredCheckbox]"
              class="my-0"
              density="comfortable"
              hide-details
            />

            <p class="mt-4 font-weight-bold">
              I understand the Government of Yukon or its agents may audit any or all of the
              records, including financial records of the recipient or its agents as is necessary to
              satisfy the Government of Yukon that the objectives and activities of the rebate
              program have been carried out and that the funds have been spent in accordance with
              the terms of this rebate program.
            </p>

            <v-checkbox
              v-model="acknowledgement5"
              label="Yes"
              :rules="[requiredCheckbox]"
              class="my-0"
              density="comfortable"
              hide-details
            />
          </SimpleCard>

          <div class="mt-4 d-flex">
            <v-spacer />
            <v-btn
              :disabled="allAcknowledged"
              @click="step++"
              >Continue</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="2">
          <v-row>
            <v-col cols="12">
              <SimpleCard>
                <h2 class="mb-4">Employee Details</h2>

                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <p class="mb-4">
                      If the employee you are submitting for has previous submissions, select them
                      from the list. If you cannot find them, select 'Employee not listed above' and
                      enter their information in the form below.
                    </p>
                    <EmployeeSelect
                      v-model="employee"
                      label="Select existing employee"
                      hide-details
                      clearable
                      return-object
                      :vendor-id="props.vendorId"
                    />

                    <v-switch
                      v-model="employeeNotFound"
                      label="Employee not listed above"
                      hide-details
                      class="mt-2"
                    />
                  </v-col>

                  <v-col cols="12">
                    <p>Please use employee's name on their paystubs.</p>
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="submission.first_name"
                      :rules="[required]"
                      label="First name"
                      hide-details
                      :readonly="!isNil(employee?.id)"
                      :append-inner-icon="!isNil(employee?.id) ? 'mdi-lock' : undefined"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="submission.last_name"
                      :rules="[required]"
                      label="Last name"
                      hide-details
                      :readonly="!isNil(employee?.id)"
                      :append-inner-icon="!isNil(employee?.id) ? 'mdi-lock' : undefined"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <StringDateInput
                      v-model="submission.birth_date"
                      label="Birth date (yyyy-mm-dd)"
                      hide-details
                      :readonly="!isNil(employee?.id)"
                      :append-inner-icon="!isNil(employee?.id) ? 'mdi-lock' : undefined"
                      :rules="[required]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="submission.email"
                      label="Personal Email Address"
                      hide-details
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="submission.position_title"
                      :rules="[required]"
                      label="Position title"
                      hide-details
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <StringDateInput
                      v-model="submission.hire_date"
                      label="Hire date (yyyy-mm-dd)"
                      hide-details
                      :rules="[required]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="12"
                  >
                    <v-textarea
                      v-model="submission.mailing_address"
                      hide-details
                      label="Mailing address"
                      rows="2"
                      auto-grow
                    />
                  </v-col>
                </v-row>

                <h2 class="my-4">Did You Verify?</h2>

                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      label="The employee earns $36.71 per hour or less"
                      :rules="[requiredCheckbox]"
                      class="my-0"
                      density="comfortable"
                      hide-details
                    />

                    <v-checkbox
                      label="The employee has a valid Yukon Health Card"
                      :rules="[requiredCheckbox]"
                      class="my-0"
                      density="comfortable"
                      hide-details
                    />

                    <v-checkbox
                      label="The employee worked for your business for at least 90 days consecutively prior to the first day of leave"
                      :rules="[requiredCheckbox]"
                      class="my-0"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <h2 class="my-4">Submission Details</h2>

                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <StringDateInput
                      v-model="submission.request_date"
                      label="Leave start date (yyyy-mm-dd)"
                      hide-details
                      :rules="[required]"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                  >
                    <StringDateInput
                      v-model="submission.request_end_date"
                      :min="submission.request_date"
                      label="Leave end date (yyyy-mm-dd)"
                      :rules="[required]"
                      hide-details
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-currency
                      v-model="submission.hourly_rate"
                      :rules="[required]"
                      label="Hourly rate"
                      hide-details
                      :decimals="4"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-number
                      v-model="submission.request_hours"
                      :rules="[required]"
                      label="Requested hours"
                      hide-details
                      :decimals="2"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      :model-value="formatCurrency(submission.request_amount ?? 0)"
                      label="Requested amount"
                      readonly
                      append-inner-icon="mdi-calculator"
                      hide-details
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="submission.notes"
                      label="Notes"
                      hide-details
                      rows="2"
                      auto-grow
                    />
                  </v-col>

                  <v-col cols="12">
                    <p class="mb-2">
                      Please attach a copy of the employee's paystub(s) that corresponds with this
                      claim. (PDF)
                    </p>
                    <v-file-input
                      v-model="submission.pay_stub"
                      accept=".pdf"
                      :rules="[required]"
                      multiple
                      hide-details
                      show-size
                      truncate-length="25"
                      required
                    />
                  </v-col>

                  <v-col cols="12">
                    <p class="mb-2">
                      Please attach a copy of the employee's paystub for the period immediately
                      prior to this sick leave claim. (PDF)
                    </p>
                    <v-file-input
                      v-model="submission.pay_stub_prior"
                      accept=".pdf"
                      :rules="[required]"
                      hide-details
                      show-size
                      truncate-length="25"
                      required
                    />
                  </v-col>

                  <v-col cols="12">
                    <p class="mb-2">
                      Please attach any other supporting documents (if necessary). (PDF)
                    </p>
                    <v-file-input
                      v-model="submission.supporting_documents"
                      multiple
                      accept=".pdf"
                      hide-details
                      show-size
                      truncate-length="25"
                      required
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      label="The employee was sick within 30 days of the date you are submitting this application"
                      :rules="[requiredCheckbox]"
                      class="my-0"
                      density="comfortable"
                      hide-details
                    />
                    <v-checkbox
                      label="The employee was paid for the sick leave being claimed"
                      :rules="[requiredCheckbox]"
                      class="my-0"
                      density="comfortable"
                      hide-details
                    />
                    <p class="ml-2 mt-1 text-body-1">
                      Has the employee used all paid sick leave provided to them annually by your
                      business (if your business provides paid sick leave)?
                    </p>
                    <v-radio-group
                      v-model="submission.all_provided_sick_used"
                      :rules="[required]"
                      inline
                      density="comfortable"
                      hide-details
                    >
                      <v-radio
                        label="Yes"
                        :value="true"
                        class="mr-4"
                      />
                      <v-radio
                        label="No"
                        :value="false"
                      />
                    </v-radio-group>
                  </v-col>
                </v-row>
              </SimpleCard>
            </v-col>
          </v-row>
          <div class="mt-0 d-flex">
            <v-spacer />
            <v-btn
              :disabled="!isValid"
              @click="validateFormAndContinue"
              >Continue</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="3">
          <v-row>
            <v-col>
              <SimpleCard>
                <h2>Review</h2>
                <p class="mt-4 font-weight-bold">
                  I understand that I must submit all documentation within 30 days of the end of the
                  employee's sick leave period.
                </p>
                <v-checkbox
                  :model-value="true"
                  label="Yes"
                  readonly
                  class="my-0"
                  density="comfortable"
                  hide-details
                />

                <p class="mt-4 font-weight-bold">
                  I have a declaration from the employee that they are sick due to illness (or
                  injury not covered by any other Act, benefit or program).
                </p>
                <v-checkbox
                  :model-value="true"
                  label="Yes"
                  readonly
                  class="my-0"
                  density="comfortable"
                  hide-details
                />

                <p class="mt-4 font-weight-bold">
                  I am submitting this application for the purpose of obtaining financial assistance
                  from the Government of Yukon in the form of a rebate on wages already paid. The
                  statements herein are to the best of my knowledge, true and correct. I affirm that
                  I understand the criteria and intent of the rebate program and am applying to it
                  in good faith.
                </p>
                <v-checkbox
                  :model-value="true"
                  label="Yes"
                  readonly
                  class="my-0"
                  density="comfortable"
                  hide-details
                />

                <p class="mt-4 font-weight-bold">
                  I understand that all or part of this application may be made available to the
                  public in accordance with the
                  <em>Access to Information and Protection of Privacy Act</em>.
                </p>

                <v-checkbox
                  :model-value="true"
                  label="Yes"
                  readonly
                  class="my-0"
                  density="comfortable"
                  hide-details
                />

                <p class="mt-4 font-weight-bold">
                  I understand the Government of Yukon or its agents may audit any or all of the
                  records, including financial records of the recipient or its agents as is
                  necessary to satisfy the Government of Yukon that the objectives and activities of
                  the rebate program have been carried out and that the funds have been spent in
                  accordance with the terms of this rebate program.
                </p>

                <v-checkbox
                  :model-value="true"
                  label="Yes"
                  readonly
                  class="my-0"
                  density="comfortable"
                  hide-details
                />
              </SimpleCard>
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-btn
              variant="outlined"
              @click="step--"
              >Go back a step</v-btn
            >
            <v-spacer />
            <v-btn
              type="submit"
              color="primary"
              :loading="isLoading"
              text="Finish and Submit"
            />
          </div>
        </v-window-item>
      </v-window>
    </v-form>
  </SimpleCard>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref, toRefs, watch } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/components"

import { required } from "@/utils/validators"
import { formatCurrency } from "@/utils/formatters"
import { PSLR } from "@/api/program-specific"
import { PSLRSubmission } from "@/api/program-specific/paid-sick-leave-rebate/submissions-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useSnack from "@/use/use-snack"
import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"

import VCurrency from "@/components/common/VCurrency.vue"
import VNumber from "@/components/common/VNumber.vue"
import SimpleCard from "@/components/common/SimpleCard.vue"
import StringDateInput from "@/components/common/StringDateInput.vue"
import EmployeeSelect, {
  PSLREmployee,
} from "@/components/program-specific/paid-sick-leave-rebate/EmployeeSelect.vue"

const step = ref(1)

const props = defineProps<{ vendorId: string }>()
const { vendorId } = toRefs(props)

const { program } = useProgram(ref("paid-sick-leave-rebate"))
const { vendor } = useVendor(vendorId)

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const isValid = ref(false)
const isLoading = ref(false)

const acknowledgement1 = ref(false)
const acknowledgement2 = ref(false)
const acknowledgement3 = ref(false)
const acknowledgement4 = ref(false)
const acknowledgement5 = ref(false)
const allAcknowledged = computed(() => {
  return !(
    acknowledgement1.value &&
    acknowledgement2.value &&
    acknowledgement3.value &&
    acknowledgement4.value &&
    acknowledgement5.value
  )
})

function requiredCheckbox(v: unknown): boolean | string {
  if (isNil(v)) {
    return "This field is required"
  }

  if (!v) {
    return "This field is required"
  }

  return true
}

const employee = ref<PSLREmployee | null>(null)
const employeeNotFound = ref(false)

const submission = ref<Partial<PSLRSubmission>>({
  request_date: undefined,
  request_end_date: undefined,
  hire_date: undefined,

  first_name: undefined,
  last_name: undefined,
  birth_date: undefined,
  email: undefined,

  vendor_id: props.vendorId,
})

watch(
  submission,
  (newSubmission) => {
    if (!isNil(newSubmission.request_hours) && !isNil(newSubmission.hourly_rate))
      newSubmission.request_amount =
        Math.round(newSubmission.request_hours * newSubmission.hourly_rate * 100) / 100
  },
  { deep: true }
)

watch(employee, (newEmployee: PSLREmployee | null) => {
  if (newEmployee) {
    submission.value.first_name = newEmployee.first_name
    submission.value.last_name = newEmployee.last_name
    submission.value.email = newEmployee.email
    submission.value.birth_date = newEmployee.birth_date
    submission.value.program_pslr4_id = newEmployee.id
    submission.value.hire_date = newEmployee.hire_date
    submission.value.position_title = newEmployee.position_title
    submission.value.mailing_address = newEmployee.mailing_address
    employeeNotFound.value = false
  } else {
    submission.value.first_name = undefined
    submission.value.last_name = undefined
    submission.value.email = undefined
    submission.value.birth_date = undefined
  }
})

watch(employeeNotFound, (newValue) => {
  if (newValue) {
    employee.value = null
  }
})

function validateEitherMailingOrPhysicalAddressRequired() {
  const isSubmissionMailingAddressEmpty =
    isNil(submission.value.mailing_address) || isEmpty(submission.value.mailing_address)
  const isSubmissionEmailEmpty = isNil(submission.value.email) || isEmpty(submission.value.email)

  if (isSubmissionMailingAddressEmpty && isSubmissionEmailEmpty) {
    return false
  }

  return true
}

const snack = useSnack()
const router = useRouter()

async function validateFormAndContinue() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  if (!validateEitherMailingOrPhysicalAddressRequired()) {
    snack.error("Please fill out either mailing or physical address")
    return
  }

  step.value++
}

async function validateAndSave() {
  await validateFormAndContinue()

  try {
    isLoading.value = true
    submission.value.submission_date = new Date().toISOString()

    await PSLR.submissionsApi.create(props.vendorId, submission.value)

    snack.success("Submission added")

    router.push({
      name: "vendor/programs/PaidSickLeaveHome",
      params: { vendorId: props.vendorId },
    })
  } catch (error) {
    console.error(error)
    snack.error(`Failed to create submission: ${error}`)
  } finally {
    isLoading.value = false
  }
}

const breadcrumbs = computed(() => {
  if (isNil(vendor.value) || isNil(program.value)) {
    return [
      {
        title: "Loading...",
        to: {
          name: "individual/HomePage",
        },
      },
    ]
  }

  return [
    {
      title: vendor.value.name,
      to: {
        name: "vendor/HomePage",
        params: { vendorId: vendorId.value },
      },
    },
    {
      title: program.value.name,
      to: {
        name: "vendor/programs/PaidSickLeaveHome",
      },
    },
    {
      title: "Add Submission",
      to: {
        name: "vendor/programs/PaidSickLeaveNew",
      },
    },
  ]
})

const title = computed(() => {
  if (isNil(program.value)) return "Loading..."
  return `Add Submission for ${program.value.name}`
})

useBreadcrumbs(title, breadcrumbs)
</script>
