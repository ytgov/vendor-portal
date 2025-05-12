<template>
  <v-skeleton-loader
    v-if="isLoading || isNil(program)"
    type="table"
  />

  <TabCard
    v-else
    :tabs="tabs"
  >
    <v-tabs-window-item :value="0">
      <v-card>
        <v-card-text>
          <ProgramEditForm :program-id="program.id" />
        </v-card-text>
      </v-card>
    </v-tabs-window-item>
    <v-tabs-window-item :value="1">
      <VendorProgramsDataTableServer
        :where="vendorProgramsAcceptedWhereOptions"
        @click="goToVendorProgramPage"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="2">
      <VendorProgramsDataTableServer
        :where="vendorProgramsPendingWhereOptions"
        @click="goToVendorProgramRequestPage"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="3">
      <div class="d-flex mt-3">
        <DocumentationsSearchableAutocomplete
          v-model="documentationsIds"
          :query="documentationsNotInProgramQuery"
        />
        <v-btn
          color="primary"
          class="ml-4"
          style="height: 40px"
          :disabled="isEmpty(documentationsIds) || isCreatingProgramDocumentations"
          text="Add Documentations"
          @click="createProgramDocumentations"
        />
      </div>
      <ProgramDocumentationsDataTableServer
        ref="programDocumentationsDataTableServer"
        :headers="programDocumentationsDataTableServerHeaders"
        :where="programDocumentationsWhereOptions"
      >
        <template #item.name="{ item }">
          {{ item.documentation.name }}
        </template>
        <template #item.format="{ item }">
          {{ item.documentation.format }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            color="warning"
            size="small"
            text="Remove Documentation"
            @click="removeProgramDocumentation(item.id)"
          />
        </template>
      </ProgramDocumentationsDataTableServer>
    </v-tabs-window-item>
  </TabCard>
</template>

<script setup lang="ts">
import { isEmpty, isNil } from "lodash"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

import {
  VendorProgram,
  VendorProgramStatuses,
  VendorProgramWhereOptions,
} from "@/api/vendor-programs-api"
import programDocumentationsApi, {
  ProgramDocumentationWhereOptions,
} from "@/api/program-documentations-api"

import useSnack from "@/use/use-snack"
import useBreadcrumbs from "@/use/use-breadcrumbs"
import useProgram from "@/use/use-program"
import { DocumentationQueryOptions } from "@/use/use-documentations"

import TabCard from "@/components/common/TabCard.vue"

import ProgramEditForm from "@/components/programs/ProgramEditForm.vue"
import VendorProgramsDataTableServer from "@/components/vendor-programs/VendorProgramsDataTableServer.vue"
import DocumentationsSearchableAutocomplete from "@/components/documentations/DocumentationsSearchableAutocomplete.vue"

import ProgramDocumentationsDataTableServer from "@/components/program-documentations/ProgramDocumentationsDataTableServer.vue"

const props = defineProps<{ programId: string }>()
const programIdNumber = computed(() => parseInt(props.programId))
const { program, isLoading } = useProgram(programIdNumber)

const documentationsIds = ref<number[]>([])

const vendorProgramsAcceptedWhereOptions = computed<VendorProgramWhereOptions>(() => {
  return { programId: programIdNumber.value, status: VendorProgramStatuses.ACCEPTED }
})

const vendorProgramsPendingWhereOptions = computed<VendorProgramWhereOptions>(() => {
  return { programId: programIdNumber.value, status: VendorProgramStatuses.PENDING }
})

const documentationsNotInProgramQuery = computed<DocumentationQueryOptions>(() => {
  return {
    filters: {
      notInProgram: programIdNumber.value,
    },
  }
})

const router = useRouter()

function goToVendorProgramRequestPage(vendorProgram: VendorProgram) {
  router.push({
    name: "administration/VendorProgramRequestPage",
    params: {
      programId: programIdNumber.value,
      vendorId: vendorProgram.vendorId,
      vendorProgramId: vendorProgram.id,
    },
  })
}

function goToVendorProgramPage(vendorProgram: VendorProgram) {
  router.push({
    name: "administration/VendorProgramPage",
    params: {
      programId: programIdNumber.value,
      vendorId: vendorProgram.vendorId,
    },
  })
}

const programDocumentationsDataTableServer = ref<InstanceType<
  typeof ProgramDocumentationsDataTableServer
> | null>(null)

const programDocumentationsDataTableServerHeaders = [
  { title: "Name", key: "name" },
  { title: "Format", key: "format" },
  { title: "", key: "actions", align: "end" as const, sortable: false },
]

const programDocumentationsWhereOptions = computed<ProgramDocumentationWhereOptions>(() => {
  return {
    programId: programIdNumber.value,
  }
})

const snack = useSnack()

async function removeProgramDocumentation(documentationId: number) {
  try {
    await programDocumentationsApi.delete(documentationId)
    await programDocumentationsDataTableServer.value?.refresh()
    snack.success("Program Documentation removed")
  } catch (error) {
    console.error(error)
    snack.error(`Failed to remove Program Documentation: ${error}`)
  }
}

const isCreatingProgramDocumentations = ref(false)

async function createProgramDocumentations() {
  if (isNil(programIdNumber.value)) return
  if (isNil(documentationsIds.value) || isEmpty(documentationsIds.value)) return

  try {
    isCreatingProgramDocumentations.value = true
    for (const documentationId of documentationsIds.value) {
      await programDocumentationsApi.create({ documentationId, programId: programIdNumber.value })
    }
    snack.success("Program Documentations created")
  } catch (error) {
    console.error(error)
    snack.error(`Failed to create Program Documentations: ${error}`)
  } finally {
    isCreatingProgramDocumentations.value = false
  }

  documentationsIds.value = []
  await programDocumentationsDataTableServer.value?.refresh()
}

const tabs = ref([
  { value: 0, title: "Program Details", icon: "mdi-office-building-cog" },
  { value: 1, title: "Approved Vendors", icon: "mdi-storefront-check" },
  { value: 2, title: "Pending Applications", icon: "mdi-storefront-plus" },
  { value: 3, title: "Docs", icon: "mdi-file-sign" },
])

const pageTitle = computed(() => {
  if (isNil(program.value)) {
    return "Loading..."
  }

  return `Manage ${program.value.name} Program`
})

const breadcrumbs = computed(() => {
  if (isNil(program.value)) {
    return [
      {
        title: "Programs",
        to: {
          name: "administration/ProgramsPage",
        },
      },
      { title: "Loading...", to: "" },
    ]
  }

  return [
    {
      title: "Programs",
      to: {
        name: "administration/ProgramsPage",
      },
    },
    {
      title: `Manage ${program.value.name}`,
      to: "",
    },
  ]
})

useBreadcrumbs(pageTitle, breadcrumbs)
</script>
