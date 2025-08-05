<template>
  <LeftSidebarNavigationDrawer
    v-model="showDrawer"
    :show-rail="showRail"
  />
  <v-app-bar
    flat
    color="white"
    style="border-bottom: 1px #bbb solid"
  >
    <v-app-bar-nav-icon @click="toggleDrawer" />
    <v-app-bar-title
      v-if="mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
      :text="title"
    />
    <v-app-bar-title
      v-if="!mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
    >
      <router-link
        to="/"
        style="text-decoration: none"
      >
        Vendor Portal <strong>Administration</strong>
      </router-link>
    </v-app-bar-title>

    <KebabMenu />
  </v-app-bar>

  <v-main class="page-wrapper">
    <AppBreadcrumbs :items="breadcrumbs" />

    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue"
import { useDisplay } from "vuetify"

import useBreadcrumbs, { ADMIN_CRUMB } from "@/use/use-breadcrumbs"

import KebabMenu from "@/components/default-layout/KebabMenu.vue"
import LeftSidebarNavigationDrawer from "@/components/admin-layout/LeftSidebarNavigationDrawer.vue"
import AppBreadcrumbs from "@/components/common/AppBreadcrumbs.vue"

const { mdAndUp } = useDisplay()

const showDrawer = ref(mdAndUp.value)
const showRail = ref(!mdAndUp.value)

const { title, breadcrumbs } = useBreadcrumbs(undefined, undefined, {
  baseCrumb: ADMIN_CRUMB,
})

watch(
  () => unref(mdAndUp),
  (newVal) => {
    if (!newVal) {
      showDrawer.value = true
      showRail.value = false
    } else {
      showDrawer.value = false
      showRail.value = true
    }
  }
)

function toggleDrawer() {
  if (!mdAndUp.value) {
    showDrawer.value = !showDrawer.value
  } else {
    showRail.value = !showRail.value
  }
}
</script>
