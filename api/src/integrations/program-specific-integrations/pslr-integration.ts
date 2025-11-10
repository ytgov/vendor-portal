import axios from "axios"

import { PSLR_API_URL } from "@/config"

const pslrApi = axios.create({
  baseURL: PSLR_API_URL,
})

export type PSLRSubmission = {
  id: string
  program_pslr4_id: string
  vendor_id: string
  status: string
  payment_status: string
  request_amount: number
  first_name: string
  last_name: string
  position_title: string
  employee_name: string
  birth_date: string
  hire_date: string
  email: string
  mailing_address: string
  submission_date: string
  request_date: string
  request_end_date: string
  hourly_rate: number
  request_hours: number
  paid_rate: number
  paid_hours: number
  paid_amount: number
  notes: string

  pay_stub: File
}

export class PslrPayloadError extends Error {
  constructor(data: unknown) {
    super(`Payload from PSLR is strange or failed for: ${JSON.stringify(data)}`)
    this.name = "PslrPayloadError"
  }
}

export const pslrIntegration = {
  async getSubmissions(vendorId: string): Promise<PSLRSubmission[]> {
    const { data } = await pslrApi.get(`/submissions/${vendorId}`)
    return data.data
  },
  async createSubmission(vendorId: string, attributes: Partial<PSLRSubmission>) {
    // TODO: This may not work as expected, pay stub may not be handled as expected

    try {
      const { data } = await pslrApi
        .post(`/submissions/${vendorId}`, attributes, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => {
          if (error.response) console.log("Error creating PSLR submission:", error.response.data)
          throw error
        })
      return data
    } catch (error) {
      console.log("Error creating PSLR submission:", error)

      return null
    }
  },
  async updateSubmission(
    vendorId: string,
    submissionId: string,
    attributes: Partial<PSLRSubmission>
  ) {
    // TODO: This may not work as expected, this endpoint may not exist?
    const { data } = await pslrApi.put(`/submissions/${vendorId}/${submissionId}`, attributes)
    return data
  },
}

export default pslrIntegration
