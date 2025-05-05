<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(program)"
    type="table"
  />
  <v-card v-else>
    <v-card-title class="d-flex flex-md-row">
      {{ program.name }}
      <v-spacer />
      <v-btn
        :to="{ name: 'administration/ProgramsPage' }"
        color="primary"
        variant="outlined"
        text="Back"
      />
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-card>
            <v-card-text>
              <h3 class="mb-5">Edit Program</h3>
              <ProgramEditForm :program-id="program.id" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3 class="mt-3 mb-3">Vendors in program</h3>
          <VendorProgramsDataTableServer
            :where="{ programId: programIdNumber, status: VendorProgramStatuses.ACCEPTED }"
            @click="goToVendorProgramPage"
          />
        </v-col>
        <v-col>
          <h3 class="mt-3 mb-3">Vendors applying for program</h3>
          <VendorProgramsDataTableServer
            :where="{ programId: programIdNumber, status: VendorProgramStatuses.PENDING }"
            @click="goToVendorProgramRequestPage"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3 class="mb-3">Documentations</h3>
          <DocumentationsDataTableServer :filters="{ inProgram: programIdNumber }" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"
import { useRouter } from "vue-router"

import { VendorProgram, VendorProgramStatuses } from "@/api/vendor-programs-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"

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

useBreadcrumbs("Manage Program", breadcrumbs)
</script>
