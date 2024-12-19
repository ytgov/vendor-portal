import { type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "SignInPage",
    component: () => import("@/pages/SignInPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/administration",
    component: () => import("@/layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "administration/DashboardPage",
        component: () => import("@/pages/administration/DashboardPage.vue"),
      },
      {
        path: "profile",
        name: "administration/ProfilePage",
        component: () => import("@/pages/ProfilePage.vue"),
        meta: { title: "Profile" },
      },
      {
        path: "users",
        name: "administration/UsersPage",
        component: () => import("@/pages/users/UsersPage.vue"),
      },
      {
        path: "users/new",
        name: "administration/UserNewPage",
        component: () => import("@/pages/users/UserNewPage.vue"),
      },
      {
        path: "users/:userId/edit",
        name: "administration/UserEditPage",
        component: () => import("@/pages/users/UserEditPage.vue"),
        props: true,
      },
      {
        path: "programs",
        name: "administration/ProgramsPage",
        component: () => import("@/pages/programs/ProgramsManagePage.vue"),
      },
      {
        path: "programs/pslr",
        name: "administration/PSLRRequestsPage",
        component: () => import("@/pages/programs/pslr/ManageRequestPage.vue"),
      },
      {
        path: "programs/pslr/:id",
        name: "administration/PSLRManageRequestDetailPage",
        component: () => import("@/pages/programs/pslr/ManageRequestDetailPage.vue"),
      },
    ],
  },
  {
    path: "/programs",
    component: () => import("@/layouts/DefaultLayout.vue"),
    meta: { requiresUser: true },
    children: [
      {
        path: "",
        name: "programs/HomePage",
        component: () => import("@/pages/programs/ProgramListPage.vue"),
      },
      {
        path: "paid-sick-leave-rebate",
        name: "programs/PSLRApplyPage",
        component: () => import("@/pages/programs/pslr/PSLRApplyPage.vue"),
      },
    ],
  },

  {
    path: "/individual",
    component: () => import("@/layouts/DefaultLayout.vue"),
    meta: { requiresUser: true },
    children: [
      {
        path: "",
        name: "individual/HomePage",
        component: () => import("@/pages/individual/HomePage.vue"),
      },
      {
        path: "profile",
        name: "individual/ProfilePage",
        component: () => import("@/pages/ProfilePage.vue"),
      },
    ],
  },
  {
    path: "/vendor",
    component: () => import("@/layouts/DefaultLayout.vue"),
    children: [
      {
        path: "link",
        name: "vendor/LinkPage",
        component: () => import("@/pages/vendor/LinkPage.vue"),
      },
      {
        path: ":vendorId",
        name: "vendor/HomePage",
        component: () => import("@/pages/vendor/HomePage.vue"),
      },
      {
        path: ":vendorId/programs/EcDev-PSLR",
        name: "vendor/PSLRVendorPage",
        component: () => import("@/pages/programs/pslr/PSLRVendorPage.vue"),
      },
      {
        path: ":vendorId/programs/EcDev-PSLR/submissions/:submissionId",
        name: "vendor/PSLRSubmissionViewPage",
        component: () => import("@/pages/programs/pslr/PSLRSubmissionViewPage.vue"),
      },
    ],
  },
  {
    path: "/status",
    name: "StatusPage",
    component: () => import("@/pages/StatusPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/errors/unauthorized",
    name: "UnauthorizedPage",
    component: () => import("@/pages/UnauthorizedPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFoundPage",
    component: () => import("@/pages/NotFoundPage.vue"),
    meta: { requiresAuth: false },
  },
]

export default routes
