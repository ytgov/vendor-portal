import http from "@/api/http-client"

/** Keep in sync with api/src/models/history.ts */
export type History = {
  id: number
  entityId: number
  entityType: string
  title: string
  subtitle: number | null
  details: string | null
  createdAt: string
  updatedAt: string
}

export type HistoryWhereOptions = {
  entityId?: number
  entityType?: string
}

/** Keep in sync with scopes in api/src/models/history.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type HistoryFiltersOptions = {}

export type HistoryQueryOptions = {
  where?: HistoryWhereOptions
  filters?: HistoryFiltersOptions
  page?: number
  perPage?: number
}

export const historiesApi = {
  async list(params: HistoryQueryOptions = {}): Promise<{
    histories: History[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/histories", { params })
    return data
  },

  async get(historyId: number): Promise<{ history: History }> {
    const { data } = await http.get(`/api/histories/${historyId}`)
    return data
  },

  async create(attributes: Partial<History>): Promise<{ history: History }> {
    const { data } = await http.post("/api/histories", attributes)
    return data
  },

  async update(historyId: number, attributes: Partial<History>): Promise<{ history: History }> {
    const { data } = await http.patch(`/api/histories/${historyId}`, attributes)
    return data
  },

  async delete(historyId: number): Promise<void> {
    const { data } = await http.delete(`/api/histories/${historyId}`)
    return data
  },
}

export default historiesApi
