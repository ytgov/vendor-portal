<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(currentUser)"
    type="image"
  />
  <v-card
    v-else
    class="mb-5"
  >
    <v-card-title>My Account</v-card-title>
    <v-card-text>
      <div>
        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-account</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Name: </strong><br />{{ currentUser?.displayName }}
          </div>
        </div>

        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-email</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Email: </strong><br />{{ currentUser?.email }}
          </div>
        </div>

        <!-- <div class="d-flex">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-map</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Address: </strong><br />2 Stope Way<br />Whitehorse YT, Y1A0B3
          </div>
        </div> -->
      </div>
    </v-card-text>
    <v-card-text>
      <v-row>
        <!-- <v-col cols="6">
          <v-btn
            :to="{ name: 'individual/ProfilePage' }"
            block
            color="secondary"
            >Edit Profile
          </v-btn>
        </v-col> -->
        <v-col cols="6">
          <v-btn
            block
            color="warning"
            :to="{ name: 'vendor/LinkPage' }"
            >Link to Vendor</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"

import useCurrentUser from "@/use/use-current-user"

const { currentUser, isLoading } = useCurrentUser()
</script>
