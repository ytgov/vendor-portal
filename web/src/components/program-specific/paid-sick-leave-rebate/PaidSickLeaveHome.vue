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

  <v-dialog
    v-model="showViewDialog"
    width="600"
  >
    <v-card v-if="selectedSubmission">
      <v-card-title class="mb-0 d-flex">
        Submission Details
        <v-chip
          class="ml-3"
          color="success"
          size="small"
          style="margin-top: 2px"
        >
          {{ selectedSubmission.status }}
        </v-chip>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          size="x-small"
          variant="tonal"
          title="Close"
          @click="showViewDialog = false"
        >
          <v-icon size="21">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2">
        <v-row class="text-subtitle-1">
          <v-col cols="6">
            <div class="mb-2">
              <strong>Employee Name / Birth Date:</strong>
              <br />
              {{ selectedSubmission.employee_name }} / {{ selectedSubmission.birth_date }}
            </div>
            <div class="mb-2">
              <strong>Submitted On:</strong>
              <br />
              {{ selectedSubmission.submission_date }}
            </div>
          </v-col>
          <v-col cols="6">
            <div class="mb-2">
              <strong>Employee Email:</strong>
              <br />
              {{ selectedSubmission.email }}
            </div>
            <div class="mb-2">
              <strong>Date Range:</strong>
              <br />{{ selectedSubmission.request_date }} -
              {{ selectedSubmission.request_end_date }}
            </div>
          </v-col>
          <v-divider />
          <v-col cols="12">
            <div class="mb-2">
              <strong>Request:</strong>
              <br />
              {{ formatMoney(selectedSubmission.hourly_rate, 3) }}/hour x
              {{ selectedSubmission.request_hours }} hours =
              {{ formatMoney(selectedSubmission.request_amount, 2) }}
            </div>
            <div class="mb-2">
              <strong>Payment:</strong>
              <br />
              {{ formatMoney(selectedSubmission.paid_rate, 3) }}/hour x
              {{ selectedSubmission.paid_hours }} hours =
              {{ formatMoney(selectedSubmission.paid_amount, 2) }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { groupBy } from "lodash"

import http from "@/api/http-client"
import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"
import useBreadcrumbs from "@/use/use-breadcrumbs"

const props = defineProps<{ vendorId: string }>()
const { program } = useProgram(ref("paid-sick-leave-rebate"))

const search = ref("")

export type PSLRSubmission = {
  id: string
  program_pslr4_id: string
  vendor_id: string
  status: string
  payment_status: string
  request_amount: number
  first_name: string
  last_name: string
  employee_name: string
  birth_date: string
  hire_date: string
  email: string
  mailing_address: string
  submission_date: string
  request_date: string
  request_end_date: string
  hourly_rate: number
  request_hours: number
  paid_rate: number
  paid_hours: number
  paid_amount: number
}

const showViewDialog = ref(false)

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
  const { data } = await http.get(`/api/program/pslr/${props.vendorId}/submissions`)
  submissions.value = data.data
}

const vendorId = ref(props.vendorId)
const selectedSubmission = ref<PSLRSubmission | null>(null)

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
  showViewDialog.value = true
}
</script>
