<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(program)"
    type="table"
  />
  <v-card v-else>
    <v-card-title class="d-flex flex-md-row">
      {{ program?.name }}
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
          <h3 class="mt-3 mb-3">Vendors in program</h3>
          <VendorProgramsDataTableServer
            :where="{ programId: programIdNumber, status: VendorProgramStatuses.ACCEPTED }"
          />
        </v-col>
        <v-col>
          <h3 class="mt-3 mb-3">Vendors applying for program</h3>
          <VendorProgramsDataTableServer
            :where="{ programId: programIdNumber, status: VendorProgramStatuses.PENDING }"
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

import { VendorProgramStatuses } from "@/api/vendor-programs-api"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"

import DocumentationsDataTableServer from "@/components/documentations/DocumentationsDataTableServer.vue"
import VendorProgramsDataTableServer from "@/components/vendor-programs/VendorProgramsDataTableServer.vue"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))
const { program, isLoading } = useProgram(programIdNumber)

useBreadcrumbs("Manage Program", [])
</script>
