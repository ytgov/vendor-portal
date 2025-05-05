<template>
  <v-skeleton-loader
    v-if="isNil(user) || isLoading"
    type="chip"
  />
  <v-chip v-else>
    {{ user.displayName }}
  </v-chip>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import useUser from "@/use/use-user"

const props = defineProps<{
  userId: number
}>()

const { userId } = toRefs(props)
const { user, isLoading } = useUser(userId)
</script>
