<template>
  <v-skeleton-loader
    v-if="isNil(program) || isLoading"
    type="chip"
  />
  <div v-else>
    {{ program.name }}
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue"
import { isNil } from "lodash"

import useProgram from "@/use/use-program"

const props = defineProps<{
  programId: number
}>()

const { programId } = toRefs(props)
const { program, isLoading } = useProgram(programId)
</script>
