export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    nextCursor?: string
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}
