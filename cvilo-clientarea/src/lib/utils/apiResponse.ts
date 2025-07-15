// Types for the new standardized API response format
export interface APIResponse<T = unknown> {
  status: 'success' | 'error' | 'warning' | 'info';
  code: number;
  message: string;
  data?: T;
  error?: unknown;
  timestamp: string;
  path?: string;
  request_id?: string;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page?: number;
  previous_page?: number;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  pagination: PaginationInfo;
}

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ValidationError {
  errors: ErrorDetail[];
}

// Utility functions to handle the new response format

/**
 * Extracts data from the new standardized API response format
 * @param response - The API response
 * @returns The data or null if not found
 */
export function extractData<T>(response: APIResponse<T>): T | null {
  return response.data || null;
}

/**
 * Extracts paginated data from the new response format
 * @param response - The API response
 * @returns The paginated data or null if not found
 */
export function extractPaginatedData<T>(response: APIResponse<PaginatedResponse<T>>): {
  items: T[];
  pagination: PaginationInfo;
} | null {
  if (response.data && 'items' in response.data && 'pagination' in response.data) {
    return {
      items: response.data.items,
      pagination: response.data.pagination,
    };
  }
  return null;
}

/**
 * Checks if the response is successful
 * @param response - The API response
 * @returns True if successful
 */
export function isSuccess(response: APIResponse): boolean {
  return response.status === 'success';
}

/**
 * Checks if the response is an error
 * @param response - API response
 * @returns True if error
 */
export function isError(response: APIResponse): boolean {
  return response.status === 'error';
}

/**
 * Gets the error message from the response
 * @param response - The API response
 * @returns Error message or null
 */
export function getErrorMessage(response: APIResponse): string | null {
  if (isError(response)) {
    if (response.error && typeof response.error === 'object') {
      // Handle validation errors
      if ('errors' in response.error && Array.isArray(response.error.errors)) {
        return response.error.errors.map((e: ErrorDetail) => e.message).join(', ');
      }
      // Handle other structured errors
      return (response.error as { message?: string }).message || response.message;
    }
    return response.message;
  }
  return null;
}

/**
 * Gets validation errors from the response
 * @param response - The API response
 * @returns Array of validation errors or null
 */
export function getValidationErrors(response: APIResponse): ErrorDetail[] | null {
  if (isError(response) && response.error && typeof response.error === 'object' && 'errors' in response.error) {
    return response.error.errors as ErrorDetail[];
  }
  return null;
}

/**
 * Creates a standardized error response for frontend use
 * @param message - Error message
 * @param code - Error code
 * @param details - Additional error details
 * @returns Formatted error response
 */
export function createErrorResponse(
  message: string,
  code: number = 500,
  details?: unknown
): APIResponse {
  return {
    status: 'error',
    code,
    message,
    error: details,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a standardized success response for frontend use
 * @param message - Success message
 * @param data - Response data
 * @returns Formatted success response
 */
export function createSuccessResponse<T>(
  message: string,
  data?: T
): APIResponse<T> {
  return {
    status: 'success',
    code: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wraps axios response to handle both old and new response formats
 * @param axiosResponse - The axios response
 * @returns Standardized API response
 */
export function wrapAxiosResponse<T>(axiosResponse: { data: unknown; status: number }): APIResponse<T> {
  const { data, status } = axiosResponse;
  
  // If the response already follows the new format, return it
  if (data && typeof data === 'object' && data !== null && 'status' in data && 'code' in data) {
    return data as APIResponse<T>;
  }
  
  // Handle legacy format
  if (status >= 200 && status < 300) {
    return createSuccessResponse('Success', data as T) as APIResponse<T>;
  } else {
    return createErrorResponse(
      (data as { message?: string; error?: string })?.message || 
      (data as { message?: string; error?: string })?.error || 
      'Request failed',
      status,
      data
    ) as APIResponse<T>;
  }
}

/**
 * Type guard to check if response has pagination
 * @param response - The API response
 * @returns True if response has pagination
 */
export function hasPagination(response: APIResponse): response is APIResponse<PaginatedResponse<unknown>> {
  return !!(response.data && typeof response.data === 'object' && response.data !== null && 'items' in response.data && 'pagination' in response.data);
}

/**
 * Extracts items from paginated response
 * @param response - The API response
 * @returns Array of items or empty array
 */
export function extractItems<T>(response: APIResponse<PaginatedResponse<T>>): T[] {
  if (hasPagination(response)) {
    return response.data!.items;
  }
  return [];
}

/**
 * Gets pagination info from response
 * @param response - The API response
 * @returns Pagination info or null
 */
export function getPaginationInfo(response: APIResponse<PaginatedResponse<unknown>>): PaginationInfo | null {
  if (hasPagination(response)) {
    return response.data!.pagination;
  }
  return null;
}

/**
 * Formats error details for display
 * @param errorDetails - Array of error details
 * @returns Formatted error message
 */
export function formatErrorDetails(errorDetails: ErrorDetail[]): string {
  return errorDetails
    .map(error => {
      if (error.field) {
        return `${error.field}: ${error.message}`;
      }
      return error.message;
    })
    .join('\n');
}

/**
 * Checks if response has field-specific validation errors
 * @param response - The API response
 * @param field - Field name to check
 * @returns Error message for the field or null
 */
export function getFieldError(response: APIResponse, field: string): string | null {
  const validationErrors = getValidationErrors(response);
  if (validationErrors) {
    const fieldError = validationErrors.find(error => error.field === field);
    return fieldError?.message || null;
  }
  return null;
}

/**
 * Creates a user-friendly error message from API response
 * @param response - The API response
 * @returns User-friendly error message
 */
export function getUserFriendlyError(response: APIResponse): string {
  if (!isError(response)) {
    return '';
  }

  // Handle validation errors
  const validationErrors = getValidationErrors(response);
  if (validationErrors && validationErrors.length > 0) {
    return formatErrorDetails(validationErrors);
  }

  // Handle general errors
  return getErrorMessage(response) || 'An unexpected error occurred';
} 