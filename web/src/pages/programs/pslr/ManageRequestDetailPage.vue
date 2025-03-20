<template>
  <v-row>
    <v-col
      cols="12"
      md="6"
    >
      <v-card class="mb-5">
        <v-card-title>Ice Fog Analytics Inc.</v-card-title>
        <v-card-text>
          <p class="mb-2">Submitted on: <strong>December 19, 2024 (18 hours ago)</strong></p>
          <p class="mb-2">By: <strong>Michael Johnson</strong> (michael@icefoganalytics.com)</p>

          <p class="mb-5">
            <a href="mailto:michael@icefoganalytics.com">
              <v-icon class="mr-2">mdi-email</v-icon>Send Michael Johnson an email</a
            >
          </p>

          <div
            class="d-flex"
            style="width: 100%"
          >
            <v-btn color="success">Confirm</v-btn>
            <v-spacer />

            <v-btn color="warning">Reject</v-btn>
          </div>
        </v-card-text>
      </v-card>

      <VendorPeopleCard
        :vendor="{
          name: 'Ice Fog Analytics Inc.',
          vendorId: 'CDICEFOGANAL',
          id: 1,
          address: '',
          createdAt: '',
          updatedAt: '',
          programs: [],
        }"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <h3 class="mb-3">Attachments</h3>

      <v-card class="mb-5">
        <v-card-title>YCOR Certificate</v-card-title>
        <v-card-text>
          <p class="mb-2">File name: <strong>Downloaded Cert.pdf</strong></p>
          <p class="mb-5">Expires on: <strong>December 31, 2025</strong></p>
          <v-btn
            class="mr-5"
            size="small"
            >View</v-btn
          >
          <v-btn size="small">Download</v-btn>
        </v-card-text>
      </v-card>

      <v-card class="mb-5">
        <v-card-title>Business license</v-card-title>
        <v-card-text>
          <p class="mb-2">File name: <strong>Business_Lic.pdf</strong></p>
          <p class="mb-5">Expires on: <strong>December 31, 2025</strong></p>
          <v-btn
            class="mr-5"
            size="small"
            >View</v-btn
          >
          <v-btn size="small">Download</v-btn>
        </v-card-text>
      </v-card>

      <v-card class="mb-5">
        <v-card-title>Paid sick leave policy</v-card-title>
        <v-card-text>
          <p class="mb-2">File name: <strong>Policy.docx</strong></p>
          <p class="mb-5">Expires on: <strong>December 31, 2025</strong></p>
          <v-btn
            class="mr-5"
            size="small"
            >View</v-btn
          >
          <v-btn size="small">Download</v-btn>
        </v-card-text>
      </v-card>
      <v-card class="mb-5">
        <v-card-title>CRA remittance</v-card-title>
        <v-card-text> Not Submitted </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import VendorPeopleCard from "@/components/vendor/VendorPeopleCard.vue"
import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

useBreadcrumbs("PSLR Application Request", [
  ADMIN_CRUMB,
  { title: "PSLR Application Requests", to: { name: "administration/PSLRRequestsPage" } },
])
</script>
