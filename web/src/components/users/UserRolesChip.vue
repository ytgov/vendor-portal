<template>
  <div>
    <v-chip
      v-for="(role, index) of roles"
      :key="index"
      :color="getRoleColor(role)"
      class="my-0"
      :text="role"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { UserRoles } from "@/api/users-api"

defineProps<{ roles: UserRoles[] }>()

function getRoleColor(role: UserRoles) {
  switch (role) {
    case UserRoles.USER:
      return "grey"
    case UserRoles.SYSTEM_ADMIN:
      return "blue"
    case UserRoles.PROGRAM_ADMIN:
      return "blue"
    default:
      return "grey"
  }
}
</script>
