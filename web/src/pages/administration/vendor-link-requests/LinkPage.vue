<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(vendorLinkRequest)"
    type="card"
  />
  <SimpleCard
    v-else
    :title="`Vendor link Request to ${vendorLinkRequest.businessName}`"
  >
    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-card class="mb-5">
            <v-card-text>
              <h3 class="mb-5">Requesting User Details</h3>
              ** SHOW BASIC USER INFO ON LEFT SIDE an Vendor Details on Right
              {{ vendorLinkRequest.user }}
            </v-card-text>
          </v-card>

          <v-card color="#7a9a0133">
            <v-card-text>
              <h3 class="mb-5">Requesting User Details</h3>

              <v-textarea
                v-model="vendorLinkRequest.reviewNotes"
                label="Review notes"
                rows="1"
                auto-grow
              />

              <v-select label="Vendor" />

              ** Put the vendor search field above. <br />
              **Approve can only be clicked if a vendor is selected.
              <v-row class="mt-5">
                <v-col>
                  <v-btn
                    :loading="isApproving"
                    :disabled="isApproved"
                    text="Approve"
                    block
                    @click="approveVendorLinkRequest"
                  />
                </v-col>
                <v-col>
                  <v-btn
                    :disabled="isEmpty(vendorLinkRequest.reviewNotes)"
                    :loading="isSending"
                    variant="outlined"
                    block
                    color="error"
                    style="background-color: #f1311422"
                    text="Reject"
                    @click="rejectVendorLinkRequest"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-card>
            <v-card-text>
              <h3 class="mb-5">Request Vendor Info</h3>
              <v-text-field
                v-model="vendorLinkRequest.businessName"
                label="Business Name"
                append-inner-icon="mdi-lock"
                readonly
              />
              <v-text-field
                v-model="vendorLinkRequest.operatingName"
                label="Operating Name"
                append-inner-icon="mdi-lock"
                readonly
              />
              <v-text-field
                v-model="vendorLinkRequest.matchedVendorId"
                label="Matched Vendor Id"
                append-inner-icon="mdi-lock"
                readonly
              />

              <v-text-field
                :model-value="vendorLinkRequest.ycorNumber"
                label="YCOR Number"
                append-inner-icon="mdi-lock"
                readonly
              />

              <v-textarea
                :model-value="vendorLinkRequest.address"
                label="Address"
                append-inner-icon="mdi-lock"
                rows="1"
                auto-grow
                hide-details
                readonly
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </SimpleCard>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"

import SimpleCard from "@/components/common/SimpleCard.vue"

import { VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"
import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendorLinkRequest from "@/use/use-vendor-link-request"

const props = defineProps<{ vendorLinkRequestId: string }>()
const vendorLinkRequestIdNumber = computed(() => parseInt(props.vendorLinkRequestId))

const { vendorLinkRequest, isLoading, save } = useVendorLinkRequest(vendorLinkRequestIdNumber)

const isApproved = computed(
  () => vendorLinkRequest.value?.status === VendorLinkRequestStatuses.ACCEPTED
)

const snack = useSnack()

const isApproving = ref(false)
const isSending = ref(false)

async function rejectVendorLinkRequest() {
  if (isNil(vendorLinkRequest.value)) return

  isSending.value = true

  try {
    vendorLinkRequest.value.status = VendorLinkRequestStatuses.REJECTED
    await save()
    snack.success("Rejected Vendor Link Request")
  } catch (error) {
    snack.error(`Failed to reject Vendor Link Request: ${error}`)
  } finally {
    isSending.value = false
  }
}

async function approveVendorLinkRequest() {
  if (isNil(vendorLinkRequest.value)) return

  isApproving.value = true

  try {
    vendorLinkRequest.value.status = VendorLinkRequestStatuses.ACCEPTED
    await save()
    snack.success("Accepted Vendor Link Request")
  } catch (error) {
    snack.error(`Failed to accept Vendor Link Request: ${error}`)
  } finally {
    isApproving.value = false
  }
}

useBreadcrumbs("Vendor Link Request", [
  { title: "Vendor Link Requests", to: { name: "administration/VendorLinkRequest" } },
])
</script>
