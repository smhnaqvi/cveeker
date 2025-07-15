package utils

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// ResponseStatus represents the status of an API response
type ResponseStatus string

const (
	StatusSuccess ResponseStatus = "success"
	StatusError   ResponseStatus = "error"
	StatusWarning ResponseStatus = "warning"
	StatusInfo    ResponseStatus = "info"
)

// ResponseCode represents standard HTTP response codes
type ResponseCode int

const (
	CodeSuccess        ResponseCode = 200
	CodeCreated        ResponseCode = 201
	CodeBadRequest     ResponseCode = 400
	CodeUnauthorized   ResponseCode = 401
	CodeForbidden      ResponseCode = 403
	CodeNotFound       ResponseCode = 404
	CodeConflict       ResponseCode = 409
	CodeValidation     ResponseCode = 422
	CodeInternalError  ResponseCode = 500
	CodeNotImplemented ResponseCode = 501
)

// APIResponse represents a standardized API response structure
type APIResponse struct {
	Status    ResponseStatus `json:"status"`
	Code      ResponseCode   `json:"code"`
	Message   string         `json:"message"`
	Data      interface{}    `json:"data,omitempty"`
	Error     interface{}    `json:"error,omitempty"`
	Timestamp time.Time      `json:"timestamp"`
	Path      string         `json:"path,omitempty"`
	RequestID string         `json:"request_id,omitempty"`
}

// PaginationInfo represents pagination metadata
type PaginationInfo struct {
	CurrentPage  int   `json:"current_page"`
	PerPage      int   `json:"per_page"`
	Total        int64 `json:"total"`
	TotalPages   int64 `json:"total_pages"`
	HasNext      bool  `json:"has_next"`
	HasPrevious  bool  `json:"has_previous"`
	NextPage     *int  `json:"next_page,omitempty"`
	PreviousPage *int  `json:"previous_page,omitempty"`
}

// PaginatedResponse represents a response with pagination
type PaginatedResponse struct {
	Items      interface{}    `json:"items"`
	Pagination PaginationInfo `json:"pagination"`
}

// ErrorDetail represents detailed error information
type ErrorDetail struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message"`
	Code    string `json:"code,omitempty"`
}

// ValidationErrorResponse represents validation error details
type ValidationErrorResponse struct {
	Errors []ErrorDetail `json:"errors"`
}

// ResponseBuilder provides a fluent interface for building API responses
type ResponseBuilder struct {
	response APIResponse
}

// NewResponseBuilder creates a new response builder
func NewResponseBuilder() *ResponseBuilder {
	return &ResponseBuilder{
		response: APIResponse{
			Timestamp: time.Now(),
		},
	}
}

// Status sets the response status
func (rb *ResponseBuilder) Status(status ResponseStatus) *ResponseBuilder {
	rb.response.Status = status
	return rb
}

// Code sets the response code
func (rb *ResponseBuilder) Code(code ResponseCode) *ResponseBuilder {
	rb.response.Code = code
	return rb
}

// Message sets the response message
func (rb *ResponseBuilder) Message(message string) *ResponseBuilder {
	rb.response.Message = message
	return rb
}

// Data sets the response data
func (rb *ResponseBuilder) Data(data interface{}) *ResponseBuilder {
	rb.response.Data = data
	return rb
}

// Error sets the response error
func (rb *ResponseBuilder) Error(err interface{}) *ResponseBuilder {
	rb.response.Error = err
	return rb
}

// Path sets the request path
func (rb *ResponseBuilder) Path(path string) *ResponseBuilder {
	rb.response.Path = path
	return rb
}

// RequestID sets the request ID
func (rb *ResponseBuilder) RequestID(requestID string) *ResponseBuilder {
	rb.response.RequestID = requestID
	return rb
}

// Build returns the final API response
func (rb *ResponseBuilder) Build() APIResponse {
	return rb.response
}

// Send sends the response using gin context
func (rb *ResponseBuilder) Send(c *gin.Context) {
	// Set path if not already set
	if rb.response.Path == "" {
		rb.response.Path = c.Request.URL.Path
	}

	// Set request ID if available in context
	if requestID, exists := c.Get("request_id"); exists {
		if id, ok := requestID.(string); ok {
			rb.response.RequestID = id
		}
	}

	c.JSON(int(rb.response.Code), rb.response)
}

// Convenience functions for common response patterns

// Success creates a success response
func Success(c *gin.Context, message string, data interface{}) {
	NewResponseBuilder().
		Status(StatusSuccess).
		Code(CodeSuccess).
		Message(message).
		Data(data).
		Send(c)
}

// Created creates a created response
func Created(c *gin.Context, message string, data interface{}) {
	NewResponseBuilder().
		Status(StatusSuccess).
		Code(CodeCreated).
		Message(message).
		Data(data).
		Send(c)
}

// Error creates an error response
func Error(c *gin.Context, code ResponseCode, message string, err interface{}) {
	NewResponseBuilder().
		Status(StatusError).
		Code(code).
		Message(message).
		Error(err).
		Send(c)
}

// BadRequest creates a bad request response
func BadRequest(c *gin.Context, message string, err interface{}) {
	Error(c, CodeBadRequest, message, err)
}

// Unauthorized creates an unauthorized response
func Unauthorized(c *gin.Context, message string) {
	Error(c, CodeUnauthorized, message, nil)
}

// Forbidden creates a forbidden response
func Forbidden(c *gin.Context, message string) {
	Error(c, CodeForbidden, message, nil)
}

// NotFound creates a not found response
func NotFound(c *gin.Context, message string) {
	Error(c, CodeNotFound, message, nil)
}

// Conflict creates a conflict response
func Conflict(c *gin.Context, message string, err interface{}) {
	Error(c, CodeConflict, message, err)
}

// ValidationError creates a validation error response
func ValidationError(c *gin.Context, message string, errors []ErrorDetail) {
	Error(c, CodeValidation, message, ValidationErrorResponse{Errors: errors})
}

// InternalError creates an internal server error response
func InternalError(c *gin.Context, message string, err interface{}) {
	Error(c, CodeInternalError, message, err)
}

// Paginated creates a paginated response
func Paginated(c *gin.Context, message string, items interface{}, pagination PaginationInfo) {
	NewResponseBuilder().
		Status(StatusSuccess).
		Code(CodeSuccess).
		Message(message).
		Data(PaginatedResponse{
			Items:      items,
			Pagination: pagination,
		}).
		Send(c)
}

// CreatePaginationInfo creates pagination info from basic parameters
func CreatePaginationInfo(currentPage, perPage int, total int64) PaginationInfo {
	totalPages := (total + int64(perPage) - 1) / int64(perPage)
	hasNext := int64(currentPage) < totalPages
	hasPrevious := currentPage > 1

	var nextPage *int
	var previousPage *int

	if hasNext {
		next := currentPage + 1
		nextPage = &next
	}

	if hasPrevious {
		prev := currentPage - 1
		previousPage = &prev
	}

	return PaginationInfo{
		CurrentPage:  currentPage,
		PerPage:      perPage,
		Total:        total,
		TotalPages:   totalPages,
		HasNext:      hasNext,
		HasPrevious:  hasPrevious,
		NextPage:     nextPage,
		PreviousPage: previousPage,
	}
}

// Response middleware for adding common headers and request ID
func ResponseMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Add request ID to context
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}
		c.Set("request_id", requestID)
		c.Header("X-Request-ID", requestID)

		// Add common headers
		c.Header("Content-Type", "application/json")
		c.Header("X-API-Version", "1.0")

		c.Next()
	}
}

// generateRequestID generates a simple request ID (you might want to use a proper UUID library)
func generateRequestID() string {
	return time.Now().Format("20060102150405") + "-" + time.Now().Format("000000000")
}

// Legacy response functions for backward compatibility

// LegacySuccess creates a legacy success response format
func LegacySuccess(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"message": message,
	})
}

// LegacyError creates a legacy error response format
func LegacyError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{
		"success": false,
		"error":   message,
	})
}

// LegacyCreated creates a legacy created response format
func LegacyCreated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"message": message,
			"data":    data,
		},
	})
}
