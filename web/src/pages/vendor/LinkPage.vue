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
        <SimpleCard title="Welcome">
          <p class="mb-4 text-h6">
            This wizard will guide you through the process of linking your personal account to an
            existing vendor record.
          </p>
          <p class="mb-2 text-body-1">
            This is not the procedure to create a new vendor record. To do that, please contact our
            office.
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
        </SimpleCard>
      </template>

      <template #item.2>
        <SimpleCard title="Vendor Information">
          <p class="text-body-1 mb-4">
            Please enter as much information as you know about the vendor you are trying to link. If
            you know the existing Vendor ID, please enter it below and hit search.
          </p>
          <p class="mb-4">YCOR number or Existing Vendor ID is required.</p>
          <v-form
            ref="formRef"
            v-model="isValid"
          >
            <v-row class="mt-2">
              <v-col>
                <v-text-field
                  v-model="vendorLinkRequest.businessName"
                  label="Business name (required)"
                  :rules="[required]"
                />
                <v-text-field
                  v-model="vendorLinkRequest.ycorNumber"
                  class="mb-4"
                  label="YCOR number (required)"
                  hint="Six digit Yukon Corporate Online Registry number"
                  persistent-hint
                  :rules="[required, length(6)]"
                />
                <v-textarea
                  v-model="vendorLinkRequest.mailingAddress"
                  label="Mailing Address (required)"
                  rows="3"
                  :rules="[required]"
                />

                <v-checkbox
                  v-model="isMailingAndPhysicalAddressSame"
                  label="Physical Address is the same as Mailing Address"
                />
                <div v-if="!isMailingAndPhysicalAddressSame">
                  <v-textarea
                    v-model="vendorLinkRequest.physicalAddress"
                    label="Physical Address"
                    rows="3"
                  />
                </div>
                <div v-else>
                  <v-textarea
                    v-model="vendorLinkRequest.mailingAddress"
                    label="Physical Address"
                    rows="3"
                    disabled
                  />
                </div>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="vendorLinkRequest.operatingName"
                  label="Operating as"
                />
                <div class="d-flex">
                  <v-text-field
                    v-model="vendorLinkRequest.matchedVendorId"
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
                    <v-icon icon="mdi-alert-circle" />
                    {{ error }}
                  </div>
                </div>
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
                color="warning"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                text="Previous"
                @click="step = 1"
              />
              <v-spacer />
              <v-btn
                append-icon="mdi-chevron-right"
                text="Continue"
                @click="validateAndGoToLastStep"
              />
            </div>
          </v-form>
        </SimpleCard>
      </template>

      <template #item.3>
        <SimpleCard title="Request Link">
          <v-row>
            <v-col>
              <p class="text-body-1 mb-4">
                This new link request will be reviewed by our staff before it is finalized. We may
                require additional information from you to prove your connection to this vendor. If
                that is the case, we will email you at
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
        </SimpleCard>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { isEmpty } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { VForm } from "vuetify/lib/components/index.mjs"

import { required, length } from "@/utils/validators"

import { VendorLinkRequest, vendorLinkRequestsApi } from "@/api/vendor-link-requests-api"

import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"
import { useVendor, Vendor } from "@/use/use-vendor"

import VendorMatchCard from "@/components/vendors/VendorMatchCard.vue"
import SimpleCard from "@/components/common/SimpleCard.vue"

const step = ref(1)

const { currentUser } = useCurrentUser<true>()
const vendorLinkRequest = ref<Partial<VendorLinkRequest>>({ userId: currentUser.value.id })

const isValid = ref(false)
const isMailingAndPhysicalAddressSame = ref(false)

const error = ref("")

const matchedVendor = ref<Vendor | null>(null)

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const canSearch = computed(() => {
  if (isEmpty(vendorLinkRequest.value.matchedVendorId)) {
    return false
  }

  return true
})

async function validateAndGoToLastStep() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  step.value = 3
}

async function doSearch() {
  try {
    const vendorIdRef = vendorLinkRequest.value.matchedVendorId
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
    await vendorLinkRequestsApi.create(vendorLinkRequest.value)
    snack.success("Request Submitted")
    router.push({ name: "individual/HomePage" })
  } catch (error) {
    snack.error(`Failed to create vendor link request: ${error}`)
  }
}

useBreadcrumbs("Link to Vendor", [])
</script>
