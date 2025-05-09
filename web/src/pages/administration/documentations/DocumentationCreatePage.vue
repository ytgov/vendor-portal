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
      <DocumentationCreateForm
        class="mt-10"
        @created="goToDocumenations"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import DocumentationCreateForm from "@/components/documentations/DocumentationCreateForm.vue"

const router = useRouter()

function goToDocumenations() {
  router.push({
    name: "administration/DocumentationsPage",
  })
}

useBreadcrumbs("Create Documentation", [
  {
    title: "Documentations",
    to: {
      name: "administration/DocumentationsPage",
    },
  },
  {
    title: "Create Documentation",
    to: {
      name: "administration/DocumentationCreatePage",
    },
  },
])
</script>
