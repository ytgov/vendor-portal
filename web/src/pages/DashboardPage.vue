<template>
  <h2>Dashboard</h2>

  <v-card>
    <v-card-text>
      <p>Welcome to the dashboard!</p>

      <v-list>
        <v-list-item :to="{ name: 'ProfilePage' }"> Go to your profile </v-list-item>
        <v-list-item :to="{ name: 'StatusPage' }">Go to the status page</v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup></script>
