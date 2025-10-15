<template>
  <v-navigation-drawer
    v-model="showDrawer"
    width="280"
    :disable-resize-watcher="false"
    :rail="showRail"
    :permanent="mdAndUp"
    :location="!mdAndUp ? 'bottom' : undefined"
    color="#FEE6C2"
  >
    <v-list
      v-model:opened="open"
      class="pt-0"
      color="black"
    >
      <v-list-item style="height: 64px; margin: 0; padding: 0">
        <div
          v-if="showRail"
          class="d-flex"
        >
          <img
            src="@/assets/logo-small.png"
            style="margin-left: 0px; width: 53px"
          />
          <div
            v-if="!mdAndUp"
            style="margin-left: 20px; padding-top: 13px; font-weight: bold; font-size: 19px"
          >
            Vendor Portal
          </div>
        </div>
        <img
          v-else
          src="@/assets/logo-wide.svg"
          style="margin-left: 15px"
        />
      </v-list-item>

      <v-list-item
        title="Home"
        prepend-icon="mdi-home"
        :to="{ name: 'individual/HomePage' }"
      />
      <v-list-item
        title="My Link Requests"
        prepend-icon="mdi-link"
        :to="{ name: 'VendorLinkRequestsPage' }"
      />
      <v-list-item
        title="Available Programs"
        prepend-icon="mdi-handshake"
        :to="{ name: 'programs/ProgramsAvailablePage' }"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useDisplay } from "vuetify"

const { mdAndUp } = useDisplay()
defineProps<{ showRail: boolean }>()

const showDrawer = defineModel<boolean>({
  default: false,
})
const open = ref([])
</script>
