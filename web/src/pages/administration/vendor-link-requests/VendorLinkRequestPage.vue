<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(vendorLinkRequest)"
    type="card"
  />
  <SimpleCard
    v-else
    :title="`Request ${vendorLinkRequest.user?.displayName} - ${vendorLinkRequest.businessName}`"
  >
    <v-form>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <SimpleCard>
            <h3 class="mb-3">Requesting User Details</h3>
            <p class="mb-2">
              Submitted on:
              <strong>
                {{ formatDate(vendorLinkRequest.createdAt) }} ({{
                  formatDateRelative(vendorLinkRequest.createdAt)
                }})
              </strong>
            </p>
            <div v-if="!isNil(vendorLinkRequest.user)">
              <p class="mb-4">
                By:
                <strong> {{ vendorLinkRequest.user.displayName }}</strong> ({{
                  vendorLinkRequest.user.email
                }})
              </p>

              <p class="mb-2">
                <a :href="`mailto:${vendorLinkRequest.user.email}`">
                  <v-icon
                    class="mr-2"
                    icon="mdi-email"
                  />
                  Send {{ vendorLinkRequest.user.displayName }} an email
                </a>
              </p>
            </div>
          </SimpleCard>

          <SimpleCard color="#7a9a0133">
            <h3 class="mb-5">Requesting User Details</h3>

            <v-textarea
              v-model="vendorLinkRequest.reviewNotes"
              label="Review notes"
              rows="1"
              auto-grow
              :append-inner-icon="!isPending ? 'mdi-lock' : ''"
              :readonly="!isPending"
            />

            <div class="d-flex">
              <v-text-field
                v-model="vendorLinkRequest.vendorId"
                class="mb-4 mr-5"
                label="Vendor ID"
                hint="Assigned by Department of Finance, found on remittances"
                persistent-hint
                :append-inner-icon="!isPending ? 'mdi-lock' : ''"
                :readonly="!isPending"
              />
              <v-btn
                v-if="isPending"
                class="mb-5"
                prepend-icon="mdi-magnify"
                :disabled="isEmpty(vendorLinkRequest.vendorId)"
                style="height: 48px"
                text="Search"
                @click="doSearch"
              />
            </div>
            <div class="d-flex">
              <div
                v-if="vendorSearchError"
                class="text-subtitle-1 text-error"
                style="line-height: 36px"
              >
                <v-icon icon="mdi-alert-circle" />
                {{ vendorSearchError }}
              </div>
            </div>
            <div v-if="matchedVendor">
              <VendorMatchCard :vendor="matchedVendor" />
              <p class="mt-5">If this match is correct, please click the "Approve" button below.</p>
            </div>
            <v-row
              v-if="isPending"
              class="mt-5"
            >
              <v-col>
                <v-btn
                  :disabled="!canApprove"
                  :loading="isDeciding"
                  text="Approve"
                  block
                  @click="approveVendorLinkRequest"
                />
              </v-col>
              <v-col>
                <v-btn
                  :disabled="!canReject"
                  :loading="isDeciding"
                  variant="outlined"
                  block
                  color="error"
                  style="background-color: #f1311422"
                  text="Reject"
                  @click="rejectVendorLinkRequest"
                />
              </v-col>
            </v-row>
          </SimpleCard>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <SimpleCard>
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
          </SimpleCard>
        </v-col>
      </v-row>
    </v-form>
  </SimpleCard>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"

import SimpleCard from "@/components/common/SimpleCard.vue"

import { formatDate, formatDateRelative } from "@/utils/formatters"

import vendorsApi from "@/api/vendors-api"
import vendorUsersApi from "@/api/vendor-users-api"
import { VendorLinkRequestStatuses } from "@/api/vendor-link-requests-api"

import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useVendorLinkRequest from "@/use/use-vendor-link-request"
import { Vendor } from "@/use/use-vendor"

import VendorMatchCard from "@/components/vendors/VendorMatchCard.vue"

const props = defineProps<{ vendorLinkRequestId: string }>()
const vendorLinkRequestIdNumber = computed(() => parseInt(props.vendorLinkRequestId))

const { vendorLinkRequest, isLoading, save } = useVendorLinkRequest(vendorLinkRequestIdNumber)

const isApproved = computed(
  () => vendorLinkRequest.value?.status === VendorLinkRequestStatuses.ACCEPTED
)

const isPending = computed(
  () => vendorLinkRequest.value?.status === VendorLinkRequestStatuses.PENDING
)

const matchedVendor = ref<Vendor | null>(null)
const vendorSearchError = ref("")

const canApprove = computed(() => {
  if (isNil(vendorLinkRequest.value)) return false
  if (isApproved.value) return false
  if (isNil(matchedVendor.value)) return false

  return true
})

const canReject = computed(() => {
  if (isNil(vendorLinkRequest.value)) return false

  return true
})

async function doSearch() {
  try {
    if (isNil(vendorLinkRequest.value)) {
      vendorSearchError.value = "No vendor link request found"
      return
    }
    if (isNil(vendorLinkRequest.value.vendorId)) {
      vendorSearchError.value = "Search failed no vendor ID found"
      return
    }
    if (isNil(vendorLinkRequest.value.user)) {
      vendorSearchError.value = "Requesting user not found"
      return
    }

    const { vendor } = await vendorsApi.get(vendorLinkRequest.value.vendorId)

    const { totalCount } = await vendorUsersApi.list({
      where: { vendorId: vendor.id, userId: vendorLinkRequest.value.user.id },
    })

    if (totalCount !== 0) {
      vendorSearchError.value = "Requesting user is already linked to this Vendor ID"
      return
    }

    matchedVendor.value = vendor
    vendorSearchError.value = ""
  } catch {
    matchedVendor.value = null
    vendorSearchError.value = "No match was found for that Vendor ID"
  }
}

const snack = useSnack()

const isDeciding = ref(false)

async function rejectVendorLinkRequest() {
  if (isNil(vendorLinkRequest.value)) return

  isDeciding.value = true

  try {
    vendorLinkRequest.value.status = VendorLinkRequestStatuses.REJECTED
    await save()
    snack.success("Rejected Vendor Link Request")
  } catch (error) {
    snack.error(`Failed to reject Vendor Link Request: ${error}`)
  } finally {
    isDeciding.value = false
  }
}

async function approveVendorLinkRequest() {
  if (isNil(vendorLinkRequest.value)) return
  if (isNil(matchedVendor.value)) return

  isDeciding.value = true

  try {
    vendorLinkRequest.value.vendorId = matchedVendor.value.vendorId
    vendorLinkRequest.value.status = VendorLinkRequestStatuses.ACCEPTED
    await save()
    snack.success("Accepted Vendor Link Request")
  } catch (error) {
    snack.error(`Failed to accept Vendor Link Request: ${error}`)
  } finally {
    isDeciding.value = false
  }
}

const breadcrumbs = computed(() => [
  {
    title: "Vendor Link Requests",
    to: { name: "administration/VendorLinkRequestsManagePage" },
  },
  {
    title: "Vendor Link Request",
    to: {
      name: "administration/VendorLinkRequestPage",
      params: { vendorLinkRequestId: props.vendorLinkRequestId },
    },
  },
])

useBreadcrumbs("Vendor Link Request", breadcrumbs)
</script>
