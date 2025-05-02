<template>
  <v-card>
    <v-data-table
      :items="requests"
      :headers="headers"
      @click:row="openRequest"
    ></v-data-table>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

const router = useRouter()

const requests = ref([
  {
    id: 14,
    vendor_id: "Ice Fog Analytics Inc.",
    date: "December 19, 2024 (18 hours ago)",
    status: "Pending",
  },
])

const headers = [
  {
    title: "Vendor",
    value: "vendor_id",
  },
  {
    title: "Date",
    value: "date",
  },
  {
    title: "Status",
    value: "status",
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function openRequest(_event: any, item: any) {
  console.log(item)
  router.push({ name: "administration/PSLRManageRequestDetailPage", params: { id: item.item.id } })
}

useBreadcrumbs("PSLR Application Requests", [])
</script>
