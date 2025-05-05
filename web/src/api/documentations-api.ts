import http from "@/api/http-client"

/** Keep in sync with api/src/models/documentation.ts */
export enum DocumentationFormats {
  FILE = "File Upload",
  TEXT = "Text Input",
}

export type Documentation = {
  id: number
  name: string
  description: string | null
  format: DocumentationFormats
  createdAt: string
  updatedAt: string
}

export type DocumentationWhereOptions = {
  name?: string
  format?: DocumentationFormats
}

/** Keep in sync with scopes in api/src/models/documentation.ts */
export type DocumentationFiltersOptions = {
  search?: string | string[]
  inProgram?: number
}

export type DocumentationQueryOptions = {
  where?: DocumentationWhereOptions
  filters?: DocumentationFiltersOptions
  page?: number
  perPage?: number
}

export const documentationsApi = {
  async list(params: DocumentationQueryOptions = {}): Promise<{
    documentations: Documentation[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/documentations", { params })
    return data
  },

  async get(documentationId: number): Promise<{ documentation: Documentation }> {
    const { data } = await http.get(`/api/documentations/${documentationId}`)
    return data
  },

  async create(attributes: Partial<Documentation>): Promise<{ documentation: Documentation }> {
    const { data } = await http.post("/api/documentations", attributes)
    return data
  },

  async update(
    documentationId: number,
    attributes: Partial<Documentation>
  ): Promise<{ documentation: Documentation }> {
    const { data } = await http.patch(`/api/documentations/${documentationId}`, attributes)
    return data
  },

  async delete(documentationId: number): Promise<void> {
    const { data } = await http.delete(`/api/documentations/${documentationId}`)
    return data
  },
}

export default documentationsApi
