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

      <VendorUsersDataTableServer
        :filters="filters"
        @clicked="goToVendorLinkRequestPage"
      />
    </v-card-text>
  </v-card>

  <VendorUserDialog
    v-model="showDialog"
    :vendor-user-id="selectedItemId"
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorUsersDataTableServer from "@/components/vendor-users/VendorUsersDataTableServer.vue"
import VendorUserDialog from "@/components/vendor-users/VendorUserDialog.vue"

const router = useRouter()

const search = ref("")
const showDialog = ref(false)
const selectedItemId = ref<number | null>(null)

const filters = computed(() => ({
  search: search.value,
}))

function goToVendorLinkRequestPage(vendorLinkRequestId: number) {
  selectedItemId.value = vendorLinkRequestId
  showDialog.value = true
}

useBreadcrumbs("Manage Vendor Users", [
  { title: "Vendor Users", to: { name: "administration/VendorLinkRequestsManagePage" } },
])
</script>
