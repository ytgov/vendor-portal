import qs from "qs"
import axios from "axios"

import { API_BASE_URL } from "@/config"
import auth0 from "@/plugins/auth0-plugin"
import ApiError from "@/api/api-error"

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, {
        arrayFormat: "brackets",
        strictNullHandling: true,
      })
    },
  },
})

httpClient.interceptors.request.use(async (config) => {
  // Only add the Authorization header to requests that start with "/api"
  if (config.url?.startsWith("/api")) {
    const accessToken = await auth0.getAccessTokenSilently()
    config.headers["Authorization"] = `Bearer ${accessToken}`
  }

  return config
})

// Any status codes that falls outside the range of 2xx causes this function to trigger
httpClient.interceptors.response.use(null, async (error) => {
  if (error?.error === "login_required") {
    throw new ApiError("You must be logged in to access this endpoint", 401)
  } else if (error?.response?.data?.message) {
    throw new ApiError(error.response.data.message, error.response.status)
  } else if (error.message) {
    throw new ApiError(error.message, error.response?.status || 500)
  } else {
    throw new ApiError("An unknown error occurred", error.response?.status || 500)
  }
})

export default httpClient
