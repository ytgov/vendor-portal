<template>
  <v-skeleton-loader
    v-if="isNil(user)"
    type="card"
  />
  <v-form
    v-else
    ref="form"
    @submit.prevent="saveWrapper"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.firstName"
          label="First name *"
          :rules="[required]"
          required
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.lastName"
          label="Last name *"
          :rules="[required]"
          required
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.displayName"
          label="Display Name *"
          :rules="[required]"
          required
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="user.email"
          label="Email *"
          :rules="[required]"
          required
          hide-details
        />
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <h3 class="mb-1">Roles</h3>

        <v-chip
          v-for="(role, index) in user.roles"
          :key="index"
          class="ma-2"
          color="info"
          size="large"
        >
          {{ formatRole(role) }}
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-btn
          prepend-icon="mdi-delete"
          :loading="isDeleting"
          text="Delete"
          color="error"
          variant="outlined"
          @click="confirmThenDelete(user)"
        />
        <v-spacer />
        <v-btn
          :loading="isLoading"
          color="secondary"
          variant="outlined"
          v-bind="cancelButtonOptions"
          text="Cancel"
        />
        <v-btn
          class="ml-3"
          :loading="isLoading"
          type="submit"
          color="success"
          text="Save"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, toRefs } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import { type VBtn, type VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import useSnack from "@/use/use-snack"
import useUser, { User } from "@/use/use-user"
import usersApi from "@/api/users-api"

type CancelButtonOptions = VBtn["$props"]

const props = withDefaults(
  defineProps<{
    userId: number
    cancelButtonOptions?: CancelButtonOptions
  }>(),
  {
    cancelButtonOptions: ({ userId }) => ({
      to: {
        name: "UserPage",
        params: { userId },
      },
    }),
  }
)

const emit = defineEmits<{
  saved: [userId: number]
}>()

const { userId } = toRefs(props)
const { user, save, isLoading } = useUser(userId)

const snack = useSnack()
const router = useRouter()

const form = ref<InstanceType<typeof VForm> | null>(null)

async function saveWrapper() {
  if (isNil(form.value)) return

  const { valid } = await form.value.validate()
  if (!valid) return

  if (isNil(user.value)) return

  await save()
  snack.success("User saved!")
  emit("saved", user.value.id)
}

const isDeleting = ref(false)

async function confirmThenDelete(user: User) {
  const { displayName, email } = user
  const result = confirm(`Are you sure you want to delete ${displayName}: ${email}.`)
  if (result === false) return

  isDeleting.value = true
  try {
    await usersApi.delete(user.id)

    router.push({ name: "administration/UsersPage" })
  } catch (error) {
    console.error(error)
    snack.error(`Failed to load directory: ${error}`)
  } finally {
    isDeleting.value = false
  }
}

const { t } = useI18n()

function formatRole(role: string) {
  return t(`user.roles.${role}`, role)
}
</script>
