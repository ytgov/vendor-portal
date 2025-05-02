<template>
  <h3 class="mb-3">Administration Home</h3>

  <v-row>
    <v-col>
      <v-card>
        <v-list class="py-0">
          <v-list-item
            title="Manage Users"
            :to="{ name: 'administration/UsersPage' }"
            prepend-icon="mdi-account-group"
          />
          <v-divider />
          <v-list-item
            title="Manage Programs"
            :to="{ name: 'administration/ProgramsPage' }"
            prepend-icon="mdi-handshake"
          />
          <v-divider />
          <v-list-item
            title="Manage Paid Sick Leave Rebate"
            :to="{ name: 'administration/PSLRRequestsPage' }"
            prepend-icon="mdi-emoticon-sick-outline"
          />
        </v-list>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mb-5">
        <v-card-title>Pending Vendor Link Requests</v-card-title>

        <VendorLinkRequestsPending />
      </v-card>

      <v-card>
        <v-card-title>Pending Paid Sick Leave Applications</v-card-title>
        <v-list class="pt-0">
          <v-list-item
            class="pt-0"
            title="Ice Fog Analytics Inc."
            subtitle="Submitted December 18, 2024 (18 hours ago)"
            :to="{ name: 'administration/PSLRManageRequestDetailPage', params: { id: 12 } }"
          />
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorLinkRequestsPending from "@/components/vendor-link-requests/VendorLinkRequestsPending.vue"

useBreadcrumbs("Administration Dashboard", [])
</script>
