<template>
  <SimpleCard>
    <v-text-field
      v-model="search"
      label="Search"
    />
    <ProgramsDataTableServer
      :filters="filters"
      @clicked="goToProgramEdit"
    />
  </SimpleCard>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import { Program, ProgramFiltersOptions } from "@/use/use-programs"

import SimpleCard from "@/components/common/SimpleCard.vue"

import ProgramsDataTableServer from "@/components/programs/ProgramsDataTableServer.vue"

const search = ref("")

const searchFilter = computed<Pick<ProgramFiltersOptions, "search">>(() => {
  if (isEmpty(search.value)) {
    return {}
  }

  return {
    search: search.value,
  }
})

const filters = computed<ProgramFiltersOptions>(() => {
  return {
    ...searchFilter.value,
  }
})

const router = useRouter()

function goToProgramEdit(program: Program) {
  router.push({
    name: "administration/ProgramManagePage",
    params: { programId: program.id },
  })
}

useBreadcrumbs("Manage Programs", [
  {
    title: "Manage Programs",
    to: {
      name: "administration/ProgramsPage",
    },
  },
])
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
