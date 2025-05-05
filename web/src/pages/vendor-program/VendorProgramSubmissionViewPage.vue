<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="card"
  />
  <div v-if="vendor">
    <v-row>
      <v-col
        cols="12"
        md="7"
      >
        <v-card class="pb-2">
          <v-card-title>Employees</v-card-title>
          <v-list-item
            v-for="(employee, idx) of employees"
            :key="employee.id"
            class="mx-2"
            variant="outlined"
            :style="{ 'border-top': idx === 0 ? '1px black solid' : 'none' }"
            @click="openSubmission(employee.id)"
          >
            <div class="py-2">
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2">
                {{ employee.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ employee.hours }} Hours</v-list-item-subtitle>
              <p class="text-subtitle-2"></p>
            </div>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mb-5">
          <v-card-title>Status</v-card-title>

          <v-list>
            <div></div>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendor from "@/use/use-vendor"
import useProgram from "@/use/use-program"

const router = useRouter()

const props = defineProps<{ vendorId: string; programId: string; submissionId: string }>()
const vendorId = ref(props.vendorId)
const programIdNumber = computed(() => parseInt(props.programId))

const { vendor, isLoading } = useVendor(vendorId)
const { program } = useProgram(programIdNumber)

const employees = ref([
  {
    id: 1,
    date: "2023-11-02",
    name: "Bart Simpson",
    status: "In Process",
    hours: 1,
  },
  {
    id: 2,
    date: "2023-10-02",
    name: "Lisa Simpson",
    status: "Rejected",
    hours: 2,
  },
  {
    id: 3,
    date: "2023-09-02",
    name: "Homer Simpson",
    status: "Paid",
    hours: 3,
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
  if (vendor.value && program.value) {
    useBreadcrumbs("", [
      {
        title: `${vendor.value?.name}`,
        to: `/vendor/${vendor.value?.vendorId}`,
      },
      {
        title: `${program.value.name}`,
        to: `/vendor/${vendor.value?.vendorId}/programs/${program.value.id}`,
      },
    ])
  } else {
    useBreadcrumbs("", [{ title: "Loading...", to: "" }])
  }
}

function openSubmission(submissionId: number) {
  router.push({
    name: "vendor-program/SubmissionViewPage",
    params: {
      vendorId: props.vendorId,
      programId: props.programId,
      submissionId: submissionId,
    },
  })
}
</script>
