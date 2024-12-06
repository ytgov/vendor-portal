<template>
  <h3 class="mb-3">Administration Home</h3>
  <v-card>
    <v-card-text>
      <v-list>
        <v-list-item
          title="Manage Users"
          :to="{ name: 'administration/UsersPage' }"
          prepend-icon="mdi-account-group"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import useBreadcrumbs from "@/use/use-breadcrumbs"

useBreadcrumbs("Administration Home", [])
</script>
