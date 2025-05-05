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
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    <v-app-bar-title
      v-if="mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
    >
      <span v-if="showRail">Vendor Portal :</span>
      {{ title }}</v-app-bar-title
    >
    <v-app-bar-title
      v-if="!mdAndUp"
      class="ml-2 text-weight-bold"
      style="font-weight: bold"
    >
      <router-link
        to="/"
        style="text-decoration: none"
        >Vendor Portal</router-link
      >
    </v-app-bar-title>

    <KebabMenu />
  </v-app-bar>

  <v-main class="page-wrapper">
    <SimpleBreadcrumbs />

    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref, unref, watch } from "vue"
import { useDisplay } from "vuetify"

import SimpleBreadcrumbs from "@/components/common/SimpleBreadcrumbs.vue"
import KebabMenu from "@/components/default-layout/KebabMenu.vue"
import LeftSidebarNavigationDrawer from "@/components/default-layout/LeftSidebarNavigationDrawer.vue"
import useBreadcrumbs from "@/use/use-breadcrumbs"

const { mdAndUp } = useDisplay()

const showDrawer = ref(mdAndUp.value)
const showRail = ref(!mdAndUp.value)

const { title } = useBreadcrumbs()

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
  console.log(mdAndUp.value, showRail.value)

  if (!mdAndUp.value) showDrawer.value = !showDrawer.value
  else {
    showRail.value = !showRail.value
  }
}
</script>
