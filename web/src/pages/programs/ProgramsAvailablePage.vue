<template>
  <div v-if="isEmpty(vendorUsers)">
    <p>No programs available</p>
  </div>
  <div
    v-for="(program, index) in programs"
    v-else
    :key="index"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <ProgramInfoCard
          :program-id="`${program.id}`"
          :show-apply="true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import usePrograms from "@/use/use-programs"
import useVendorUsers from "@/use/use-vendor-users"

import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

const { programs } = usePrograms()
const { vendorUsers } = useVendorUsers()

useBreadcrumbs("Available Programs", [
  {
    title: "Programs available in this portal ",
    to: {
      name: "programs/ProgramsAvailablePage",
    },
  },
])
</script>
