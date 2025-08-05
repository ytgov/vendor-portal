<template>
  <v-skeleton-loader
    v-if="isNil(vendorUser)"
    type="card"
  />
  <v-card
    v-else-if="!isNil(vendorUser.user) && !isNil(vendorUser.vendor)"
    class="mb-5"
  >
    <v-card-title class="d-flex">
      {{ vendorUser.user.displayName }}
      <UserRolesChip
        class="ml-3"
        :roles="userRoles"
      />
    </v-card-title>
    <v-card-text>
      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          icon="mdi-account"
        />
        <div class="ml-2 text-subtitle-1">
          <div class="mb-2">
            <strong>Email</strong>
            <br />
            {{ vendorUser.user.email }}
          </div>

          <div class="mb-2">
            <strong>Linked on: </strong>
            <br />
            {{ formatDate(vendorUser.decisionAt) }}
          </div>
          <div>
            <strong>Approved by: </strong>
            <br />
            {{ vendorUser.decisionByUser?.displayName }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import { formatDate } from "@/utils/formatters"

import { UserRoles } from "@/api/users-api"

import useVendorUser from "@/use/use-vendor-user"

import UserRolesChip from "@/components/users/UserRolesChip.vue"

const props = defineProps<{ vendorUserId: number }>()
const { vendorUserId } = toRefs(props)
const { vendorUser } = useVendorUser(vendorUserId)

const userRoles = computed(() => {
  if (isNil(vendorUser.value) || isNil(vendorUser.value.user)) return []
  return vendorUser.value.user.roles.filter((role) => shouldDisplayRole(role))
})

function shouldDisplayRole(role: UserRoles) {
  switch (role) {
    case UserRoles.USER:
      return false
    case UserRoles.SYSTEM_ADMIN:
      return true
    case UserRoles.PROGRAM_ADMIN:
      return true
    default:
      return false
  }
}
</script>
