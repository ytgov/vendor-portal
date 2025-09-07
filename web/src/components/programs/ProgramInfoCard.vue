<template>
  <v-skeleton-loader
    v-if="isNil(program)"
    type="card"
  />
  <v-card v-else>
    <v-card-title>{{ program.name }}</v-card-title>
    <v-card-subtitle style="font-size: 1rem; opacity: 1">
      Administered by <strong>{{ program.department }}</strong>
    </v-card-subtitle>
    <v-card-text>
      <div v-html="program.description"></div>
      <v-btn
        v-if="showApply"
        :loading="isLoading"
        class="mt-3"
        color="primary"
        text="Apply"
        @click="goToProgramApply"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { toRefs } from "vue"

import useProgram from "@/use/use-program"
import { useRouter } from "vue-router"

const props = defineProps<{ programSlug: string; showApply: boolean }>()
const { programSlug } = toRefs(props)
const { program, isLoading } = useProgram(programSlug)

const router = useRouter()

function goToProgramApply() {
  router.push({
    path: `/programs/${programSlug.value}/apply`,
  })
}
</script>
