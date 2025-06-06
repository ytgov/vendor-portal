<template>
  <v-skeleton-loader
    v-if="isNil(program)"
    type="card"
  />
  <v-form
    v-else
    ref="formRef"
    v-model="isValid"
    @submit.prevent="validateAndSave"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="program.name"
          label="Name"
          :rules="[required]"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-checkbox
          v-model="program.isActive"
          label="Is Active"
          :rules="[required]"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="program.department"
          label="Depertment"
          :rules="[required]"
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="program.offeredBy"
          label="Offered By"
          :rules="[required]"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-textarea
          v-model="program.description"
          label="Description"
          hide-details
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-spacer />
        <v-btn
          :loading="isUpdating"
          color="error"
          variant="outlined"
          :to="{ name: 'administration/ProgramsPage' }"
          text="Go back"
        />
        <v-btn
          type="submit"
          class="ml-3"
          :loading="isUpdating"
          :disabled="!isValid"
          color="success"
          text="Update"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref, toRefs } from "vue"
import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"

import useSnack from "@/use/use-snack"
import useProgram from "@/use/use-program"

const props = defineProps<{ programId: number }>()
const { programId } = toRefs(props)

const { program, save } = useProgram(programId)

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const isValid = ref(false)
const isUpdating = ref(false)

const snack = useSnack()
const emit = defineEmits<{ updated: [programId: number] }>()

async function validateAndSave() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isUpdating.value = true

    const program = await save()
    emit("updated", program.id)

    snack.notify("Program updated", {
      color: "success",
    })
  } catch (error) {
    console.error(error)
    snack.notify(`Failed to update program: ${error}`, {
      color: "error",
    })
  } finally {
    isUpdating.value = false
  }
}
</script>
