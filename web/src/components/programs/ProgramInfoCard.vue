<template>
  <v-skeleton-loader
    v-if="isNil(program)"
    type="card"
  />
  <v-card v-else>
    <v-card-title>{{ program.name }}</v-card-title>
    <v-card-subtitle>
      Administered by <strong>{{ program.department }}</strong>
    </v-card-subtitle>
    <v-card-text>
      <div v-html="program.description"></div>
      <v-btn
        v-if="showApply"
        :loading="isLoading"
        color="primary"
        text="Apply"
        @click="goToProgramApply"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { computed } from "vue"

import useProgram from "@/use/use-program"
import { useRouter } from "vue-router"

const props = defineProps<{ programId: string; showApply: boolean }>()
const programIdNumber = computed(() => parseInt(props.programId))
const { program, isLoading } = useProgram(programIdNumber)

const router = useRouter()

function goToProgramApply() {
  router.push({
    name: "programs/ApplyPage",
    params: {
      programId: programIdNumber.value,
    },
  })
}
</script>
