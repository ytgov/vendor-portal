<template>
  <h3 class="mb-3">Linked Accounts</h3>

  <div
    v-for="(vendorUser, index) in vendorUsers"
    :key="index"
  >
    <VendorUserCard :vendor-user-id="vendorUser.id" />
  </div>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed, toRefs } from "vue"

import useVendorUsers, { VendorUserQueryOptions } from "@/use/use-vendor-users"

import VendorUserCard from "@/components/vendor-users/VendorUserCard.vue"

const props = defineProps<{ vendorId: number }>()
const { vendorId } = toRefs(props)

const vendorUserQuery = computed<VendorUserQueryOptions>(() => {
  if (isNil(vendorId.value)) return {} // where 1 == 0 ?

  return {
    where: {
      vendorId: vendorId.value,
    },
  }
})

const { vendorUsers } = useVendorUsers(vendorUserQuery)
</script>
