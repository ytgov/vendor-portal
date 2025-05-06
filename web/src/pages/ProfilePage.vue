<template>
  <v-skeleton-loader
    v-if="isNil(currentUser)"
    type="card"
  />
  <v-card v-else>
    <v-card-text>
      <UserEditForm
        class="mt-2"
        :user-id="currentUser.id"
        :cancel-button-options="{ to: { name: 'administration/UsersPage' } }"
        @saved="refresh"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import UserEditForm from "@/components/users/UserEditForm.vue"

const { currentUser, refresh } = useCurrentUser<true>()

useBreadcrumbs("My Profile", [
  {
    title: "Edit Profile",
    to: "",
  },
])
</script>

<style scoped></style>
