
// Respuesta básica de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Parámetros de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Error de API
export class ApiError extends Error {
  code: string;
  details?: any;
  statusCode: number;

  constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
  }
}
