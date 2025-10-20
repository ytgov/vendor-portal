import path from "path"
import fs from "fs"

import {
  Router,
  type Request,
  type Response,
  type ErrorRequestHandler,
  type NextFunction,
} from "express"
import { UnauthorizedError } from "express-jwt"
import { template } from "lodash"

import { APPLICATION_NAME, GIT_COMMIT_HASH, NODE_ENV, RELEASE_TAG } from "@/config"
import { logger } from "@/utils/logger"
import migrator from "@/db/migrator"

import {
  bodyAuthorizationHoistMiddleware,
  jwtMiddleware,
  ensureAndAuthorizeCurrentUser,
} from "@/middlewares"

import {
  CurrentUserController,
  DocumentationsController,
  HistoriesController,
  ProgramDocumentationsController,
  ProgramsController,
  ProgramUsersController,
  UsersController,
  VendorDocumentations,
  VendorDocumentationsController,
  VendorLinkRequests,
  VendorLinkRequestsController,
  VendorProgramsController,
  VendorsController,
  VendorUsersController,
} from "@/controllers"
import { PSLREmployeeController, PSLRSubmissionController } from "@/controllers/program-specific"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  return res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

router.use("/migrate", migrator.migrationRouter)
router.use("/api", bodyAuthorizationHoistMiddleware, jwtMiddleware, ensureAndAuthorizeCurrentUser)

// Users
router.route("/api/current-user").get(CurrentUserController.show)
router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:id")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

// Documentations
router
  .route("/api/documentations")
  .get(DocumentationsController.index)
  .post(DocumentationsController.create)
router
  .route("/api/documentations/:documentationId")
  .get(DocumentationsController.show)
  .patch(DocumentationsController.update)
  .delete(DocumentationsController.destroy)

// Histories
router.route("/api/histories").get(HistoriesController.index).post(HistoriesController.create)
router
  .route("/api/histories/:historyId")
  .get(HistoriesController.show)
  .patch(HistoriesController.update)
  .delete(HistoriesController.destroy)

// Program Documentations
router
  .route("/api/program-documentations")
  .get(ProgramDocumentationsController.index)
  .post(ProgramDocumentationsController.create)
router
  .route("/api/program-documentations/:programDocumentationId")
  .get(ProgramDocumentationsController.show)
  .patch(ProgramDocumentationsController.update)
  .delete(ProgramDocumentationsController.destroy)

// Program Users
router
  .route("/api/program-users")
  .get(ProgramUsersController.index)
  .post(ProgramUsersController.create)
router
  .route("/api/program-users/:programUserId")
  .get(ProgramUsersController.show)
  .patch(ProgramUsersController.update)
  .delete(ProgramUsersController.destroy)

// Program
router.route("/api/programs").get(ProgramsController.index).post(ProgramsController.create)
router
  .route("/api/programs/:programId")
  .get(ProgramsController.show)
  .patch(ProgramsController.update)
  .delete(ProgramsController.destroy)

// Vendor Documentations
router
  .route("/api/vendor-documentations")
  .get(VendorDocumentationsController.index)
  .post(VendorDocumentationsController.create)
router
  .route("/api/vendor-documentations/:vendorDocumentationId")
  .get(VendorDocumentationsController.show)
  .patch(VendorDocumentationsController.update)
  .delete(VendorDocumentationsController.destroy)
router
  .route("/api/vendor-documentations/:vendorDocumentationId/download")
  .post(VendorDocumentations.DownloadController.create)
  .get(VendorDocumentations.DownloadController.show)

// Vendor Link Requests
router
  .route("/api/vendor-link-requests")
  .get(VendorLinkRequestsController.index)
  .post(VendorLinkRequestsController.create)
router
  .route("/api/vendor-link-requests/:vendorLinkRequestId")
  .get(VendorLinkRequestsController.show)
  .patch(VendorLinkRequestsController.update)
  .delete(VendorLinkRequestsController.destroy)
router
  .route("/api/vendor-link-requests/:vendorLinkRequestId/download/ycor-registration-document")
  .get(VendorLinkRequests.DownloadYcorRegistrationDocumentController.show)
router
  .route("/api/vendor-link-requests/:vendorLinkRequestId/download/most-recent-utility-bill")
  .get(VendorLinkRequests.DownloadMostRecentUtilityBillController.show)

// Vendor Program
router
  .route("/api/vendor-programs")
  .get(VendorProgramsController.index)
  .post(VendorProgramsController.create)
router
  .route("/api/vendor-programs/:vendorProgramId")
  .get(VendorProgramsController.show)
  .patch(VendorProgramsController.update)
  .delete(VendorProgramsController.destroy)

// Vendor Users
router
  .route("/api/vendor-users")
  .get(VendorUsersController.index)
  .post(VendorUsersController.create)
router
  .route("/api/vendor-users/:vendorUserId")
  .get(VendorUsersController.show)
  .patch(VendorUsersController.update)
  .delete(VendorUsersController.destroy)

// Vendors
router.route("/api/vendors").get(VendorsController.index)
router.route("/api/vendors/:vendorId").get(VendorsController.show)

router.route("/api/program/pslr/:vendorId/employees").all(PSLREmployeeController.index)

router
  .route("/api/program/pslr/:vendorId/submissions")
  .get(PSLRSubmissionController.index)
  .post(PSLRSubmissionController.create)

// if no other routes match, return a 404
router.use("/api", (req: Request, res: Response) => {
  console.log(req.url)
  return res.status(404).json({ message: "Not Found" })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof UnauthorizedError) {
    logger.error(err)
    return res.status(err.status).json({ message: err.inner.message })
  }

  /* if (err instanceof DatabaseError) {
    logger.error(err)
    return res.status(422).json({ message: "Invalid query against database." })
  }
 */
  logger.error(err)
  return res.status(500).json({ message: "Internal Server Error" })
})

// if no other non-api routes match, send the pretty 404 page
if (NODE_ENV == "development") {
  router.use("/", (_req: Request, res: Response) => {
    const templatePath = path.resolve(__dirname, "web/404.html")
    try {
      const templateString = fs.readFileSync(templatePath, "utf8")
      const compiledTemplate = template(templateString)
      const result = compiledTemplate({
        applicationName: APPLICATION_NAME,
        releaseTag: RELEASE_TAG,
        gitCommitHash: GIT_COMMIT_HASH,
      })
      return res.status(404).send(result)
    } catch (error) {
      logger.error(error)
      return res.status(500).send(`Error building 404 page: ${error}`)
    }
  })
}

export default router
