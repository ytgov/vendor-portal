<template>
  <v-skeleton-loader v-if="isNil(currentUser)" />
  <v-container v-else>
    <UserEditForm
      class="mt-2"
      :user-id="currentUser.id"
      :cancel-button-options="{ to: { name: 'administration/UsersPage' } }"
      @saved="refresh"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"

import useBreadcrumbs, { BASE_CRUMB } from "@/use/use-breadcrumbs"
import useCurrentUser from "@/use/use-current-user"

import UserEditForm from "@/components/users/UserEditForm.vue"

const { currentUser, refresh } = useCurrentUser<true>()

useBreadcrumbs("My Profile", [BASE_CRUMB])
</script>

<style scoped></style>
