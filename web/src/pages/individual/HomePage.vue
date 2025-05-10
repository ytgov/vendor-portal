<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <h3 class="mb-3 d-none">Personal Details</h3>
      <AccountDetailsCard />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
      <VendorLinkRequestAlerts />
      <h3 class="mb-3">Linked Vendor Accounts</h3>
      <VendorsLinkedCard />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import useBreadcrumbs from "@/use/use-breadcrumbs"

import AccountDetailsCard from "@/components/individual/AccountDetailsCard.vue"
import VendorsLinkedCard from "@/components/vendors/VendorsLinkedCard.vue"
import VendorLinkRequestAlerts from "@/components/vendor-link-requests/VendorLinkRequestAlerts.vue"

useBreadcrumbs("Vendor Portal Home")
</script>

<style>
.white-text .v-alert__content,
.white-text .v-alert__prepend,
.white-text .v-alert-title {
  color: white !important;
}
</style>
