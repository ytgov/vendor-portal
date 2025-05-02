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
      <ProgramDocumentationsDataTableServer :where="{ programId: programIdNumber }" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"

import ProgramDocumentationsDataTableServer from "@/components/program-documentations/ProgramDocumentationsDataTableServer.vue"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))
const { program, isLoading } = useProgram(programIdNumber)

useBreadcrumbs("Manage Programs", [ADMIN_CRUMB])
</script>
