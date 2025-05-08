import { stripTrailingSlash } from "@/utils/strip-trailing-slash"

export const ENVIRONMENT = import.meta.env.MODE

const prodConfig = {
  domain: "https://yukon.eu.auth0.com",
  clientId: "mNqPwPZ5M1VXkEH6e8OgEaxmmWfxecwo",
  audience: "generic-production",
  apiBaseUrl: "",
  applicationName: "Vendor Portal",
  publicLoginConnection: "",
  staffLoginConnection: "",
}

const uatConfig = {
  domain: "https://sign-in.service-uat.yukon.ca",
  clientId: "Cy5v2HVLPvet9hIcWUbITr79o5hYf2b3",
  audience: "generic-uat",
  apiBaseUrl: "",
  applicationName: "Vendor Portal",
  publicLoginConnection: "",
  staffLoginConnection: "",
}

const devConfig = {
  domain: "https://dev-0tc6bn14.eu.auth0.com",
  clientId: "SaiIQgQuVedvs250Pyu9fhmS8IYfIDBT",
  audience: "testing",
  apiBaseUrl: "http://localhost:3000",
  applicationName: "Vendor Portal - DEV",
  publicLoginConnection: "Username-Password-Authentication",
  staffLoginConnection: "YG-Azure-test",
}

const localProductionConfig = {
  domain: "https://dev-0tc6bn14.eu.auth0.com",
  clientId: "SaiIQgQuVedvs250Pyu9fhmS8IYfIDBT",
  audience: "testing",
  apiBaseUrl: "http://localhost:8080",
  applicationName: "Vendor Portal - DEV (production)",
  publicLoginConnection: "",
  staffLoginConnection: "",
}

let config = prodConfig

if (ENVIRONMENT === "production" && window.location.host === "localhost:8080") {
  config = localProductionConfig
} else if (window.location.host === "localhost:8080") {
  config = devConfig
} else if (window.location.host == "yg-wrap-uat.azurewebsites.net") {
  config = uatConfig
}

export const APPLICATION_NAME = config.applicationName

export const API_BASE_URL = config.apiBaseUrl

export const AUTH0_DOMAIN = stripTrailingSlash(config.domain)
export const AUTH0_AUDIENCE = config.audience
export const AUTH0_CLIENT_ID = config.clientId

export const PUBLIC_LOGIN_CONNECTION = config.publicLoginConnection || ""
export const STAFF_LOGIN_CONNECTION = config.staffLoginConnection || ""
