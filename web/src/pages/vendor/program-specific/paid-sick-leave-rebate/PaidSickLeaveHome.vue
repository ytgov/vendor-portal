<template>
  <h3 class="mb-3">Previous Submissions</h3>

  <v-row>
    <v-col cols="4">
      <v-select
        v-model="viewBy"
        label="Group submissions by"
        bg-color="white"
        :items="['Submission Date', 'Employee']"
      />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-model="search"
        clearable
        label="Search by Employee Name"
      />
    </v-col>
    <v-col
      cols="4"
      class="text-right"
    >
      <v-btn
        color="primary"
        :to="{
          name: 'vendor/programs/PaidSickLeaveNew',
          params: { vendorId: props.vendorId },
        }"
      >
        Add Submission
      </v-btn>
    </v-col>
  </v-row>

  <div v-if="viewBy == 'Submission Date'">
    <div
      v-for="(group, groupIdx) of submissionsByDate"
      :key="groupIdx"
    >
      <v-card class="mb-5">
        <v-card-title> <strong>Submitted On:</strong> {{ group[0].submission_date }} </v-card-title>

        <v-data-table
          :items="group"
          :headers="[
            { title: 'Name', value: 'employee_name' },
            { title: 'Email', value: 'email' },
            { title: 'Birth Date', value: 'birth_date' },
            { title: 'Request Amount', value: 'request_amount' },
            { title: 'Status', value: 'status' },
          ]"
          hide-default-footer
          @click:row="openSubmission"
        >
          <template #item.request_amount="{ item }">
            {{ formatMoney(item.request_amount, 2) }}
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
  <div v-else>
    <div
      v-for="(group, groupIdx) of submissionsByEmployee"
      :key="groupIdx"
    >
      <v-card class="mb-5">
        <v-card-title>
          <strong>{{ group[0].employee_name }}</strong> ({{ group[0].birth_date }})
        </v-card-title>

        <v-data-table
          :items="group"
          :headers="[
            { title: 'Name', value: 'employee_name' },
            { title: 'Submission Date', value: 'submission_date' },
            { title: 'Request Amount', value: 'request_amount' },
            { title: 'Status', value: 'status' },
          ]"
          hide-default-footer
          @click:row="openSubmission"
        >
          <template #item.request_amount="{ item }">
            {{ formatMoney(item.request_amount, 2) }}
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
  <div v-if="submissions.length === 0">
    <v-card class="mb-5">
      <v-card-title>No Submissions Found</v-card-title>
      <v-card-text>
        <p>You can add a new submission using the 'Add Submission' button above.</p>
      </v-card-text>
    </v-card>
  </div>

  <v-skeleton-loader
    v-if="isNil(selectedSubmission)"
    type="card"
  />
  <SubmissionAttributesDialog
    v-else
    ref="submissionAttributesDialogRef"
    :submission="selectedSubmission"
    width="600"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { isNil, groupBy } from "lodash"

import { PSLR } from "@/api/program-specific"
import { PSLRSubmission } from "@/api/program-specific/paid-sick-leave-rebate/submissions-api"

import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"
import useBreadcrumbs from "@/use/use-breadcrumbs"

import SubmissionAttributesDialog from "@/components/program-specific/paid-sick-leave-rebate/SubmissionAttributesDialog.vue"

const props = defineProps<{ vendorId: string }>()
const { program } = useProgram(ref("paid-sick-leave-rebate"))

const search = ref("")

const submissions = ref<PSLRSubmission[]>([])

const submissionsByDate = computed(() => {
  if (search.value) {
    return groupBy(
      submissions.value.filter((submission) =>
        submission.employee_name.toLowerCase().includes(search.value.toLowerCase())
      ),
      "submission_date"
    )
  }
  return groupBy(submissions.value, "submission_date")
})

const submissionsByEmployee = computed(() => {
  if (search.value) {
    return groupBy(
      submissions.value.filter((submission) =>
        submission.employee_name.toLowerCase().includes(search.value.toLowerCase())
      ),
      "employee_name"
    )
  }
  return groupBy(submissions.value, "program_id")
})

async function loadSubmissions() {
  const data = await PSLR.submissionsApi.list(props.vendorId)
  submissions.value = data.submissions
}

const vendorId = ref(props.vendorId)
const selectedSubmission = ref<PSLRSubmission | null>(null)

const submissionAttributesDialogRef = ref<InstanceType<typeof SubmissionAttributesDialog> | null>(
  null
)

const { vendor } = useVendor(vendorId)

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
  ]
})

const title = computed(() => {
  return program.value?.name ?? "Loading..."
})

useBreadcrumbs(title, breadcrumbs)

const viewBy = ref("Date")

onMounted(() => {
  const sort = localStorage.getItem("pslrSort")

  if (sort) {
    viewBy.value = sort
  }
})

watch(
  () => viewBy.value,
  (newVal) => {
    localStorage.setItem("pslrSort", newVal)
  }
)

onMounted(() => {
  loadSubmissions()
})

function formatMoney(amount: number, minimumFractionDigits: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
  }).format(amount)
}

function openSubmission(_event: MouseEvent, { item }: { item: PSLRSubmission }) {
  selectedSubmission.value = item
  submissionAttributesDialogRef.value?.show()
}
</script>
