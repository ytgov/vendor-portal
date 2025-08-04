import { type RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "SignInPage",
    component: () => import("@/pages/SignInPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/callback",
    name: "CallbackPage",
    component: () => import("@/pages/CallbackPage.vue"),
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
        children: [
          {
            path: "",
            name: "administration/ProgramsPage",
            component: () => import("@/pages/administration/programs/ProgramsManagePage.vue"),
          },
          {
            path: ":programId",
            name: "administration/ProgramManagePage",
            component: () => import("@/pages/administration/programs/ProgramManagePage.vue"),
            props: true,
          },
          {
            path: ":programId/vendors/:vendorId",
            name: "administration/VendorProgramPage",
            component: () =>
              import("@/pages/administration/programs/vendors/VendorProgramPage.vue"),
            props: true,
          },
          {
            path: ":programId/vendors/:vendorId/request/:vendorProgramId",
            name: "administration/VendorProgramRequestPage",
            component: () =>
              import("@/pages/administration/programs/vendors/VendorProgramRequestPage.vue"),
            props: true,
          },
        ],
      },
      {
        path: "documentations",
        name: "administration/DocumentationsPage",
        component: () =>
          import("@/pages/administration/documentations/DocumentationsManagePage.vue"),
      },
      {
        path: "documentations/create",
        name: "administration/DocumentationCreatePage",
        component: () =>
          import("@/pages/administration/documentations/DocumentationCreatePage.vue"),
      },
      {
        path: "vendor-link-requests",
        name: "administration/VendorLinkRequestsManagePage",
        component: () =>
          import("@/pages/administration/vendor-link-requests/VendorLinkRequestsManagePage.vue"),
        props: true,
      },
      {
        path: "vendor-users",
        name: "administration/VendorUsersManagePage",
        component: () => import("@/pages/administration/vendor-users/VendorUsersManagePage.vue"),
        props: true,
      },
      {
        path: "vendor-link-requests/:vendorLinkRequestId",
        name: "administration/VendorLinkRequestPage",
        component: () =>
          import("@/pages/administration/vendor-link-requests/VendorLinkRequestPage.vue"),
        props: true,
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
        name: "programs/ProgramsAvailablePage",
        component: () => import("@/pages/programs/ProgramsAvailablePage.vue"),
      },
      {
        path: ":programId/apply",
        name: "programs/ApplyPage",
        component: () => import("@/pages/programs/ProgramApplyPage.vue"),
        props: true,
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
        props: true,
      },
      {
        path: ":vendorId",
        name: "vendor/HomePage",
        component: () => import("@/pages/vendor/VendorViewPage.vue"),
        props: true,
      },
      {
        path: ":vendorId/programs/",
        name: "vendor/ProgramPage",
        component: () => import("@/pages/vendor/ProgramPage.vue"),
        props: true,

        children: [
          {
            path: "paid-sick-leave-rebate",
            name: "vendor/programs/PaidSickLeaveHome",
            component: () =>
              import("@/components/program-specific/paid-sick-leave-rebate/PaidSickLeaveHome.vue"),
            props: true,
          },
          {
            path: "paid-sick-leave-rebate/new",
            name: "vendor/programs/PaidSickLeaveNew",
            component: () =>
              import("@/components/program-specific/paid-sick-leave-rebate/PaidSickLeaveNew.vue"),
            props: true,
          },
        ],
      },

      /* {
        path: ":vendorId/programs/:programId", // _TODO_ switch to :slug
        name: "vendor-program/VendorProgramPage",
        component: () => import("@/pages/vendor-programs/VendorProgramPage.vue"),
        props: true,
      }, */
      {
        path: ":vendorId/programs/:programId/submissions/:submissionId", // _TODO_ switch to :slug
        name: "vendor-program/SubmissionViewPage",
        component: () => import("@/pages/vendor-programs/VendorProgramSubmissionViewPage.vue"),
        props: true,
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
    name: "errors/UnauthorizedPage",
    component: () => import("@/pages/errors/UnauthorizedPage.vue"),
    meta: {
      title: "Unauthorized",
      requiresAuth: false,
    },
  },
  {
    path: "/errors/forbidden",
    name: "errors/ForbiddenPage",
    component: () => import("@/pages/errors/ForbiddenPage.vue"),
    meta: {
      title: "Forbidden",
      requiresAuth: false,
    },
  },
  {
    path: "/errors/internal-server-error",
    name: "errors/InternalServerErrorPage",
    component: () => import("@/pages/errors/InternalServerErrorPage.vue"),
    meta: {
      title: "Internal Server Error",
      requiresAuth: false,
    },
  },
  {
    path: "/errors/not-found",
    name: "errors/NotFoundPage",
    component: () => import("@/pages/errors/NotFoundPage.vue"),
    meta: {
      title: "Not Found",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/errors/not-found",
  },
]

export default routes
