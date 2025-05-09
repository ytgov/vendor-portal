import { reactive, toRefs } from "vue"
import { RouteLocationRaw } from "vue-router"
import { isUndefined } from "lodash"

export type Breadcrumb = {
  title: string
  disabled?: boolean
  exact?: boolean
  to: RouteLocationRaw
}

export const BASE_CRUMB: Breadcrumb = {
  title: "Vendor Portal Home",
  disabled: false,
  to: {
    name: "individual/HomePage",
  },
}

export const ADMIN_CRUMB: Breadcrumb = {
  title: "Administration Dashboard",
  disabled: false,
  exact: true,
  to: { name: "administration/DashboardPage" },
}

// Global state for breadcrumbs
const state = reactive<{
  title?: string
  baseCrumb: Breadcrumb
  breadcrumbs: Breadcrumb[]
}>({
  title: "",
  baseCrumb: BASE_CRUMB,
  breadcrumbs: [],
})

export function useBreadcrumbs(title?: string, breadcrumbs?: Breadcrumb[]) {
  if (!isUndefined(title)) state.title = title
  if (!isUndefined(breadcrumbs)) {
    state.breadcrumbs = [...breadcrumbs]
  }

  return {
    ...toRefs(state),
    update: useBreadcrumbs,
  }
}

export default useBreadcrumbs
