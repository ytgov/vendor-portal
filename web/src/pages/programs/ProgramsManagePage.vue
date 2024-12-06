<template>
  <v-card>
    <v-card-text>
      <div>
        <v-text-field label="Search" />
      </div>
      <v-data-table :headers="headers"></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

useBreadcrumbs("Manage Programs", [ADMIN_CRUMB])

const headers = ref([
  { text: "Name", value: "name" },
  { text: "Description", value: "description" },
  { text: "Actions", value: "actions" },
])
</script>
