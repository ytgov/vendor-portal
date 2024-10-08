<template>
  <h2>My Profile</h2>

  <v-card>
    <v-row>
      <v-col
        cols="12"
        md="4"
      >
        <v-label>First name</v-label>
        <v-text-field
          v-model="currentUser.firstName"
          readonly
          append-inner-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-label>Last name</v-label>
        <v-text-field
          v-model="currentUser.lastName"
          readonly
          append-inner-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-label>Email</v-label>
        <v-text-field
          v-model="currentUser.email"
          readonly
          append-inner-icon="mdi-lock"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-label>Display name</v-label>
        <v-text-field v-model="currentUser.displayName"></v-text-field>
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-label>Title</v-label>
        <v-text-field v-model="currentUser.title"></v-text-field>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

const { currentUser, save } = useCurrentUser<true>()
const route = useRoute()

const tab = ref("")

if (route.hash) {
  tab.value = route.hash
}

useBreadcrumbs([
  {
    title: "Profile",
    to: { name: "ProfilePage" },
  },
])
</script>

<style scoped></style>
