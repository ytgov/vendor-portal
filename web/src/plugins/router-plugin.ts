import { createRouter, createWebHistory } from "vue-router"
import { useAuth0 } from "@auth0/auth0-vue"

import { APPLICATION_NAME } from "@/config"
import routes from "@/routes"
import useCurrentUser from "@/use/use-current-user"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  document.title = `${APPLICATION_NAME} ${to.meta.title ? " - " + to.meta.title : ""}`
  
  if (to.meta.requiresAuth === false) return true

  const { checkSession, isAuthenticated } = useAuth0()
  await checkSession()

  if (to.meta.requiresAdmin === true || to.meta.requiresUser === true) {
    const { currentUser, isSystemAdmin, isSystemUser, fetch } = useCurrentUser()

    if (!currentUser.value) await fetch()
    if (isSystemAdmin.value === true && to.meta.requiresAdmin === true) return true
    if (isSystemUser.value === true && to.meta.requiresUser === true) return true

    return "/errors/unauthorized"
  } else {
    console.log("Admin not required")
  }

  if (isAuthenticated.value) return true

  console.log("You need to login")
  return "/"
})

export default router
