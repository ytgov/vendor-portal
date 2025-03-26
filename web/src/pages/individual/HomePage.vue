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
      <h3 class="mb-3">Linked Vendor Accounts</h3>

      <v-alert
        type="info"
        color="success"
        class="mb-5 white-text"
        title="Pending Link Request"
        >We are still processing a request to link "CDHOTDOGSTAND" to your account, submitted on
        Monday, November 21, 2024.
      </v-alert>

      <VendorLinkCard vendor-id="CDICEFOGANAL" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AccountDetailsCard from "@/components/individual/AccountDetailsCard.vue"
import VendorLinkCard from "@/components/vendor/VendorLinkCard.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Vendor Portal Home", [])
</script>

<style>
.white-text .v-alert__content,
.white-text .v-alert__prepend,
.white-text .v-alert-title {
  color: white !important;
}
</style>
