<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <PSLRProgramInfoCard :show-apply="true" />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import PSLRProgramInfoCard from "@/components/programs/ecdev-pslr/ProgramInfoCard.vue"
import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"

useBreadcrumbs("Programs available in this portal ", [BASE_CRUMB])
</script>
