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
            v-for="(program, idx) of employees"
            :key="program.id"
            class="mx-2"
            variant="outlined"
            :style="{ 'border-top': idx === 0 ? '1px black solid' : 'none' }"
            @click="openSubmission(program.id)"
          >
            <div class="py-2">
              <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2">
                {{ program.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ program.hours }} Hours</v-list-item-subtitle>
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
import useVendor from "@/use/use-vendor"
import { isArray } from "lodash"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

const route = useRoute()
const router = useRouter()

const vendorId = computed(() =>
  isArray(route.params.vendorId) ? route.params.vendorId[0] : route.params.vendorId
)

const { vendor, isLoading } = useVendor(vendorId)

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
  if (vendor.value) {
    useBreadcrumbs("", [
      BASE_CRUMB,
      {
        title: `${vendor.value?.name}`,
        to: `/vendor/${vendor.value?.vendorId}`,
      },
      {
        title: `Paid Sick Leave Rebate`,
        to: `/vendor/${vendor.value?.vendorId}/programs/EcDev-PSLR`,
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
