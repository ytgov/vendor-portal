<template>
  <SimpleCard>
    <v-form
      ref="formRef"
      v-model="isValid"
      @submit.prevent="validateAndSave"
    >
      <v-label class="mb-4"> Employee Details </v-label>

      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <p class="mb-4">
            If the employee you are submitting for has previous submissions, select them from the
            list. If you cannot find them, select 'Employee not listed above' and enter their
            information in the form below.
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
            label="Birth date (mm/dd/yyyy)"
            hide-details
            :readonly="!isNil(employee?.id)"
            :append-inner-icon="!isNil(employee?.id) ? 'mdi-lock' : undefined"
            :rules="[required]"
            :disabled="!isNil(employee?.id)"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="submission.email"
            :rules="[required]"
            label="Personal Email Address"
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
            v-model="submission.position_title"
            :rules="[required]"
            label="Position title"
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
            v-model="submission.hire_date"
            label="Hire date (mm/dd/yyyy)"
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
            :rules="[required]"
            hide-details
            label="Mailing address"
            rows="2"
            auto-grow
          />
        </v-col>
      </v-row>
      <v-divider class="mt-5" />
      <v-label class="my-4"> Submission Details </v-label>
      <v-row>
        <v-col cols="12">
          <p><strong>Does this employee have a valid Yukon Health Care Card?</strong></p>
          <v-radio-group
            v-model="hasValidYukonHealthCareCard"
            hide-details
          >
            <v-radio
              label="Yes"
              value="true"
            />
            <v-radio
              label="No"
              value="false"
            />
          </v-radio-group>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <StringDateInput
            v-model="submission.request_date"
            label="Leave start date (mm/dd/yyyy)"
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
            label="Leave end date (mm/dd/yyyy)"
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

      <v-btn
        class="mt-3"
        type="submit"
        color="primary"
        :disabled="!isValid || isLoading"
        :loading="isLoading"
        text="Save Submission"
      />
    </v-form>
  </SimpleCard>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import { formatCurrency } from "@/utils/formatters"
import httpClient from "@/api/http-client"

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
import { PSLRSubmission } from "@/components/program-specific/paid-sick-leave-rebate/PaidSickLeaveHome.vue"

const props = defineProps<{ vendorId: string }>()
const vendorId = ref(props.vendorId)
const { program } = useProgram(ref("paid-sick-leave-rebate"))
const { vendor } = useVendor(vendorId)

const formRef = ref<InstanceType<typeof VForm> | null>(null)
const isValid = ref(false)
const isLoading = ref(false)

const snack = useSnack()
const router = useRouter()

const employee = ref<PSLREmployee | null>(null)
const employeeNotFound = ref(false)

const hasValidYukonHealthCareCard = ref(false)

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
    submission.value.hire_date = undefined
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

async function validateAndSave() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) return
  isLoading.value = true
  submission.value.submission_date = new Date().toISOString()

  const { data } = await httpClient.post(
    `/api/program/pslr/${props.vendorId}/submissions`,
    submission.value
  )

  console.log("Submission created:", data)
  snack.success("Submission added")

  router.push({
    name: "vendor/programs/PaidSickLeaveHome",
    params: { vendorId: props.vendorId },
  })

  isLoading.value = false
}

const breadcrumbs = computed(() => {
  return [
    {
      title: `${vendor.value?.name}`,
      to: {
        name: "vendor/HomePage",
        params: { vendorId: props.vendorId },
      },
    },
    {
      title: `${program.value?.name ?? "Loading..."}`,
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
  return program.value?.name ?? "Loading..."
})

useBreadcrumbs(title, breadcrumbs)
</script>
