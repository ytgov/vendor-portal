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
