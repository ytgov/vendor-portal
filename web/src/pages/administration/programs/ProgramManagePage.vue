<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(program)"
    type="table"
  />

  <TabCard
    v-else
    :tabs="tabs"
  >
    <v-tabs-window-item :value="0">
      <v-card>
        <v-card-text>
          <h3 class="mb-5">Edit Program</h3>
          <ProgramEditForm :program-id="program.id" />
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item :value="1">
      <h3 class="mt-3 mb-3">Vendors in program</h3>
      <VendorProgramsDataTableServer
        :where="{ programId: programIdNumber, status: VendorProgramStatuses.ACCEPTED }"
        @click="goToVendorProgramPage"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="2">
      <h3 class="mt-3 mb-3">Vendors applying for program</h3>
      <VendorProgramsDataTableServer
        :where="{ programId: programIdNumber, status: VendorProgramStatuses.PENDING }"
        @click="goToVendorProgramRequestPage"
    /></v-tabs-window-item>
    <v-tabs-window-item :value="3">
      <h3 class="mb-3">Documentations</h3>
      <DocumentationsDataTableServer :filters="{ inProgram: programIdNumber }" />
    </v-tabs-window-item>
  </TabCard>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import { VendorProgram, VendorProgramStatuses } from "@/api/vendor-programs-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"

import TabCard from "@/components/common/TabCard.vue"

import ProgramEditForm from "@/components/programs/ProgramEditForm.vue"
import DocumentationsDataTableServer from "@/components/documentations/DocumentationsDataTableServer.vue"
import VendorProgramsDataTableServer from "@/components/vendor-programs/VendorProgramsDataTableServer.vue"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))
const { program, isLoading } = useProgram(programIdNumber)

const router = useRouter()

function goToVendorProgramRequestPage(vendorProgram: VendorProgram) {
  router.push({
    name: "administration/VendorProgramRequestPage",
    params: {
      programId: programIdNumber.value,
      vendorId: vendorProgram.vendorId,
      vendorProgramId: vendorProgram.id,
    },
  })
}

function goToVendorProgramPage(vendorProgram: VendorProgram) {
  router.push({
    name: "administration/VendorProgramPage",
    params: {
      programId: programIdNumber.value,
      vendorId: vendorProgram.vendorId,
    },
  })
}

const tabs = ref([
  { value: 0, title: "Edit Program", icon: "mdi-folder-question" },
  { value: 1, title: "Vendors In Program", icon: "mdi-folder-question" },
  { value: 2, title: "Vendors Applying", icon: "mdi-folder-question" },
  { value: 3, title: "Documentations", icon: "mdi-folder-question" },
])

const pageTitle = computed(() => {
  if (isNil(program.value)) {
    return "Loading..."
  }

  return `Manage ${program.value.name} Program`
})

const breadcrumbs = computed(() => {
  if (isNil(program.value)) {
    return [
      {
        title: "Programs",
        to: {
          name: "administration/ProgramsPage",
        },
      },
      { title: "Loading...", to: "" },
    ]
  }

  return [
    {
      title: "Programs",
      to: {
        name: "administration/ProgramsPage",
      },
    },
    {
      title: `Manage ${program.value.name}`,
      to: "",
    },
  ]
})

useBreadcrumbs(pageTitle, breadcrumbs)
</script>
