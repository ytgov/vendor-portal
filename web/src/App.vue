<template>
  <v-app>
    <router-view v-if="isUnauthenticatedRoute"></router-view>
    <!--
      NOTE: current user will always be defined when the authenticated router view loads.
    -->
    <router-view v-else-if="isReady || isErrored" />
    <PageLoader
      v-else-if="isLoadingCurrentUser"
      message="Fetching and syncing user"
    />
    <PageLoader
      v-else-if="isLoadingAuth0"
      message="Checking authentication status ..."
    />
    <PageLoader
      v-else
      message="Vendor Portal"
    />
    <AppSnackbar />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onErrorCaptured, ref, watch } from "vue"
import { useAuth0 } from "@auth0/auth0-vue"
import { useRoute, useRouter } from "vue-router"

import ApiError from "@/api/api-error"

import useCurrentUser from "@/use/use-current-user"

import PageLoader from "@/components/common/PageLoader.vue"
import AppSnackbar from "@/components/common/AppSnackbar.vue"

const route = useRoute()
const isUnauthenticatedRoute = computed(() => route.meta.requiresAuth === false)

const { isLoading: isLoadingAuth0, isAuthenticated } = useAuth0()
const { isLoading: isLoadingCurrentUser, fetch } = useCurrentUser()

const isReady = ref(false)
const isErrored = ref(false)
const router = useRouter()

watch(
  () => [isLoadingAuth0.value, isAuthenticated.value],
  async ([isLoad, isAuth]) => {
    if (isLoad === true) return

    if (isAuth === true) {
      try {
        console.log("Loading current user")
        await fetch()
        isReady.value = true

        if (route.name == "SignInPage") {
          //if (isSystemAdmin.value == true)
          //router.push({ name: "administration/DashboardPage" })
          //else router.push({ name: "individual/HomePage" })
        }
      } catch (error) {
        console.log("Failed to load current user:", error)
        isErrored.value = true
        await router.isReady()
        //await router.push({ name: "UnauthorizedPage" })
        await router.push({ name: "SignInPage" })
      }
    } else if (!isUnauthenticatedRoute.value === false) {
      isReady.value = true
    } else {
      isReady.value = true
    }
  },
  { immediate: true }
)

onErrorCaptured((error: Error) => {
  if (error instanceof ApiError) {
    redirectToAppropriateErrorPage(error.status)
  } else {
    console.error(`Unhandled error: ${error}`, { error })
  }
})

function redirectToAppropriateErrorPage(httpErrorCode: number) {
  if (httpErrorCode === 400 || httpErrorCode === 422) return

  switch (httpErrorCode) {
    case 401:
      return router.replace({
        name: "SignInPage",
      })
    case 403:
      return router.replace({
        name: "errors/ForbiddenPage",
      })
    case 404:
      return router.replace({
        name: "errors/NotFoundPage",
      })
    default:
      return router.replace({
        name: "errors/InternalServerErrorPage",
      })
  }
}
</script>
