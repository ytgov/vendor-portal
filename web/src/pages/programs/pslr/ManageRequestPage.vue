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
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
useBreadcrumbs("PSLR Application Requests", [ADMIN_CRUMB])

const requests = ref([
  { id: 14, vendor_id: "Ice Fog Analytics Inc.", date: "December 19, 2024 (18 hours ago)", status: "Pending" },
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
</script>
