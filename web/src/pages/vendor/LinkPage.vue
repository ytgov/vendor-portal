<template>
  <v-card>
    <v-stepper
      v-model="step"
      :items="['Welcome', 'Vendor Information', 'Add Link']"
      color="primary"
      elevation="0"
      hide-actions
    >
      <template #item.1>
        <v-card>
          <v-card-title>Welcome</v-card-title>
          <v-card-text>
            <p class="mb-4 text-h6">
              This wizard will guide you through the process of linking your personal account to an
              existing vendor record.
            </p>
            <p class="mb-2 text-body-1">
              This is not the procedure to create a new vendor record. To do that, please contact
              our office.
            </p>
            <v-divider class="mb-2" />
            <p class="mb-2 text-body-1 font-weight-bold">
              If you run into any issues, please contact us for assistance.
            </p>
            <div class="d-flex">
              <v-spacer />
              <v-btn
                append-icon="mdi-chevron-right"
                @click="step = 2"
                >Continue</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template #item.2>
        <v-card>
          <v-card-title>Vendor Information</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="vendorId"
                  label="Vendor ID"
                />
                <v-text-field
                  v-model="vendorName"
                  label="Name"
                />
                <v-text-field
                  v-model="vendorPostal"
                  label="Postal Code"
                />
              </v-col>
              <v-col>
                <div v-if="matchedVendor">
                  <VendorMatchCard :vendor="matchedVendor" />
                  <p class="mt-5">
                    If this match is correct, please click the "Continue" button below.
                  </p>
                </div>
              </v-col>
            </v-row>

            <div class="d-flex">
              <v-btn
                class="mb-5"
                :disabled="!canSearch"
                @click="doSearch"
                >Search</v-btn
              >
              <div
                v-if="error"
                class="ml-5 text-error"
                style="line-height: 36px"
              >
                <v-icon>mdi-alert-circle</v-icon>
                {{ error }}
              </div>
            </div>

            <div class="d-flex">
              <v-btn
                color="warning"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                @click="step = 1"
                >Previous</v-btn
              >
              <v-spacer />
              <v-btn
                append-icon="mdi-chevron-right"
                :disabled="!hasLink"
                @click="step = 3"
                >Continue</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template #item.3>
        <v-card>
          <v-card-title>Add Link</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="text-subtitle-1">
                  This new link will be reviewed by our staff before it is finalized. We may require
                  additional information from you to prove your connection to this vendor.
                </p>
              </v-col>
              <v-col>
                <VendorMatchCard
                  v-if="matchedVendor"
                  :vendor="matchedVendor"
                />
              </v-col>
            </v-row>

            <div class="d-flex mt-5">
              <v-btn
                color="warning"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                @click="step = 2"
                >Previous</v-btn
              >
              <v-spacer />
              <v-btn
                append-icon="mdi-check"
                :disabled="!hasLink"
                @click="doLink"
                >Complete Link</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isEmpty } from "lodash"
import { useRouter } from "vue-router"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import VendorMatchCard from "@/components/vendor/VendorMatchCard.vue"
import { Vendor } from "@/api/vendors-api"
import useSnack from "@/use/use-snack"

const router = useRouter()
const snack = useSnack()
useBreadcrumbs("Link to Vendor", [BASE_CRUMB])

const step = ref(1)

const vendorId = ref("")
const vendorName = ref("")
const vendorPostal = ref("")

const hasLink = ref(false)
const error = ref("")

const matchedVendor = ref<Vendor | null>(null)

const canSearch = computed(() => {
  return !isEmpty(vendorId.value) && !isEmpty(vendorName.value) && !isEmpty(vendorPostal.value)
})

function doSearch() {
  if (vendorId.value === "CDICEFOGANAL") {
    matchedVendor.value = {
      id: 123,
      vendorId: "CDICEFOGANAL",
      name: "Ice Fog Analytics Inc.",
      address: "",
      createdAt: "",
      updatedAt: "",
      programs: [],
    }
    hasLink.value = true
    error.value = ""
  } else {
    matchedVendor.value = null
    hasLink.value = false
    error.value = "No match was found"
  }
}
function doLink() {
  snack.success("Link created")
  router.push({ name: "individual/HomePage" })
}
</script>
