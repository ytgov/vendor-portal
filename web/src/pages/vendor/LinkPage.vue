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
                text="Continue"
                @click="step = 2"
              />
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
                  v-model="vendorLinkRequest.businessName"
                  label="Business name (required)"
                  required
                />
                <v-text-field
                  v-model="vendorLinkRequest.ycorNumber"
                  class="mb-4"
                  label="YCOR number (required)"
                  hint="Six digit Yukon Corporate Online Registry number"
                  persistent-hint
                  required
                />

                <v-textarea
                  v-model="vendorLinkRequest.address"
                  label="Address (required)"
                  required
                  rows="3"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="vendorLinkRequest.operatingName"
                  label="Operating as"
                />
                <div class="d-flex">
                  <v-text-field
                    v-model="vendorId"
                    class="mb-4 mr-5"
                    label="Existing vendor ID"
                    hint="Assigned by Department of Finance, found on remittances"
                    persistent-hint
                  />
                  <v-btn
                    class="mb-5"
                    prepend-icon="mdi-magnify"
                    :disabled="!canSearch"
                    style="height: 48px"
                    text="Search"
                    @click="doSearch"
                  />
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
                text="Previous"
                @click="step = 1"
              />
              <v-spacer />
              <v-btn
                append-icon="mdi-chevron-right"
                :disabled="!canContinue"
                text="Continue"
                @click="step = 3"
              />
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
                text="Previous"
                @click="step = 2"
              />
              <v-spacer />
              <v-btn
                append-icon="mdi-check"
                text="Submit Request"
                @click="doLink"
              />
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isEmpty, isNil } from "lodash"
import { useRouter } from "vue-router"

import { VendorLinkRequest, vendorLinkRequestsApi } from "@/api/vendor-link-requests-api"

import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import VendorMatchCard from "@/components/vendors/VendorMatchCard.vue"
import { useVendor, Vendor } from "@/use/use-vendor"

const step = ref(1)

const vendorId = ref("")

const { currentUser } = useCurrentUser<true>()
const vendorLinkRequest = ref<Partial<VendorLinkRequest>>({ userId: currentUser.value.id })

const error = ref("")

const matchedVendor = ref<Vendor | null>(null)

const canSearch = computed(() => {
  if (isEmpty(vendorId.value)) {
    return false
  }

  return true
})

const canContinue = computed(() => {
  // _TODO_ Is this change valid?
  if (
    isEmpty(vendorLinkRequest.value.ycorNumber) ||
    isEmpty(vendorLinkRequest.value.businessName) ||
    isEmpty(vendorLinkRequest.value.address)
  ) {
    return false
  }

  return true
})

async function doSearch() {
  try {
    const vendorIdRef = vendorId.value
    const { fetch } = useVendor(ref(vendorIdRef))

    const vendor = await fetch()

    error.value = ""
    matchedVendor.value = vendor || null
  } catch {
    matchedVendor.value = null
    error.value = "No match was found for that Vendor ID"
  }
}

const snack = useSnack()

const router = useRouter()

async function doLink() {
  try {
    vendorLinkRequest.value.matchedVendorId = matchedVendor.value?.vendorId
    await vendorLinkRequestsApi.create(vendorLinkRequest.value)
    snack.success("Request Submitted")
    router.push({ name: "individual/HomePage" })
  } catch (error) {
    snack.error(`Failed to create vendor link request: ${error}`)
  }
}

useBreadcrumbs("Link to Vendor", [])
</script>
