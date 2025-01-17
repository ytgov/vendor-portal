<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <div v-if="vendor">
    <v-row>
      <v-col
        cols="12"
        md="5"
      >
        <v-card>
          <v-card-title>Paid Sick Leave Rebate</v-card-title>
          <v-card-text>
            <p class="mb-3">
              The Paid Sick Leave Rebate provides up to 40 hours of wages for eligible workers who
              are sick with illness (or injury not covered by any other act, benefit or program).
            </p>
            <p class="mb-3">
              This program helps Yukoners prioritize their health and reduce the spread of illness
              in the workplace.
            </p>
            <p class="mb-3">
              For more information, visit
              <a
                href="https://yukon.ca/en/health-and-wellness/covid-19-information/economic-and-social-supports-covid-19/paid-sick-leave"
                target="_blank"
                >Yukon.ca</a
              >.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <h3 class="mb-3">Previous Submissions</h3>
        <v-select
          v-model="viewBy"
          label="View by"
          density="compact"
          bg-color="white"
          :items="['Date', 'Employee']"
        />
        <div v-if="viewBy == 'Date'">
          <v-card
            v-for="program of submissions"
            :key="program.id"
            class="mb-5"
            @click="openSubmission(program.id)"
          >
            <v-card-title>{{ program.name }}</v-card-title>

            <v-card-text>
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2"> </v-list-item-title>
              <v-list-item-subtitle>{{ program.employeeCount }} Employees</v-list-item-subtitle>
              <p class="text-subtitle-2"></p>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <v-card
            v-for="program of employees"
            :key="program.id"
            class="mb-5"
            @click="openSubmission(program.id)"
          >
            <v-card-title>{{ program.name }}</v-card-title>

            <v-card-text>
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2"> </v-list-item-title>
              <v-list-item-subtitle>{{ program.employeeCount }} Claims</v-list-item-subtitle>
              <p class="text-subtitle-2"></p>
            </v-card-text>
          </v-card>
        </div>

        <v-card class="d-none">
          <v-card-title>Previous Payments</v-card-title>
          <v-card-text>List goes here</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import useVendor from "@/use/use-vendor"
import { isArray } from "lodash"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

const route = useRoute()
const router = useRouter()

const viewBy = ref("Date")

const vendorId = computed(() =>
  isArray(route.params.vendorId) ? route.params.vendorId[0] : route.params.vendorId
)

const { vendor, isLoading } = useVendor(vendorId)

const submissions = ref([
  {
    id: 1,
    date: "2023-11-02",
    name: "Submitted on November 2, 2023",
    status: "In Process",
    employeeCount: 1,
  },
  {
    id: 2,
    date: "2023-10-02",
    name: "Submitted on October 3, 2023",
    status: "Rejected",
    employeeCount: 2,
  },
  {
    id: 3,
    date: "2023-09-02",
    name: "Submitted on September 1, 2023",
    status: "Paid",
    employeeCount: 3,
  },
  {
    id: 4,
    date: "2023-08-02",
    name: "Submitted on August 5, 2023",
    status: "Paid",
    employeeCount: 2,
  },
])

const employees = ref([
  {
    id: 1,
    date: "2023-11-02",
    name: "Bart Simpson",
    status: "In Process",
    employeeCount: 1,
  },
  {
    id: 2,
    date: "2023-10-02",
    name: "Lisa Simpson",
    status: "Rejected",
    employeeCount: 2,
  },
  {
    id: 3,
    date: "2023-09-02",
    name: "Homer Simpson",
    status: "Paid",
    employeeCount: 3,
  },
])

watch(
  () => vendor.value,
  (newVal) => {
    if (newVal && newVal.id) setBreadcrumbs()
  }
)
setBreadcrumbs()

function setBreadcrumbs() {
  if (vendor.value) {
    useBreadcrumbs(`${vendor.value.name}: PSLR`, [
      BASE_CRUMB,
      {
        title: `${vendor.value.name}`,
        to: `/vendor/${vendor.value.vendorId}`,
      },
    ])
  } else {
    useBreadcrumbs("", [{ title: "Loading...", to: "" }])
  }
}
function openSubmission(submissionId: number) {
  console.log(submissionId)
  router.push(`/vendor/${vendorId.value}/programs/EcDev-PSLR/submissions/${submissionId}`)
}
</script>
