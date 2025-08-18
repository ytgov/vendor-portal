<template>
  <v-skeleton-loader
    v-if="isNil(vendor) || isNil(program)"
    type="card"
  />
  <SimpleCard
    v-else
    title="Add Submission"
  >
    <v-row>
      <v-col cols="12">
        <SimpleCard>
          <h2>Do you qualify?</h2>
          <p class="mt-4">Confirm the following</p>
          <v-form ref="qualifyFormRef">
            <v-checkbox
              v-model="isYukonBasedBusiness"
              :rules="[requiredCheckbox]"
              hide-details
            >
              <template #label>
                <p>Your business is a Yukon-based business</p>
              </template>
            </v-checkbox>
            <v-checkbox
              v-model="hasValidYukonHealthCareCard"
              :rules="[requiredCheckbox]"
              hide-details
            >
              <template #label>
                <p>You have a valid Yukon health care card</p>
              </template>
            </v-checkbox>
            <v-checkbox
              v-model="hasEarningLessThenThreshold"
              :rules="[requiredCheckbox]"
              hide-details
            >
              <template #label>
                <p>Your average earnings are less than or equal to $36.71 per hour</p>
              </template>
            </v-checkbox>
            <v-checkbox
              v-model="wasSickWithin30Days"
              :rules="[requiredCheckbox]"
              hide-details
            >
              <template #label>
                <p>You were sick within 30 days of the date you are submitting this application</p>
              </template>
            </v-checkbox>
          </v-form>
        </SimpleCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <PaidSickLeaveCreateForm :vendor-id="vendorId" />
      </v-col>
    </v-row>
  </SimpleCard>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref, toRefs } from "vue"
import { VForm } from "vuetify/lib/components/index.mjs"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"

import SimpleCard from "@/components/common/SimpleCard.vue"
import PaidSickLeaveCreateForm from "@/components/program-specific/paid-sick-leave-rebate/PaidSickLeaveCreateForm.vue"

const props = defineProps<{ vendorId: string }>()
const { vendorId } = toRefs(props)

const { program } = useProgram(ref("paid-sick-leave-rebate"))
const { vendor } = useVendor(vendorId)

const isYukonBasedBusiness = ref(false)
const hasValidYukonHealthCareCard = ref(false)
const hasEarningLessThenThreshold = ref(false)
const wasSickWithin30Days = ref(false)

function requiredCheckbox(v: unknown): boolean | string {
  if (isNil(v)) {
    return "This field is required"
  }

  if (!v) {
    return "This field is required"
  }

  return true
}

const qualifyFormRef = ref<InstanceType<typeof VForm> | null>(null)

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
