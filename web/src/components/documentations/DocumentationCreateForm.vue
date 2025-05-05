<template>
  <v-skeleton-loader
    v-if="isNil(documentation)"
    type="card"
  />
  <v-form
    v-else
    ref="formRef"
    @submit.prevent="validateAndCreate"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="documentation.name"
          label="Name"
          :rules="[required]"
          @update:model-value="updateIsValid"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="documentation.description"
          label="Description"
          @update:model-value="updateIsValid"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <documentation-format-select
          v-model="documentation.format"
          label="Format"
          :rules="[required]"
          @update:model-value="updateIsValid"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-spacer />

        <v-btn
          :loading="isCreating"
          color="error"
          variant="outlined"
          :to="{ name: 'administration/DocumentationsPage' }"
          text="Go back"
        />
        <v-btn
          type="submit"
          class="ml-3"
          :loading="isCreating"
          :disabled="!isValid"
          color="success"
          text="Create Documentation"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { isNil } from "lodash"
import { ref } from "vue"
import { VForm } from "vuetify/lib/components/index.mjs"

import { required } from "@/utils/validators"
import { Documentation, documentationsApi } from "@/api/documentations-api"

import useSnack from "@/use/use-snack"
import DocumentationFormatSelect from "./DocumentationFormatSelect.vue"

const documentation = ref<Partial<Documentation>>({})

const formRef = ref<InstanceType<typeof VForm> | null>(null)

const isCreating = ref(false)
const isValid = ref(false)

const snack = useSnack()
const emit = defineEmits<{ created: [documentationId: number] }>()

async function updateIsValid() {
  if (formRef.value === null) {
    isValid.value = false
    return
  }

  const { valid } = await formRef.value.validate()
  isValid.value = valid
}

async function validateAndCreate() {
  if (formRef.value === null) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    isCreating.value = true
    const data = await documentationsApi.create(documentation.value)
    emit("created", data.documentation.id)

    snack.notify("Documentation created", {
      color: "success",
    })
  } catch (error) {
    console.error(error)
    snack.notify(`Failed to create documentation: ${error}`, {
      color: "error",
    })
  } finally {
    isCreating.value = false
  }
}
</script>
