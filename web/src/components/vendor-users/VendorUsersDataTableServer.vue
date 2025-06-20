<template>
  <v-data-table-server
    v-model:items-per-page="perPage"
    :page="page"
    :headers="headers"
    :items="vendorUsers"
    :items-length="totalCount"
    :loading="isLoading"
    style="border: 1px #ccc solid; border-radius: 3px"
    @click:row="rowClicked"
  >
    <template #item.decisionAt="{ value }">
      {{ formatDate(value) }}
    </template>
    <template
      v-for="(_, name) in $slots"
      :key="name"
      #[name]="slotProps"
    >
      <slot
        :name="name"
        v-bind="slotProps"
      ></slot>
    </template>
  </v-data-table-server>
</template>

<script lang="ts">
export const defaultHeaders = [
  { title: "User", key: "user.displayName" },
  { title: "Vendor", key: "vendor.name" },
  { title: "Connected at", key: "decisionAt" },
]
</script>

<script setup lang="ts">
import { computed } from "vue"

import { formatDate } from "@/utils/formatters"

import useRouteQueryPagination from "@/use/utils/use-route-query-pagination"
import useVendorUsers, {
  VendorUser,
  VendorUserFiltersOptions,
  VendorUserQueryOptions,
  VendorUserWhereOptions,
} from "@/use/use-vendor-users"

const props = withDefaults(
  defineProps<{
    headers?: { title: string; key: string }[]
    filters?: VendorUserFiltersOptions
    where?: VendorUserWhereOptions
    waiting?: boolean
  }>(),
  {
    headers: () => defaultHeaders,
    filters: () => ({}),
    where: () => ({}),
    waiting: false,
  }
)

const { page, perPage } = useRouteQueryPagination({
  routeQuerySuffix: "VendorUsers",
})

const vendorUsersQuery = computed<VendorUserQueryOptions>(() => {
  return {
    where: props.where,
    filters: props.filters,
    perPage: perPage.value,
    page: page.value,
  }
})

const { vendorUsers, totalCount, isLoading, refresh } = useVendorUsers(vendorUsersQuery, {
  skipWatchIf: () => props.waiting,
})

type VendorUserTableRow = {
  item: VendorUser
}

const emit = defineEmits<{ clicked: [vendorUserId: number] }>()

function rowClicked(_event: unknown, row: VendorUserTableRow) {
  const vendorUserId = row.item.id
  emit("clicked", vendorUserId)
}

defineExpose({ refresh })
</script>

<style>
.v-data-table__tr:hover {
  background-color: #eeeeee !important;
}
</style>
