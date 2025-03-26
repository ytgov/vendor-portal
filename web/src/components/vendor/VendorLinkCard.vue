<template>
  <v-skeleton-loader
    v-if="isLoading"
    type="image"
  ></v-skeleton-loader>

  <v-card
    v-else-if="vendor"
    class="mb-5"
    @click="goToVendor"
  >
    <v-card-title>{{ vendor.name }} <small style="color: #888"></small></v-card-title>
    <!--  <v-card-subtitle>{{ vendor.vendorId }}</v-card-subtitle> -->
    <v-card-text>
      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-store</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Vendor ID: </strong><br />{{ vendor.vendorId }}
        </div>
      </div>

      <div class="d-flex mb-3">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-map</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Address: </strong><br />2 Stope Way<br />Whitehorse YT, Y1A0B3
        </div>
      </div>

      <div class="d-flex">
        <v-icon
          class="mt-2"
          size="40"
          color="#7A9A01"
          >mdi-handshake</v-icon
        >
        <div class="ml-2 text-subtitle-1">
          <strong>Programs: </strong><br />
          Paid Sick Leave Rebate
        </div>
      </div>
    </v-card-text>
    <v-card-text>
      <v-btn
        block
        @click="goToVendor"
        >Go To Vendor
      </v-btn>
    </v-card-text>
  </v-card>
  <div v-else>Error loading vendor information</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"

import { useVendors, VendorQueryOptions } from "@/use/use-vendors"

const props = defineProps<{ vendorId: string }>()

const router = useRouter()

const query = ref<VendorQueryOptions>({
  where: { vendorId: props.vendorId },
})

const { vendors, isLoading } = useVendors(query)
const vendor = computed(() => vendors.value.at(0))

watch(isLoading, () => {
  const programText = computed(() => {
    if (vendors.value) {
      return (
        `Currently enrolled in ${vendors.value.at(0)?.programs?.length} program` +
        (vendors.value.at(0)?.programs?.length != 1 ? "s" : "")
      )
    }
    return ""
  })

  console.log("programText: ", programText.value) // _TODO_ remove me
  console.log(vendors.value) // _TODO_ remove me
})

function goToVendor() {
  router.push({ name: "vendor/HomePage", params: { vendorId: vendors.value.at(0)?.vendorId } })
}
</script>
