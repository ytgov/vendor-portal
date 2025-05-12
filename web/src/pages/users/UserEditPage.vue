<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <SimpleCard v-else>
    <!-- <h2 class="d-flex flex-column flex-md-row justify-space-between mb-3">
          <v-spacer />

          <div class="d-flex justify-space-between mt-4 mb-3 my-md-0">
            <v-btn
              class="ml-md-3"
              title="Refresh"
              color="primary"
              append-icon="mdi-sync"
              @click="refresh"
            >
              Sync
            </v-btn>
          </div>
        </h2> -->

    <UserEditForm
      class="mt-4"
      :user-id="user.id"
      :cancel-button-options="{ to: { name: 'administration/UsersPage' } }"
      @saved="userSavedCallback"
    />
  </SimpleCard>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { isNil } from "lodash"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useUser from "@/use/use-user"
import { useRouter } from "vue-router"

import SimpleCard from "@/components/common/SimpleCard.vue"
import UserEditForm from "@/components/users/UserEditForm.vue"

const props = defineProps<{
  userId: string
}>()

const userId = computed(() => parseInt(props.userId))
const { user } = useUser(userId)

const router = useRouter()

function userSavedCallback() {
  router.push({ name: "administration/UsersPage" })
}

const breadcrumbs = computed(() => {
  if (isNil(user.value)) {
    return [
      {
        title: "Users",
        to: { name: "administration/UsersPage" },
      },
      { title: "Loading...", to: "" },
    ]
  }

  return [
    {
      title: "Users",
      to: { name: "administration/UsersPage" },
    },
    {
      title: user.value.displayName,
      to: "",
    },
  ]
})

useBreadcrumbs("Edit User", breadcrumbs)
</script>
