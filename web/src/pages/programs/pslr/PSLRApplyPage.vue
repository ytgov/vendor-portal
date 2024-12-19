<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <ProgramInfoCard :show-apply="false" />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-card>
        <v-card-title>Application Form</v-card-title>
        <v-card-text>
          <p class="mb-3">
            To apply for this program, you must upload your current Yukon Corporate Online Registry
            (YCOR) Certificate along with your Business License and a CRA Remittance. If your
            business offers a paid sick leave program, please also include that policy in your
            submission.
          </p>
          <p class="mb-3">
            Once you submit the required documents, we will review them and contact you with any
            questions we may have. When your application is approved, you will be notified via email
            and you will be able to submit claims through this portal at that point. This process
            generally takes less than 2 business days.
          </p>

          <v-form @submit.prevent="submitClick">
            <VendorSelect v-model="vendorId" />

            <v-file-input
              v-model="ycorFile"
              label="YCOR Certificate (required)"
              required
            />

            <v-file-input
              v-model="businessLicenceFile"
              label="Business license"
            />
            <v-file-input
              v-model="craFile"
              label="CRA remittance"
            />
            <v-file-input
              v-model="policyFile"
              label="Paid sick leave policy"
            />

            <v-btn
              :disabled="!isValid"
              type="submit"
              >Apply</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { isNil } from "lodash"
import { useRouter } from "vue-router"

import ProgramInfoCard from "@/components/programs/ecdev-pslr/ProgramInfoCard.vue"
import useSnack from "@/use/use-snack"
import VendorSelect from "@/components/vendor/VendorSelect.vue"

const snack = useSnack()
const router = useRouter()

const vendorId = ref(null)
const ycorFile = ref(null)
const businessLicenceFile = ref(null)
const craFile = ref(null)
const policyFile = ref(null)

const isValid = computed(() => {
  return (
    !isNil(ycorFile.value) &&
    !isNil(vendorId.value) &&
    (!isNil(businessLicenceFile.value) || !isNil(craFile.value))
  )
})

function submitClick() {
  if (isValid.value) {
    snack.success("Paid Sick Leave Rebate Application Submitted")
    router.push({ name: "vendor/HomePage", params: { vendorId: "CDICEFOGANAL" } })
  }
}
</script>
