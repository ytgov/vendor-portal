<template>
  <v-card>
    <v-card-title class="d-flex flex-md-row">
      Create Documentation
      <v-spacer />
      <v-btn
        :to="{ name: 'administration/DocumentationsPage' }"
        color="primary"
        variant="outlined"
        text="Back"
      />
    </v-card-title>
    <v-card-text>
      <DocumentationCreateForm class="mt-10" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import DocumentationCreateForm from "@/components/documentations/DocumentationCreateForm.vue"
</script>
