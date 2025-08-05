<template>
  <v-dialog width="500">
    <v-card
      v-if="vendorUser && vendorUser.user && vendorUser.vendor"
      class="mb-5"
    >
      <v-card-title class="d-flex">
        {{ vendorUser.user.displayName }}
      </v-card-title>
      <v-card-text>
        <div class="mb-3">
          <div class="">
            <v-text-field
              :model-value="vendorUser.user.displayName"
              label="User name"
              readonly
            />
            <v-text-field
              :model-value="vendorUser.user.email"
              label="User email"
              readonly
            />
            <strong>Linked to {{ vendorUser.vendor.name }}</strong>
            <br />
            <br />
            <strong>Approved by: </strong>
            <br />
            {{ vendorUser.decisionByUser?.displayName }} on {{ formatDate(vendorUser.decisionAt) }}
          </div>
        </div>

        <v-btn color="warning">Unlink</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toRefs } from "vue"

import { formatDate } from "@/utils/formatters"

import useVendorUser from "@/use/use-vendor-user"

const props = defineProps<{ vendorUserId: number | null }>()
const { vendorUserId } = toRefs(props)
const { vendorUser } = useVendorUser(vendorUserId)
</script>
