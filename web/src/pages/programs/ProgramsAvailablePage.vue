<template>
  <div
    v-for="(program, index) in programs"
    :key="index"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <ProgramInfoCard
          :program-slug="program.slug"
          :show-apply="canApply"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import usePrograms from "@/use/use-programs"
import useVendorUsers from "@/use/use-vendor-users"

import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

const { programs } = usePrograms()
const { totalCount, isLoading } = useVendorUsers()

const canApply = computed(() => {
  if (isLoading.value) return false
  return totalCount.value !== 0
})

useBreadcrumbs("Available Programs", [
  {
    title: "Programs available in this portal ",
    to: {
      name: "programs/ProgramsAvailablePage",
    },
  },
])
</script>
