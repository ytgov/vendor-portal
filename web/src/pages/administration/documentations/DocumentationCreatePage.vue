<template>
  <SimpleCard title="Create Documentation">
    <template #rightTitle>
      <v-btn
        :to="{ name: 'administration/DocumentationsPage' }"
        color="primary"
        variant="outlined"
        text="Back"
      />
    </template>
    <DocumentationCreateForm
      class="mt-5"
      @created="goToDocumenations"
    />
  </SimpleCard>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import SimpleCard from "@/components/common/SimpleCard.vue"

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
