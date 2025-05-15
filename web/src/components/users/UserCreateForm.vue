<template>
  <v-form
    ref="form"
    @submit.prevent="validateAndCreate"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="userAttributes.email"
          label="Email *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="userAttributes.firstName"
          label="First name *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="userAttributes.lastName"
          label="Last name *"
          :rules="[required]"
          required
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="userAttributes.displayName"
          label="Display Name"
          required
        />
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <h3>Roles</h3>

        <UserRolesSelect
          v-model="userAttributes.roles"
          label="Roles *"
          :rules="[required]"
          class="mt-6"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col class="d-flex justify-end">
        <v-btn
          :loading="isLoading"
          color="error"
          variant="outlined"
          :to="{ name: 'administration/UsersPage' }"
          text="Cancel"
        />
        <v-btn
          class="ml-3"
          :loading="isLoading"
          type="submit"
          color="success"
          text="Create"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref } from "vue"
import { useRouter } from "vue-router"

import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import usersApi, { type User, UserRoles } from "@/api/users-api"
import useSnack from "@/use/use-snack"

import UserRolesSelect from "@/components/users/UserRolesSelect.vue"

const snack = useSnack()
const router = useRouter()

const userAttributes = ref<Partial<User>>({
  roles: [UserRoles.USER],
})
const isLoading = ref(false)
const form = ref<InstanceType<typeof VForm> | null>(null)

async function validateAndCreate() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) {
    snack.error("Please fill out all required fields")
    return
  }

  isLoading.value = true
  try {
    await usersApi.create(userAttributes.value)
    snack.success("User created.")
    router.push({ name: "administration/UsersPage" })
  } catch (error) {
    snack.error("Failed to create user!")
    throw error
  } finally {
    isLoading.value = false
  }
}
</script>
