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
                  }})</strong
                >
              </p>
              <div v-if="!isNil(requestedByUser)">
                <p class="mb-2">
                  By:
                  <strong> {{ requestedByUser.displayName }}</strong> ({{ requestedByUser.email }})
                </p>

                <p class="mb-5">
                  <a :href="`mailto:${requestedByUser.email}`">
                    <v-icon class="mr-2">mdi-email</v-icon>Send {{ requestedByUser.displayName }} an
                    email</a
                  >
                </p>
              </div>

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

          <VendorPeopleCard :vendor-id="vendor.id" />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <h3 class="mb-3">Attachments</h3>

        <VendorProgramAttachments :vendor-program-id="vendorProgramIdNumber" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import { formatDate, formatDateRelative } from "@/utils/formatters"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"
import useVendor from "@/use/use-vendor"
import useVendorProgram from "@/use/use-vendor-program"
import useUser from "@/use/use-user"

import VendorPeopleCard from "@/components/vendors/VendorPeopleCard.vue"
import VendorProgramAttachments from "@/components/vendor-programs/VendorProgramAttachments.vue"

const props = defineProps<{ vendorId: string; programId: string; vendorProgramId: string }>()

const vendorIdNumber = computed(() => parseInt(props.vendorId))
const programIdNumber = computed(() => parseInt(props.programId))
const vendorProgramIdNumber = computed(() => parseInt(props.vendorProgramId))

const { vendor } = useVendor(vendorIdNumber)
const { program } = useProgram(programIdNumber)
const { vendorProgram } = useVendorProgram(vendorProgramIdNumber)

const requestedByUserId = computed(() => vendorProgram.value?.requestedByUserId)
const { user: requestedByUser } = useUser(requestedByUserId)

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
