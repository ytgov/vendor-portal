<template>
  <v-skeleton-loader
    v-if="isVendorLoading"
    type="card"
  />
  <div v-if="vendor">
    <v-row>
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
            v-for="submission of submissions"
            :key="submission.id"
            class="mb-5"
            @click="openSubmission(submission.id)"
          >
            <v-card-title>{{ submission.name }}</v-card-title>

            <v-card-text>
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2"> </v-list-item-title>
              <v-list-item-subtitle>{{ submission.employeeCount }} Employees</v-list-item-subtitle>
              <p class="text-subtitle-2"></p>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <v-card
            v-for="employee of employees"
            :key="employee.id"
            class="mb-5"
            @click="openSubmission(employee.id)"
          >
            <v-card-title>{{ employee.name }} (Birth date)</v-card-title>

            <v-card-text>
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2"> </v-list-item-title>
              <v-list-item-subtitle>{{ employee.employeeCount }} Claims</v-list-item-subtitle>
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
import { computed, onMounted, ref, watch } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"

const props = defineProps<{ vendorId: string; programId: string }>()
const vendorId = ref(props.vendorId)
const programIdNumber = computed(() => parseInt(props.programId))

const { vendor, isLoading: isVendorLoading } = useVendor(vendorId)
const { program } = useProgram(programIdNumber)

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

function openSubmission(submissionId: number) {
  // _TODO_
  console.log("opening submission ", submissionId)
}

const breadcrumbs = computed(() => {
  const baseCrumbs = [
    {
      title: "Programs",
      to: { name: "administration/ProgramsPage" },
    },
  ]

  if (vendor.value && program.value) {
    return [
      ...baseCrumbs,
      {
        title: `Manage ${program.value.name}`,
        to: {
          name: "administration/ProgramManagePage",
          params: {
            programId: program.value.id,
          },
        },
      },
      {
        title: vendor.value.name,
        to: "",
      },
    ]
  }

  return [...baseCrumbs, { title: "Loading...", to: "" }]
})

useBreadcrumbs("", breadcrumbs)
</script>
