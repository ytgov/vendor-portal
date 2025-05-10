<template>
  <v-navigation-drawer
    v-model="showDrawer"
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
        :to="{ name: 'administration/DashboardPage' }"
        title="Administration"
        prepend-icon="mdi-home"
        exact
      />

      <v-list-subheader title="Manage" />

      <v-list-item
        v-if="isSystemAdmin"
        title="Users"
        :to="{ name: 'administration/UsersPage' }"
        prepend-icon="mdi-account-group"
      />
      <v-list-item
        v-if="isSystemAdmin"
        title="Vendor Link Requests"
        :to="{ name: 'administration/VendorLinkRequestsManagePage' }"
        prepend-icon="mdi-link"
      />
      <v-list-item
        v-if="isSystemAdmin"
        title="Programs"
        :to="{ name: 'administration/ProgramsPage' }"
        prepend-icon="mdi-handshake"
      />
      <v-list-item
        v-if="isSystemAdmin"
        title="Documentation"
        :to="{ name: 'administration/DocumentationsPage' }"
        prepend-icon="mdi-file-sign"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import useCurrentUser from "@/use/use-current-user"
import { ref } from "vue"
import { useDisplay } from "vuetify/lib/framework.mjs"

const { mdAndUp } = useDisplay()
defineProps<{ showRail: boolean }>()

const { isSystemAdmin } = useCurrentUser()

const showDrawer = defineModel<boolean>({
  default: false,
})
const open = ref([])
</script>
