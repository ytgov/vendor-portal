<template>
  <v-card>
    <v-card-text>
      <div class="d-flex">
        <v-text-field
          v-model="search"
          label="Search"
          density="compact"
        />

        <v-btn
          color="primary"
          class="ml-4"
          :to="{ name: 'administration/UserNewPage' }"
          style="height: 40px"
        >
          Create User
        </v-btn>
      </div>

      <v-data-table-server
        v-model:items-per-page="perPage"
        :page="page"
        :headers="headers"
        :items="users"
        :search="search"
        :items-length="totalCount"
        :loading="isLoading"
        style="border: 1px #ccc solid; border-radius: 3px"
        @click:row="(_event: unknown, { item }: UserTableRow) => goToUserEdit(item.id)"
      >
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import useUsers, { User } from "@/use/use-users"
import { useRouteQuery } from "@vueuse/router"

import { ADMIN_CRUMB, useBreadcrumbs } from "@/use/use-breadcrumbs"

type UserTableRow = {
  item: User
}

const search = ref("")
const { t } = useI18n()

const headers = ref([
  { title: "Display Name", key: "displayName" },
  { title: "Email", key: "email" },
  { title: "Title", key: "title" },
  {
    title: "Department",
    key: "department",
    value: (item: unknown) => {
      const { department, division, branch, unit } = item as User
      return [department, division, branch, unit].filter(Boolean).join(" - ")
    },
  },
  {
    title: "Role",
    key: "roles",
    value: (item: unknown) => {
      const { roles } = item as User
      const formatedRoleTypes = roles.map((role) => t(`user.roles.${role}`, role))
      return formatedRoleTypes.join(", ")
    },
  },
  { title: "", key: "actions" },
])

const router = useRouter()
const page = useRouteQuery("page", "1", { transform: Number })
const perPage = useRouteQuery("perPage", "10", { transform: Number })

const usersQuery = computed(() => ({
  perPage: perPage.value,
  page: page.value,
  filters: { search: search.value },
}))

const { users, totalCount, isLoading, refresh } = useUsers(usersQuery)

function goToUserEdit(userId: number) {
  router.push({
    name: "administration/UserEditPage",
    params: { userId },
  })
}

useBreadcrumbs("Manage Users", [
  ADMIN_CRUMB,
  {
    title: "Manage Users",
    to: {
      name: "administration/UsersPage",
    },
  },
])

defineExpose({ refresh })
</script>
