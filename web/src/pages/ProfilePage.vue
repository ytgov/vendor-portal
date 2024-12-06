<template>
  <v-skeleton-loader v-if="isNil(currentUser)" />
  <v-container v-else>
    <h2 class="d-flex flex-column flex-md-row justify-space-between mb-3">
      <div class="d-flex justify-space-between mt-4 mb-3 my-md-0">
        <v-btn
          color="primary"
          variant="outlined"
          :to="{ name: 'administration/UsersPage' }"
        >
          Back
        </v-btn>
      </div>
    </h2>

    <UserEditForm
      class="mt-10"
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
