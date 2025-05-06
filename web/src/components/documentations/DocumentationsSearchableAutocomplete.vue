<template>
  <v-autocomplete
    :model-value="modelValue"
    :loading="isLoading"
    :items="documentations"
    item-value="id"
    item-title="name"
    label="Click here to select"
    auto-select-first
    chips
    clearable
    multiple
    @update:model-value="emit('update:modelValue', $event)"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { isUndefined } from "lodash"
import { computed } from "vue"

import { MAX_PER_PAGE } from "@/api/base-api"

import useDocumentations, { type DocumentationQueryOptions } from "@/use/use-documentations"

const props = defineProps<{
  modelValue: number[] | null | undefined
  query?: DocumentationQueryOptions
}>()

const emit = defineEmits<{
  "update:modelValue": [number[] | null | undefined]
}>()

const documentationsQuery = computed<DocumentationQueryOptions>(() => {
  if (isUndefined(props.query)) {
    return {
      perPage: MAX_PER_PAGE,
    }
  }

  return props.query
})

const { documentations, isLoading } = useDocumentations(documentationsQuery)
</script>
