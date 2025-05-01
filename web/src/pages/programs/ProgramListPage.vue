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
        <PSLRProgramInfoCard
          :program-id="`${program.id}`"
          :show-apply="true"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import PSLRProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import usePrograms from "@/use/use-programs"

const { programs } = usePrograms()

useBreadcrumbs("", [{ title: "Programs available in this portal ", to: "/programs" }])
</script>
