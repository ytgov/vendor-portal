<template>
  <v-autocomplete
    :items="employees"
    :item-title="makeTitle"
    label="Select Employee"
  >
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <v-list-item-subtitle>
          {{ item.raw.email }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref } from "vue"

import httpClient from "@/api/http-client"

const props = defineProps<{ vendorId: string }>()

export type PSLREmployee = {
  id: string
  email: string
  first_name: string
  last_name: string
  birth_date: string
}

const employees = ref<PSLREmployee[]>([])

async function loadEmployees() {
  const { data } = await httpClient.get(`/api/program/pslr/${props.vendorId}/employees`)
  employees.value = data.data
}

loadEmployees()

function makeTitle(item: PSLREmployee) {
  console.log("Item:", item)
  return `${item.first_name} ${item.last_name} (${item.birth_date})`
}
</script>
