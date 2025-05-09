<template>
  <v-row>
    <v-col>
      <SimpleCard title="Administration Links">
        <v-list class="py-0">
          <v-list-item
            title="Manage Users"
            :to="{ name: 'administration/UsersPage' }"
            prepend-icon="mdi-account-group"
          />
          <v-divider />
          <v-list-item
            title="Manage Vendor Link Requests"
            :to="{ name: 'administration/VendorLinkRequestsManagePage' }"
            prepend-icon="mdi-handshake"
          />
          <v-divider />
          <v-list-item
            title="Manage Programs"
            :to="{ name: 'administration/ProgramsPage' }"
            prepend-icon="mdi-handshake"
          />
          <v-divider />
          <v-list-item
            title="Manage Documentation"
            :to="{ name: 'administration/DocumentationsPage' }"
            prepend-icon="mdi-handshake"
          />
        </v-list>
      </SimpleCard>
    </v-col>
    <v-col>
      <SimpleCard title="Pending Vendor Link Requests">
        <VendorLinkRequestsPending />
      </SimpleCard>

      <SimpleCard title="Pending Program Applications"> Coming... </SimpleCard>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import VendorLinkRequestsPending from "@/components/vendor-link-requests/VendorLinkRequestsPending.vue"
import SimpleCard from "@/components/common/SimpleCard.vue"

useBreadcrumbs("Administration Dashboard")
</script>
