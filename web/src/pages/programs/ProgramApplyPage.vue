<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <ProgramInfoCard
        :program-id="programId"
        :show-apply="false"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Vendor Information</v-card-title>
        <v-card-text>
          <p class="mb-3">
            To apply for this program, you must upload your current Yukon Corporate Online Registry
            (YCOR) Certificate along with your Business License or a CRA Remittance. If your
            business offers a paid sick leave program, please also include that policy in your
            submission.
          </p>
          <p class="mb-5">
            Once you submit the required documents, we will review them and contact you with any
            questions we may have. When your application is approved, you will be notified via email
            and you will be able to submit claims through this portal at that point. This process
            generally takes less than 2 business days.
          </p>

          <ProgramApplyForm
            :program-id="programId"
            @saved="onApply"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"

import ProgramApplyForm from "@/components/programs/ProgramApplyForm.vue"
import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

defineProps<{ programId: string }>()

const router = useRouter()

function onApply() {
  router.push({ name: "programs/ProgramsAvailablePage" })
}

useBreadcrumbs("Apply to a Program", [
  {
    title: "Programs available in this portal",
    to: {
      name: "programs/ProgramsAvailablePage",
    },
  },
  { title: "Apply", to: "" },
])
</script>
