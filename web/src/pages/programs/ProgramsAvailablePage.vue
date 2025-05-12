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
          :program-id="`${program.id}`"
          :show-apply="true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import useBreadcrumbs from "@/use/use-breadcrumbs"
import usePrograms from "@/use/use-programs"

import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

const { programs } = usePrograms()

useBreadcrumbs("Available Programs", [
  { title: "Programs available in this portal ", to: "/programs" },
])
</script>
