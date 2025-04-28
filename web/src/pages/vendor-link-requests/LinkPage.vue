<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(vendorLinkRequest)"
    type="card"
  />
  <v-form v-else>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="vendorLinkRequest.matchedVendorId"
          label="Matched Vendor Id"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="vendorLinkRequest.status"
          label="Status"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="vendorLinkRequest.businessName"
          label="Business Name"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="vendorLinkRequest.operatingName"
          label="Operating Name"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :model-value="vendorLinkRequest.ycorNumber"
          label="YCOR Number"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          :model-value="vendorLinkRequest.address"
          label="Address"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-textarea
          :model-value="vendorLinkRequest.reviewNotes"
          label="Review Notes"
          readonly
        />
      </v-col>
    </v-row>
    <v-btn
      :loading="isSending"
      text="Approve"
      @click="approveVendorLinkRequest"
    />
    <v-btn
      :loading="isSending"
      class="ml-2"
      variant="outlined"
      color="error"
      text="Reject"
      @click="rejectVendorLinkRequest"
    />
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref } from "vue"

import { VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"

import useSnack from "@/use/use-snack"
import useVendorLinkRequest from "@/use/use-vendor-link-request"

const props = defineProps<{ vendorLinkRequestId: string }>()
const vendorLinkRequestIdNumber = computed(() => parseInt(props.vendorLinkRequestId))

const { vendorLinkRequest, isLoading, save } = useVendorLinkRequest(vendorLinkRequestIdNumber)

const snack = useSnack()

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

  isSending.value = true

  try {
    vendorLinkRequest.value.status = VendorLinkRequestStatuses.ACCEPTED
    await save()
    snack.success("Accepted Vendor Link Request")
  } catch (error) {
    snack.error(`Failed to accept Vendor Link Request: ${error}`)
  } finally {
    isSending.value = false
  }
}
</script>
