<template>
  <v-dialog
    v-model="showDialog"
    width="600"
  >
    <v-form
      ref="formRef"
      @submit.prevent="updateSubmission"
    >
      <v-card v-if="submission">
        <v-card-title class="mb-0 d-flex">
          Submission Details
          <v-chip
            class="ml-3"
            color="success"
            size="small"
            style="margin-top: 2px"
          >
            {{ submission.status }}
          </v-chip>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="tonal"
            title="Close"
            @click="close"
          >
            <v-icon size="21">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2">
          <v-row class="text-subtitle-1">
            <v-col cols="6">
              <div class="mb-2">
                <strong>Employee Name / Birth Date:</strong>
                <br />
                {{ submission.employee_name }} / {{ submission.birth_date }}
              </div>
              <div class="mb-2">
                <strong>Submitted On:</strong>
                <br />
                {{ submission.submission_date }}
              </div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="submission.email"
                class="mb-2"
                label="Employee Email"
                hide-details
              />
              <div class="mb-2">
                <strong>Date Range:</strong>
                <br />{{ submission.request_date }} -
                {{ submission.request_end_date }}
              </div>
            </v-col>
            <v-divider />
            <v-col cols="12">
              <v-text-field
                v-model="submission.position_title"
                class="mb-2"
                label="Position Title"
                hide-details
              />
              <v-text-field
                v-model="submission.hire_date"
                class="mb-2"
                label="Hire Date"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="mb-2">
                <strong>Request:</strong>
                <br />
                {{ formatMoney(submission.hourly_rate, 3) }}/hour x
                {{ submission.request_hours }} hours =
                {{ formatMoney(submission.request_amount, 2) }}
              </div>
              <div class="mb-2">
                <strong>Payment:</strong>
                <br />
                {{ formatMoney(submission.paid_rate, 3) }}/hour x {{ submission.paid_hours }} hours
                =
                {{ formatMoney(submission.paid_amount, 2) }}
              </div>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="submission.mailing_address"
                class="mb-2"
                label="Mailing Address"
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              class="d-flex"
            >
              <v-spacer />
              <v-btn
                text="Save Changes"
                type="submit"
                :loading="isUpdating"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue"
import { useRouteQuery } from "@vueuse/router"
import { VForm } from "vuetify/lib/components"

import { PSLRSubmission } from "@/api/program-specific/paid-sick-leave-rebate/submissions-api"
import submissionsApi from "@/api/program-specific/paid-sick-leave-rebate/submissions-api"
import { booleanTransformer } from "@/utils/use-route-query-transformers"

import useSnack from "@/use/use-snack"

const props = defineProps<{ submission: PSLRSubmission }>()

const emit = defineEmits<{ updated: [PSLRSubmission] }>()

const { submission } = toRefs(props)

const showDialog = useRouteQuery<string, boolean>("showSubmissionAttributesDialog", "false", {
  transform: booleanTransformer,
})

function show() {
  showDialog.value = true
}

function close() {
  showDialog.value = false
}

function formatMoney(amount: number, minimumFractionDigits: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
  }).format(amount)
}

const isUpdating = ref(false)
const formRef = ref<InstanceType<typeof VForm> | null>(null)
const snack = useSnack()

async function updateSubmission() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isUpdating.value = true
    const { submission: updatedSubmission } = await submissionsApi.update(
      submission.value.vendor_id,
      submission.value.id,
      submission.value
    )
    emit("updated", updatedSubmission)
    close()
    snack.success("Submission updated")
  } catch (error) {
    console.log(error)
    snack.error("Failed to update submission")
  } finally {
    isUpdating.value = false
  }
}

defineExpose({ show, close })
</script>
