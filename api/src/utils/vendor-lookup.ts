import { API_GATEWAY_KEY } from "@/config"
import axios from "axios"

const VENDOR_API_URL = "https://api.gov.yk.ca/finance/api/v1/vendor"

const AUTH_HEADER = { "Ocp-Apim-Subscription-Key": API_GATEWAY_KEY }

export class QuestService {
  async findVendor(term: string) {
    const body = { term: term }
    return axios
      .post(`${VENDOR_API_URL}/search`, body, { headers: AUTH_HEADER })
      .then(async (resp) => {
        return resp.data.data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }

  async getVendor(vendor_id: string) {
    return axios
      .get(`${VENDOR_API_URL}/${vendor_id}`, { headers: AUTH_HEADER })
      .then(async (resp) => {
        return resp.data.data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
}
