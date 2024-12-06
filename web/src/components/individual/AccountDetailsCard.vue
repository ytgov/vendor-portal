<template>
  <v-card>
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
          <div class="ml-2 text-subtitle-1"><strong>Name: </strong><br />Michael Johnson</div>
        </div>

        <div class="d-flex mb-3">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-email</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Email: </strong><br />michael@icefoganalytics.com
          </div>
        </div>

        <div class="d-flex">
          <v-icon
            class="mt-2"
            size="40"
            color="#7A9A01"
            >mdi-map</v-icon
          >
          <div class="ml-2 text-subtitle-1">
            <strong>Address: </strong><br />2 Stope Way<br />Whitehorse YT, Y1A0B3
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-text>
      <v-btn
        :to="{ name: 'individual/ProfilePage' }"
        block
        color="secondary"
        >View Profile
      </v-btn>
    </v-card-text>
  </v-card>
</template>
