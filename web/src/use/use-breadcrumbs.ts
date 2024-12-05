import { isUndefined } from "lodash"
import { reactive, toRefs } from "vue"
import { RouteLocationRaw } from "vue-router"

export type Breadcrumb = {
  title: string
  disabled?: boolean
  exact?: boolean
  to: RouteLocationRaw
}

const BASE_CRUMB = {
  title: "Vendor Portal",
  disabled: false,
  to: {
    name: "individual/HomePage",
  },
}
const ADMIN_BASE_CRUMB = {
  title: "Vendor Portal",
  disabled: false,
  to: {
    name: "administration/DashboardPage",
  },
}

// Global state for breadcrumbs
const state = reactive<{
  breadcrumbs: Breadcrumb[]
}>({
  breadcrumbs: [],
})

export function useBreadcrumbs(breadcrumbs?: Breadcrumb[], useAdmin = false) {
  if (!isUndefined(breadcrumbs)) {
    state.breadcrumbs = [useAdmin ? ADMIN_BASE_CRUMB : BASE_CRUMB, ...breadcrumbs]
  }

  return {
    ...toRefs(state),
    update: useBreadcrumbs,
  }
}

export default useBreadcrumbs
