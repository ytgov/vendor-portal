<template>
  <v-card variant="outlined">
    <v-card-title>Enrolled Programs</v-card-title>

    <v-list>
      <div>
        <v-list-item
          v-for="program of vendor.programs"
          :key="program.id"
          class="mx-2"
          variant="outlined"
          @click="openVendorProgram(program)"
        >
          <div class="py-2">
            <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2">
              {{ program.name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ program.department }}</v-list-item-subtitle>
            <p class="text-subtitle-2">Enrolled since November 2, 2023</p>
          </div>
        </v-list-item>
      </div>
    </v-list>
    <v-card-text>
      <router-link :to="`/programs`">
        Find additional programs
      </router-link>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

import { Vendor } from "@/use/use-vendor"
import { VendorProgram } from "@/api/vendor-programs-api"

const router = useRouter()

const props = defineProps<{ vendor: Vendor }>()

const vendor = computed(() => props.vendor)

function openVendorProgram(program: VendorProgram) {
  router.push(`/vendor/${vendor.value.vendorId}/programs/${program.slug}`)
}
</script>
