<template>
  <div style="background-color: #b5d2da; border-bottom: 1px #bbb solid">
    <v-container
      v-if="breadcrumbsWithExactTrueByDefault.length > 0"
      fluid
      class="py-0 pb-2 mt-0 pt-2"
    >
      <v-breadcrumbs
        :items="breadcrumbsWithExactTrueByDefault"
        large
        class="pa-0 mb-0"
      >
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </div>
</template>

<script lang="ts">
export { type Breadcrumb } from "@/use/use-breadcrumbs"
</script>

<script lang="ts" setup>
import { computed } from "vue"

import { type Breadcrumb } from "@/use/use-breadcrumbs"

const props = defineProps<{
  items: Breadcrumb[]
}>()

// Changes https://vuetifyjs.com/en/components/breadcrumbs/ default behavior.
// By default v-breadcrumbs will disable all crumbs up to the current page in a nested paths.
// You can prevent this behavior by using exact: true on each applicable breadcrumb in the items array.
const breadcrumbsWithExactTrueByDefault = computed(() =>
  props.items.map((item) => ({
    ...item,
    exact: item.exact ?? true,
  }))
)
</script>
