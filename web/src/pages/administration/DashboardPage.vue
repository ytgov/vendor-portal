<template>
  <v-row>
    <v-col>
      <SimpleCard title="Administration Links">
        <v-list class="py-0">
          <v-list-item
            title="Manage Users"
            :to="{ name: 'administration/UsersPage' }"
            prepend-icon="mdi-account"
          />
          <v-divider />
          <v-list-item
            title="Manage Vendor Link Requests"
            :to="{ name: 'administration/VendorLinkRequestsManagePage' }"
            prepend-icon="mdi-link"
          />
          <v-divider />

          <v-list-item
            title="Manage Vendor Users"
            :to="{ name: 'administration/VendorUsersManagePage' }"
            prepend-icon="mdi-link"
          />
          <v-divider />

          <v-list-item
            title="Manage Programs"
            :to="{ name: 'administration/ProgramsPage' }"
            prepend-icon="mdi-handshake"
          />
          <v-divider />

          <v-list-item
            title="Manage Program Applications"
            :to="{ name: 'administration/VendorProgramsManagePage' }"
            prepend-icon="mdi-handshake"
          />
          <v-divider />

          <v-list-item
            title="Manage Documentation"
            :to="{ name: 'administration/DocumentationsPage' }"
            prepend-icon="mdi-file-sign"
          />
        </v-list>
      </SimpleCard>
    </v-col>
    <v-col>
      <SimpleCard title="Pending Vendor Link Requests">
        <VendorLinkRequestsPendingList class="mb-4" />

        <router-link
          text="View all"
          :to="{ name: 'administration/VendorLinkRequestsManagePage' }"
        />
      </SimpleCard>

      <SimpleCard title="Pending Program Applications">
        <VendorProgramsPendingList class="mb-4" />
        <router-link
          text="View all"
          :to="{ name: 'administration/VendorProgramsManagePage' }"
        />
      </SimpleCard>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

import SimpleCard from "@/components/common/SimpleCard.vue"
import VendorLinkRequestsPendingList from "@/components/vendor-link-requests/VendorLinkRequestsPendingList.vue"
import VendorProgramsPendingList from "@/components/vendor-programs/VendorProgramsPendingList.vue"

useBreadcrumbs("Administration Dashboard")
</script>
