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
      <component :is="programDescriptionComponent" />
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
import { computed, defineAsyncComponent } from "vue"

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

/*
 Consider putting description in the database. 
 For 5 or more programs this pattern is not good.
*/
const PSLRDescription = defineAsyncComponent(
  () => import("@/components/programs/ecdev-pslr/PSLRDescription.vue")
)

const programDescriptionComponent = computed(() => {
  if (isNil(program.value)) return

  switch (program.value.slug) {
    case "paid-sick-leave-rebate":
      return PSLRDescription
    default:
      return null
  }
})
</script>
