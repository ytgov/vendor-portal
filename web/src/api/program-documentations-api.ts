import http from "@/api/http-client"

import { Documentation } from "@/api/documentations-api"

/** Keep in sync with api/src/models/program-documentation.ts */
export type ProgramDocumentation = {
  id: number
  programId: number
  documentationId: number
  purpose: string | null
  createdAt: string
  updatedAt: string

  // Associations
  documentation: Documentation | null
}

export type ProgramDocumentationWhereOptions = {
  programId?: number
  documentationId?: number
}

/** Keep in sync with scopes in api/src/models/program-documentation.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ProgramDocumentationFiltersOptions = {}

export type ProgramDocumentationQueryOptions = {
  where?: ProgramDocumentationWhereOptions
  filters?: ProgramDocumentationFiltersOptions
  page?: number
  perPage?: number
}

export const programDocumentationsApi = {
  async list(params: ProgramDocumentationQueryOptions = {}): Promise<{
    programDocumentations: ProgramDocumentation[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/program-documentations", { params })
    return data
  },

  async get(
    programDocumentationId: number
  ): Promise<{ programDocumentation: ProgramDocumentation }> {
    const { data } = await http.get(`/api/program-documentations/${programDocumentationId}`)
    return data
  },

  async create(
    attributes: Partial<ProgramDocumentation>
  ): Promise<{ programDocumentation: ProgramDocumentation }> {
    const { data } = await http.post("/api/program-documentations", attributes)
    return data
  },

  async update(
    programDocumentationId: number,
    attributes: Partial<ProgramDocumentation>
  ): Promise<{ programDocumentation: ProgramDocumentation }> {
    const { data } = await http.patch(
      `/api/program-documentations/${programDocumentationId}`,
      attributes
    )
    return data
  },

  async delete(programDocumentationId: number): Promise<void> {
    const { data } = await http.delete(`/api/program-documentations/${programDocumentationId}`)
    return data
  },
}

export default programDocumentationsApi
