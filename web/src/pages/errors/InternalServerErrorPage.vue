<template>
  <v-empty-state
    headline="Whoops, 500"
    title="Internal Server Error"
    :text="'Oops! The server encountered an unexpected error. Please\u00a0contact\u00a0support.'"
    :image="SplashImage"
  >
    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn
          color="primary"
          width="200"
          variant="outlined"
          @click="goBack"
          >Back</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <!-- href="/" performs a more aggressive refresh than using to="xxx" -->
        <v-btn
          href="/"
          color="primary"
          width="200"
          variant="outlined"
          >Home</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-btn
          width="200"
          @click="signOut"
          >Logout</v-btn
        >
      </v-col>
    </v-row>
    <v-divider
      class="mt-10 mb-6"
      thickness="1"
    />
    <p>Site: {{ APPLICATION_NAME }}</p>
    <p>Version: {{ releaseTag }}</p>
    <p>Commit Hash: {{ gitCommitHash }}</p>
  </v-empty-state>
</template>

<script lang="ts" setup>
import SplashImage from "@/assets/SplashImage.png"
import { useAuth0 } from "@auth0/auth0-vue"

import { APPLICATION_NAME } from "@/config"
import useCurrentUser from "@/use/use-current-user"
import useStatus from "@/use/use-status"

const { logout } = useAuth0()
const { reset: resetCurrentUser } = useCurrentUser()

const { releaseTag, gitCommitHash } = useStatus()

function goBack() {
  window.history.back()
}

async function signOut() {
  resetCurrentUser()

  const returnTo = encodeURI(window.location.origin + "/sign-in")
  return logout({
    logoutParams: {
      returnTo,
    },
  })
}
</script>

<style scoped></style>
