<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
          density="compact"
        />
      </div>

      <VendorLinkRequestsDataTableServer :filters="filters" class="not-clickable" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorLinkRequestsDataTableServer from "@/components/vendor-link-requests/VendorLinkRequestsDataTableServer.vue"

const search = ref("")

const filters = computed(() => ({
  search: search.value,
}))

useBreadcrumbs("My Vendor Link Requests", [
  { title: "Vendor Link Requests", to: { name: "VendorLinkRequestsPage" } },
])
</script>
