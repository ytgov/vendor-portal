<template>
  <v-text-field
    v-model="localValue"
    :readonly="props.readonly"
    @focus="parseCurrency"
    @blur="formatCurrency"
  />
</template>

<script setup>
import { isNull } from "lodash"
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  decimals: {
    type: Number,
    default: 2,
  },
})
const emit = defineEmits(["update:modelValue"])

const localValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      localValue.value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: props.decimals,
      }).format(newValue)
    }
  }
)

if (props.modelValue) {
  localValue.value = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: props.decimals,
  }).format(props.modelValue)
}

const formatCurrency = () => {
  const newVal = cleanNumber(localValue.value)

  if (newVal) {
    localValue.value = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: props.decimals,
    }).format(newVal)

    emit("update:modelValue", newVal)
  } else {
    localValue.value = null
    emit("update:modelValue", null)
  }
}

const parseCurrency = () => {
  if (!props.readonly) {
    const numberValue = cleanNumber(localValue.value)
    localValue.value = isNaN(numberValue) ? null : numberValue
  }
}

function cleanNumber(input) {
  if (input) {
    let i = parseFloat(`${input}`.replace(/[^0-9.]+/g, ""))
    if (isNaN(i) || isNull(i)) return null
    i = Math.round(i * Math.pow(10, props.decimals)) / Math.pow(10, props.decimals)
    return i
  }
  return input
}
</script>
