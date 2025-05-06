<template>
  <v-skeleton-loader
    v-if="isNil(vendorUser)"
    type="card"
  />
  <v-card
    v-else-if="!isNil(vendorUser.user) && !isNil(vendorUser.vendor)"
    class="mb-5"
  >
    <v-card-title>
      {{ vendorUser.user.displayName }} ({{ makeDisplayRole(vendorUser.user.roles) }})
    </v-card-title>
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
        >
          mdi-account</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          {{ vendorUser.user.email }}
          <br />
          <strong>Linked to {{ vendorUser.vendor.name }} on: </strong><br />{{
            formatDate(vendorUser.decisionAt)
          }}<br />
          <strong>Approved by: </strong><br />{{ vendorUser.decisionByUser?.displayName }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil, includes } from "lodash"
import { toRefs } from "vue"

import { formatDate } from "@/utils/formatters"

import { UserRoles } from "@/api/users-api"

import useVendorUser from "@/use/use-vendor-user"

const props = defineProps<{ vendorUserId: number }>()
const { vendorUserId } = toRefs(props)
const { vendorUser } = useVendorUser(vendorUserId)

function makeDisplayRole(roles: UserRoles[]) {
  if (includes(roles, UserRoles.SYSTEM_ADMIN)) return UserRoles.SYSTEM_ADMIN
  if (includes(roles, UserRoles.PROGRAM_ADMIN)) return UserRoles.SYSTEM_ADMIN
  return UserRoles.USER
}
</script>
