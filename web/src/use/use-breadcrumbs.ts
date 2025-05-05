import { isUndefined } from "lodash"
import { reactive, toRefs } from "vue"
import { RouteLocationRaw } from "vue-router"

export type Breadcrumb = {
  title: string
  disabled?: boolean
  exact?: boolean
  to: RouteLocationRaw
}

export const BASE_CRUMB = {
  title: "Vendor Portal Home",
  disabled: false,
  to: {
    name: "individual/HomePage",
  },
}
export const ADMIN_CRUMB = {
  title: "Administration Dashboard",
  disabled: false,
  to: { name: "administration/DashboardPage" },
  exact: true,
}

// Global state for breadcrumbs
const state = reactive<{
  breadcrumbs: Breadcrumb[]
  title: string | null
  showTopBar: boolean
}>({
  breadcrumbs: [],
  title: null,
  showTopBar: true,
})

export function useBreadcrumbs(title?: string, breadcrumbs?: Breadcrumb[], showTopBar?: boolean) {
  if (!isUndefined(title)) state.title = title
  if (!isUndefined(breadcrumbs)) {
    if (state.title != BASE_CRUMB.title) state.breadcrumbs = [BASE_CRUMB, ...breadcrumbs]
    else {
      state.breadcrumbs = []
    }
  }
  state.showTopBar = isUndefined(showTopBar) ? false : (showTopBar ?? false)

  return {
    ...toRefs(state),
    update: useBreadcrumbs,
  }
}

export default useBreadcrumbs
