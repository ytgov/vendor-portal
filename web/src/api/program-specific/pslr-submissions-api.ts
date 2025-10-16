import http from "@/api/http-client"

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

  pay_stub: File
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type PSLRSubmissionWhereOptions = {}

// eslint-disable-next-line @typescript-eslint/ban-types
export type PSLRSubmissionFiltersOptions = {}

export type PSLRSubmissionQueryOptions = {
  where?: PSLRSubmissionWhereOptions
  filters?: PSLRSubmissionFiltersOptions
  page?: number
  perPage?: number
}

export const pslrSubmissionsApi = {
  async list(
    vendorId: number | string,
    params: PSLRSubmissionQueryOptions = {}
  ): Promise<{
    data: { data: PSLRSubmission[] }
  }> {
    const { data } = await http.get(`/api/program/pslr/${vendorId}/submissions`, { params })
    return data
  },
  async create(
    vendorId: number | string,
    attributes: Partial<PSLRSubmission>
  ): Promise<{ submission: PSLRSubmission }> {
    const { data } = await http.post(`/api/program/pslr/${vendorId}/submissions`, attributes)
    return data
  },
}

export default pslrSubmissionsApi
