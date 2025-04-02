<template>
  <v-card>
    <v-stepper
      v-model="step"
      :items="['Welcome', 'Vendor Information', 'Request Link']"
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
            <p class="text-body-1 mb-4">
              Please enter as much information as you know about the vendor you are trying to link.
              If you know the existing Vendor ID, please enter it below and hit search.
            </p>
            <p class="mb-4">YCOR number or Existing Vendor ID is required.</p>
            <v-row class="mt-2">
              <v-col>
                <v-text-field
                  v-model="businessName"
                  label="Business name (required)"
                  required
                />
                <v-text-field
                  v-model="ycorNumber"
                  class="mb-4"
                  label="YCOR number"
                  hint="Six digit Yukon Corporate Online Registry number"
                  persistent-hint
                />

                <v-textarea
                  v-model="address"
                  label="Address"
                  rows="3"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="operatingName"
                  label="Operating as"
                />
                <div class="d-flex">
                  <v-text-field
                    v-model="vendorId"
                    class="mb-4 mr-5"
                    label="Existing vendor ID"
                    hint="Assigned by Department of Finance, found on remittances"
                    persistent-hint
                    @update:model-value="clearMatch"
                  />
                  <v-btn
                    class="mb-5"
                    prepend-icon="mdi-magnify"
                    :disabled="!canSearch"
                    style="height: 48px"
                    @click="doSearch"
                    >Search</v-btn
                  >
                </div>

                <div class="d-flex">
                  <div
                    v-if="error"
                    class="text-subtitle-1 text-error"
                    style="line-height: 36px"
                  >
                    <v-icon>mdi-alert-circle</v-icon>
                    {{ error }}
                  </div>
                </div>
                <div v-if="matchedVendor">
                  <VendorMatchCard :vendor="matchedVendor" />
                </div>
              </v-col>
            </v-row>

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
                :disabled="!canContinue"
                @click="step = 3"
                >Continue</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </template>

      <template #item.3>
        <v-card>
          <v-card-title>Request Link</v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <p class="text-body-1 mb-4">
                  This new link request will be reviewed by our staff before it is finalized. We may
                  require additional information from you to prove your connection to this vendor.
                  If that is the case, we will email you at
                  <strong>{{ currentUser?.email }}</strong> with an questions.
                </p>
                <p class="text-subtitle-1">
                  This process will take no longer than 48 hours and you will be notified by email
                  once it is completed.
                </p>
              </v-col>
              <v-col v-if="matchedVendor">
                <VendorMatchCard :vendor="matchedVendor" />
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
                @click="doLink"
                >Submit Request</v-btn
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
import useCurrentUser from "@/use/use-current-user"

const router = useRouter()
const snack = useSnack()
const { currentUser } = useCurrentUser()
useBreadcrumbs("Link to Vendor", [BASE_CRUMB])

const step = ref(1)

const ycorNumber = ref("")
const vendorId = ref("")
const businessName = ref("")
const operatingName = ref("")
const address = ref("")

const error = ref("")

const matchedVendor = ref<Vendor | null>(null)

const canSearch = computed(() => {
  if (isEmpty(vendorId.value)) {
    return false
  }

  return true
})
const canContinue = computed(() => {
  if (isEmpty(vendorId.value) && isEmpty(ycorNumber.value)) {
    return false
  }

  if (isEmpty(businessName.value) && isEmpty(operatingName.value)) {
    return false
  }

  return true
})

function clearMatch() {
  matchedVendor.value = null
  error.value = ""
}

function doSearch() {
  if (vendorId.value === "CDICEFOGANAL") {
    matchedVendor.value = {
      id: 123,
      slug: "",
      status: "",
      org: "",
      vendorId: "CDICEFOGANAL",
      name: "Ice Fog Analytics Inc.",
      shortName: "",
      isActive: true,
      isPerson: true,
      isPayable: true,
      isElectronicPay: true,
      addressLine1: "",
      addressLine2: "",
      addressProvince: "",
      addressPostal: "",
      createdAt: "",
      updatedAt: "",
      programs: [],
    }
    error.value = ""
  } else {
    matchedVendor.value = null
    error.value = "No match was found for that Vendor ID"
  }
}

function doLink() {
  snack.success("Request Submitted")
  router.push({ name: "individual/HomePage" })
}
</script>
