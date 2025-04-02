import db from "@/db/db-client"

// Models
import Documentation from "@/models/documentation"
import History from "@/models/history"
import Program from "@/models/program"
import ProgramDocumentation from "@/models/program-documentation"
import ProgramUser from "@/models/program-user"
import User from "@/models/user"
import Vendor from "@/models/vendor"
import VendorDocumentation from "@/models/vendor-documentation"
import VendorLinkRequest from "@/models/vendor-link-request"
import VendorProgram from "@/models/vendor-program"
import VendorUser from "@/models/vendor-user"

db.addModels([
  User,
  Documentation,
  History,
  Program,
  Vendor,
  ProgramUser,
  VendorUser,
  ProgramDocumentation,
  VendorDocumentation,
  VendorProgram,
  VendorLinkRequest,
])

// Lazy load scopes
User.establishScopes()

export {
  Documentation,
  History,
  Program,
  ProgramDocumentation,
  ProgramUser,
  User,
  Vendor,
  VendorDocumentation,
  VendorLinkRequest,
  VendorProgram,
  VendorUser,
}

// Special db instance will all models loaded
export default db
