<template>
  <h1>Programs avialable in this portal</h1>

  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <PSLRProgramInfoCard />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import PSLRProgramInfoCard from "@/components/programs/ecdev-pslr/ProgramInfoCard.vue"
</script>
