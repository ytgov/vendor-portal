<template>
  <v-skeleton-loader
    v-if="isNil(vendorProgram)"
    type="card"
  />
  <div v-else>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader
          v-if="isNil(vendor)"
          type="card"
        />
        <div v-else>
          <v-card class="mb-5">
            <v-card-title>{{ vendor.name }}</v-card-title>
            <v-card-text>
              <p class="mb-2">
                Submitted on:
                <strong>
                  {{ formatDate(vendorProgram.requestedAt) }} ({{
                    formatDateRelative(vendorProgram.requestedAt)
                  }})
                </strong>
              </p>
              <div v-if="!isNil(requestedByUser)">
                <p class="mb-2">
                  By:
                  <strong> {{ requestedByUser.displayName }}</strong> ({{ requestedByUser.email }})
                </p>

                <p class="mb-5">
                  <a :href="`mailto:${requestedByUser.email}`">
                    <v-icon
                      class="mr-2"
                      icon="mdi-email"
                    />
                    Send {{ requestedByUser.displayName }} an email
                  </a>
                </p>
              </div>

              <div
                class="d-flex"
                style="width: 100%"
              >
                <v-btn
                  color="success"
                  text="Confirm"
                  :loading="isDeciding"
                  :disabled="isDeciding"
                  @click="approveProgramApplication"
                />
                <v-spacer />
                <v-btn
                  color="warning"
                  text="Reject"
                  :loading="isDeciding"
                  :disabled="isDeciding"
                  @click="rejectProgramApplication"
                />
              </div>
            </v-card-text>
          </v-card>

          <VendorPeopleCard :vendor-id="vendor.id" />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <h3 class="mb-3">Submitted Documentation</h3>

        <VendorProgramAttachments :vendor-program-id="vendorProgramIdNumber" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import { formatDate, formatDateRelative } from "@/utils/formatters"

import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"
import useVendor from "@/use/use-vendor"
import useVendorProgram from "@/use/use-vendor-program"
import useUser from "@/use/use-user"

import VendorPeopleCard from "@/components/vendors/VendorPeopleCard.vue"
import VendorProgramAttachments from "@/components/vendor-programs/VendorProgramAttachments.vue"
import { VendorProgramStatuses } from "@/api/vendor-programs-api"

const props = defineProps<{ vendorId: string; programId: string; vendorProgramId: string }>()

const vendorIdNumber = computed(() => parseInt(props.vendorId))
const programIdNumber = computed(() => parseInt(props.programId))
const vendorProgramIdNumber = computed(() => parseInt(props.vendorProgramId))

const { vendor } = useVendor(vendorIdNumber)
const { program } = useProgram(programIdNumber)
const { vendorProgram, save } = useVendorProgram(vendorProgramIdNumber)

const requestedByUserId = computed(() => vendorProgram.value?.requestedByUserId)
const { user: requestedByUser } = useUser(requestedByUserId)

const isDeciding = ref(false)

const snack = useSnack()

const router = useRouter()

async function approveProgramApplication() {
  if (isNil(vendorProgram.value)) return

  isDeciding.value = true

  try {
    vendorProgram.value.status = VendorProgramStatuses.ACCEPTED

    await save()
    snack.success("Accepted Vendor Program Request")
    router.push({
      name: "administration/ProgramManagePage",
      params: { programId: programIdNumber.value.toString() },
    })
  } catch (error) {
    snack.error(`Failed to accept Vendor Program Request: ${error}`)
  } finally {
    isDeciding.value = false
  }
}

async function rejectProgramApplication() {
  if (isNil(vendorProgram.value)) return

  isDeciding.value = true

  try {
    vendorProgram.value.status = VendorProgramStatuses.REJECTED

    await save()
    snack.success("Rejected Vendor Program Request")
    router.push({
      name: "administration/ProgramManagePage",
      params: { programId: programIdNumber.value.toString() },
    })
  } catch (error) {
    snack.error(`Failed to reject Vendor Program Request: ${error}`)
  } finally {
    isDeciding.value = false
  }
}

const breadcrumbs = computed(() => {
  const baseCrumbs = [
    {
      title: "Programs",
      to: { name: "administration/ProgramsPage" },
    },
  ]

  if (vendor.value && program.value) {
    return [
      ...baseCrumbs,
      {
        title: `Manage ${program.value.name}`,
        to: {
          name: "administration/ProgramManagePage",
          params: {
            programId: program.value.id,
          },
        },
      },
      {
        title: vendor.value.name,
        to: "",
      },
    ]
  }

  return [...baseCrumbs, { title: "Loading...", to: "" }]
})

useBreadcrumbs("", breadcrumbs)
</script>
