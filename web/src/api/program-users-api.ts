import http from "@/api/http-client"

/** Keep in sync with api/src/models/program-user.ts */
export type ProgramUsers = {
  id: number
  programId: number
  userId: number
  roles: number | null
  createdAt: string
  updatedAt: string
}

export type ProgramUsersWhereOptions = {
  programId?: number
  userId?: number
}

/** Keep in sync with scopes in api/src/models/program-user.ts */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ProgramUsersFiltersOptions = {}

export type ProgramUsersQueryOptions = {
  where?: ProgramUsersWhereOptions
  filters?: ProgramUsersFiltersOptions
  page?: number
  perPage?: number
}

export const programUsersApi = {
  async list(params: ProgramUsersQueryOptions = {}): Promise<{
    programUsers: ProgramUsers[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/program-users", { params })
    return data
  },

  async get(programUserId: number): Promise<{ programUser: ProgramUsers }> {
    const { data } = await http.get(`/api/program-users/${programUserId}`)
    return data
  },

  async create(attributes: Partial<ProgramUsers>): Promise<{ programUser: ProgramUsers }> {
    const { data } = await http.post("/api/program-users", attributes)
    return data
  },

  async update(
    programUserId: number,
    attributes: Partial<ProgramUsers>
  ): Promise<{ programUser: ProgramUsers }> {
    const { data } = await http.patch(`/api/program-users/${programUserId}`, attributes)
    return data
  },

  async delete(programUserId: number): Promise<void> {
    const { data } = await http.delete(`/api/program-users/${programUserId}`)
    return data
  },
}

export default programUsersApi
