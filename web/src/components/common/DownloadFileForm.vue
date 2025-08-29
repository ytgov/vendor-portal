<template>
  <v-form
    ref="form"
    :action="downloadUrl"
    method="post"
    target="_blank"
    @submit.prevent="getAccessTokenAndSubmit"
  >
    <input
      type="hidden"
      name="VENDOR_PORTAL_API_AUTHORIZATION_TOKEN"
      :value="accessToken"
    />
    <v-btn
      :block="smAndDown"
      color="primary"
      :prepend-icon="prependIcon"
      type="submit"
      :text="text"
      :size="size"
    />
  </v-form>
</template>

<script lang="ts" setup>
import { isNil } from "lodash"
import { ref, nextTick } from "vue"
import { useDisplay } from "vuetify"
import { useAuth0 } from "@auth0/auth0-vue"

import { type VForm } from "vuetify/components"

withDefaults(
  defineProps<{
    text?: string
    downloadUrl: string
    prependIcon?: string
    size?: string
  }>(),
  {
    text: "Download File",
    prependIcon: "mdi-download",
    size: "default",
  }
)

const { getAccessTokenSilently } = useAuth0()

const form = ref<InstanceType<typeof VForm> | null>(null)
const accessToken = ref<string | null>(null)

async function getAccessTokenAndSubmit() {
  if (isNil(form.value)) {
    throw new Error("Form element is not available")
  }

  try {
    accessToken.value = await getAccessTokenSilently()
  } catch (error) {
    console.error(`Error fetching new access token: ${error}`, { error })
    throw error
  }

  await nextTick() // Wait for accessToken to be updated in the DOM

  form.value.submit()
}

const { smAndDown } = useDisplay()
</script>
