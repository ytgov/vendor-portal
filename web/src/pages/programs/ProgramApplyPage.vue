<template>
  <v-skeleton-loader
    v-if="isNil(program)"
    type="card"
  />
  <v-card v-else>
    <v-stepper
      v-model="step"
      :items="['Welcome', 'Program Information', 'Vendor Information']"
      color="primary"
      elevation="0"
      hide-actions
    >
      <template #item.1>
        <SimpleCard title="Welcome">
          <p class="mb-4 text-h6">
            This wizard will guide you through the process of applying for the
            <strong>{{ program.name }}</strong> program.
          </p>
          <v-divider class="mb-2" />
          <p class="mb-2 text-body-1 font-weight-bold">
            If you run into any issues, please contact us for assistance.
          </p>
          <div class="d-flex">
            <v-spacer />
            <v-btn
              append-icon="mdi-chevron-right"
              text="Continue"
              @click="step = 2"
            />
          </div>
        </SimpleCard>
      </template>
      <template #item.2>
        <v-row>
          <v-col
            cols="12"
            md="12"
          >
            <ProgramInfoCard
              :program-slug="program.slug"
              :show-apply="false"
            />
          </v-col>
        </v-row>
        <div class="d-flex mt-5">
          <v-btn
            color="warning"
            variant="outlined"
            prepend-icon="mdi-chevron-left"
            text="Previous"
            @click="step = 1"
          />
          <v-spacer />
          <v-btn
            append-icon="mdi-chevron-right"
            text="Continue"
            @click="step = 3"
          />
        </div>
      </template>
      <template #item.3>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Vendor Information</v-card-title>
              <v-card-text>
                <p class="mb-3">
                  To apply for this program, you must upload your current Yukon Corporate Online
                  Registry (YCOR) Certificate along with your Business License or a CRA Remittance.
                  If your business offers a paid sick leave program, please also include that policy
                  in your submission.
                </p>
                <p class="mb-5">
                  Once you submit the required documents, we will review them and contact you with
                  any questions we may have. When your application is approved, you will be notified
                  via email and you will be able to submit claims through this portal at that point.
                  This process generally takes less than 2 business days.
                </p>
                <ProgramApplyForm
                  ref="programApplyFormRef"
                  :program-id="program.id"
                  @saved="onApply"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex mt-5">
          <v-btn
            color="warning"
            variant="outlined"
            prepend-icon="mdi-chevron-left"
            text="Previous"
            @click="step = 2"
          />
        </div>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, toRefs } from "vue"
import { useRouter } from "vue-router"

import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"

import ProgramApplyForm from "@/components/programs/ProgramApplyForm.vue"
import ProgramInfoCard from "@/components/programs/ProgramInfoCard.vue"

const props = defineProps<{ programSlug: string }>()
const { programSlug } = toRefs(props)
const { program } = useProgram(programSlug)

const step = ref(1)

const programApplyFormRef = ref<InstanceType<typeof ProgramApplyForm> | null>(null)

const router = useRouter()

function onApply(vendorId: number) {
  router.push({ name: "vendor/HomePage", params: { vendorId } })
}

useBreadcrumbs("Apply", [
  {
    title: "Programs available in this portal",
    to: {
      name: "programs/ProgramsAvailablePage",
    },
  },
  { title: "Apply", to: "" },
])
</script>
