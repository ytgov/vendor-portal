<template>
  <v-container
    tag="section"
    class="mt-10"
  >
    <v-row
      justify="center"
      class="mt-10"
    >
      <v-col
        lg="11"
        sm="8"
        xl="7"
      >
        <v-card
          class="elevation-5"
          style="overflow: hidden"
        >
          <v-row>
            <v-col
              lg="7"
              style="background-color: #f9f4d4"
              class="d-none d-md-flex align-center justify-center"
            >
              <div class="d-none d-sm-block">
                <img
                  src="@/assets/logo.svg"
                  alt="Logo"
                  class="d-md-block pl-6"
                />
                <div class="align-center pa-6">
                  <h2
                    class="text-h5 mb-2"
                    style="line-height: 40px"
                  >
                    {{ APPLICATION_NAME }}
                  </h2>
                </div>
              </div>
            </v-col>
            <v-col lg="5">
              <div class="pa-7 pa-sm-8">
                <div
                  style="background-color: #f9f4d4"
                  class="pa-5 d-md-none"
                >
                  <img
                    src="@/assets/logo.svg"
                    alt="Logo"
                    class="d-md-inline"
                  />
                  <h2
                    class="display-1 font-weight-medium"
                    style="line-height: 40px"
                  >
                    {{ APPLICATION_NAME }}
                  </h2>
                </div>

                <h2 class="text-h4 font-weight-bold mt-4">Welcome!</h2>
                <h6 class="text-h6 font-weight-light mt-3 mb-5">
                  Organizations can use this portal to apply for programs offered by the Yukon
                  Government which currently include:
                </h6>

                <ul class="ml-6 mb-5">
                  <li class="font-weight-regular">Paid Sick Leave Rebate</li>
                </ul>

                <v-btn
                  color="primary"
                  @click="vendorSignInClick"
                  >Sign in</v-btn
                >

                <p class="mt-4 text-body-2">
                  New users can
                  <a
                    href="#"
                    style="cursor: pointer"
                    @click="vendorSignUpClick"
                    >create an account</a
                  >
                </p>
                <p class="text-body-2">
                  Get
                  <a
                    href="https://service.support.yukon.ca/servicedesk/customer/portal/3/create/49?from=student&page=sign-in-to-account"
                    target="_blank"
                    >help with your account or password</a
                  >
                </p>
                <p class="text-body-2 mt-4">
                  Yukon Government
                  <a
                    href="#"
                    @click="staffSignInClick"
                    >staff login</a
                  >
                </p>

                <v-alert
                  color="yg_zinc"
                  theme="light"
                  class="mt-6 signin-message d-none"
                >
                  <strong class="font-weight-medium"
                    >Classes starting on or after August 1, 2024?</strong
                  ><br />
                  <span class="font-weight-thin"
                    >We'll begin accepting applications on July 2, 2024, for the 2024/25 academic
                    year.</span
                  >
                </v-alert>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"

import { APPLICATION_NAME } from "@/config"
import useCurrentUser from "@/use/use-current-user"

const { reset: resetCurrentUser } = useCurrentUser()

const { loginWithRedirect } = useAuth0()

onMounted(() => {
  resetCurrentUser()
})

function vendorSignInClick() {
  loginWithRedirect({
    authorizationParams: { connection: "Username-Password-Authentication" },
    appState: { target: "/individual" },
  })
}

function vendorSignUpClick() {
  loginWithRedirect({
    authorizationParams: { screen_hint: "signup", connection: "Username-Password-Authentication" },
    appState: { target: "/individual" },
  })
}

function staffSignInClick() {
  loginWithRedirect({
    authorizationParams: { connection: "YG-Azure-test" },
    appState: { target: "/administration" },
  })
}
</script>

<style>
.signin-message .v-alert__prepend {
  color: white !important;
}
.signin-message .v-alert__content {
  color: white !important;
}
</style>
