# API Response Utilities

This package provides standardized API response utilities for consistent, maintainable, and professional API responses.

## 🎯 **Why Standardized Responses?**

### **Problems with Inconsistent Responses:**
```go
// ❌ Inconsistent - Different formats across endpoints
c.JSON(200, gin.H{"data": result})
c.JSON(201, gin.H{"success": true, "message": "Created"})
c.JSON(400, gin.H{"error": "Bad request"})
c.JSON(500, gin.H{"success": false, "error": "Server error"})
```

### **Benefits of Standardized Responses:**
- ✅ **Consistent Structure** - Same format across all endpoints
- ✅ **Better Error Handling** - Structured error information
- ✅ **Improved Debugging** - Request IDs and timestamps
- ✅ **Enhanced UX** - Clear success/error messages
- ✅ **API Documentation** - Predictable response format
- ✅ **Frontend Integration** - Easier to handle responses

## 🚀 **Quick Start**

### **Basic Usage:**
```go
import "github.com/smhnaqvi/cvilo/utils"

// Success response
utils.Success(c, "User created successfully", user)

// Error response
utils.BadRequest(c, "Validation failed", errors)

// Created response
utils.Created(c, "Resume created successfully", resume)
```

### **Advanced Usage:**
```go
// Paginated response
pagination := utils.CreatePaginationInfo(page, limit, total)
utils.Paginated(c, "Users retrieved successfully", users, pagination)

// Custom response with builder
utils.NewResponseBuilder().
    Status(utils.StatusSuccess).
    Code(utils.CodeSuccess).
    Message("Custom response").
    Data(data).
    Send(c)
```

## 📋 **Response Structure**

### **Standard Response Format:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "user": { ... },
    "token": "..."
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users",
  "request_id": "20240115103000-123456789"
}
```

### **Error Response Format:**
```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "error": {
    "errors": [
      {
        "field": "email",
        "message": "Email is required",
        "code": "REQUIRED"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users",
  "request_id": "20240115103000-123456789"
}
```

### **Paginated Response Format:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Users retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 100,
      "total_pages": 10,
      "has_next": true,
      "has_previous": false,
      "next_page": 2,
      "previous_page": null
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/users",
  "request_id": "20240115103000-123456789"
}
```

## 🛠️ **Available Functions**

### **Success Responses:**
```go
// Basic success
utils.Success(c, "Operation successful", data)

// Created resource
utils.Created(c, "Resource created", data)

// Paginated data
utils.Paginated(c, "Data retrieved", items, pagination)
```

### **Error Responses:**
```go
// Bad request (400)
utils.BadRequest(c, "Invalid input", errors)

// Unauthorized (401)
utils.Unauthorized(c, "Authentication required")

// Forbidden (403)
utils.Forbidden(c, "Access denied")

// Not found (404)
utils.NotFound(c, "Resource not found")

// Conflict (409)
utils.Conflict(c, "Resource conflict", details)

// Validation error (422)
utils.ValidationError(c, "Validation failed", fieldErrors)

// Internal error (500)
utils.InternalError(c, "Server error", errorDetails)
```

### **Custom Responses:**
```go
// Using ResponseBuilder
utils.NewResponseBuilder().
    Status(utils.StatusWarning).
    Code(utils.CodeSuccess).
    Message("Warning message").
    Data(data).
    Send(c)
```

## 📝 **Controller Refactoring Examples**

### **Before (Inconsistent):**
```go
func (rc *ResumeController) CreateResume(c *gin.Context) {
    var resume models.ResumeModel
    if err := c.ShouldBindJSON(&resume); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := resume.Create(); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success": true,
        "data": gin.H{
            "message": "Resume created successfully",
            "resume":  resume,
        },
    })
}
```

### **After (Standardized):**
```go
func (rc *ResumeController) CreateResume(c *gin.Context) {
    var resume models.ResumeModel
    if err := c.ShouldBindJSON(&resume); err != nil {
        utils.BadRequest(c, "Invalid request data", err.Error())
        return
    }

    if err := resume.Create(); err != nil {
        utils.InternalError(c, "Failed to create resume", err.Error())
        return
    }

    utils.Created(c, "Resume created successfully", gin.H{
        "resume": resume,
    })
}
```

### **Pagination Example:**
```go
func (rc *ResumeController) GetAllResumes(c *gin.Context) {
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
    offset := (page - 1) * limit

    resumes, total, err := resumeModel.GetAllResumes(offset, limit)
    if err != nil {
        utils.InternalError(c, "Failed to retrieve resumes", err.Error())
        return
    }

    pagination := utils.CreatePaginationInfo(page, limit, total)
    utils.Paginated(c, "Resumes retrieved successfully", resumes, pagination)
}
```

## 🔧 **Middleware Setup**

### **Add to your main.go:**
```go
import "github.com/smhnaqvi/cvilo/utils"

func main() {
    r := gin.Default()
    
    // Add response middleware
    r.Use(utils.ResponseMiddleware())
    
    // Your routes...
    r.Run(":8080")
}
```

### **Middleware Features:**
- ✅ **Request ID Generation** - Unique ID for each request
- ✅ **Common Headers** - Content-Type, API Version
- ✅ **Request Tracking** - Path and timestamp logging

## 🎨 **Best Practices**

### **1. Consistent Error Messages:**
```go
// ✅ Good - Clear, actionable messages
utils.BadRequest(c, "Email is required", []utils.ErrorDetail{
    {Field: "email", Message: "Email field is required"},
})

// ❌ Bad - Generic messages
utils.BadRequest(c, "Error", "Something went wrong")
```

### **2. Proper HTTP Status Codes:**
```go
// ✅ Good - Appropriate status codes
utils.Created(c, "User created", user)        // 201
utils.Success(c, "User updated", user)        // 200
utils.NotFound(c, "User not found")           // 404
utils.Conflict(c, "Email already exists")     // 409

// ❌ Bad - Wrong status codes
utils.Success(c, "User created", user)        // Should be 201
utils.BadRequest(c, "User not found")         // Should be 404
```

### **3. Structured Error Details:**
```go
// ✅ Good - Detailed validation errors
utils.ValidationError(c, "Validation failed", []utils.ErrorDetail{
    {Field: "email", Message: "Invalid email format", Code: "INVALID_EMAIL"},
    {Field: "password", Message: "Password too short", Code: "PASSWORD_LENGTH"},
})

// ❌ Bad - Generic error
utils.BadRequest(c, "Validation failed", "Invalid data")
```

### **4. Consistent Data Structure:**
```go
// ✅ Good - Consistent data wrapper
utils.Success(c, "User retrieved", gin.H{
    "user": user,
    "profile": profile,
})

// ❌ Bad - Inconsistent structure
utils.Success(c, "User retrieved", user)
utils.Success(c, "Users retrieved", gin.H{"users": users})
```

## 🔄 **Migration Guide**

### **Step 1: Update Imports**
```go
import "github.com/smhnaqvi/cvilo/utils"
```

### **Step 2: Replace Response Calls**
```go
// Old
c.JSON(http.StatusOK, gin.H{"data": result})

// New
utils.Success(c, "Operation successful", result)
```

### **Step 3: Update Error Handling**
```go
// Old
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

// New
utils.BadRequest(c, "Invalid request", err.Error())
```

### **Step 4: Add Middleware**
```go
r.Use(utils.ResponseMiddleware())
```

## 📊 **Response Codes Reference**

| Code | Function | HTTP Status | Use Case |
|------|----------|-------------|----------|
| `CodeSuccess` | `Success()` | 200 | Successful operations |
| `CodeCreated` | `Created()` | 201 | Resource creation |
| `CodeBadRequest` | `BadRequest()` | 400 | Invalid input |
| `CodeUnauthorized` | `Unauthorized()` | 401 | Authentication required |
| `CodeForbidden` | `Forbidden()` | 403 | Access denied |
| `CodeNotFound` | `NotFound()` | 404 | Resource not found |
| `CodeConflict` | `Conflict()` | 409 | Resource conflict |
| `CodeValidation` | `ValidationError()` | 422 | Validation errors |
| `CodeInternalError` | `InternalError()` | 500 | Server errors |

## 🧪 **Testing**

### **Example Test:**
```go
func TestCreateUser(t *testing.T) {
    w := httptest.NewRecorder()
    c, _ := gin.CreateTestContext(w)
    
    // Your test logic...
    
    utils.Created(c, "User created", user)
    
    // Assert response structure
    var response utils.APIResponse
    json.Unmarshal(w.Body.Bytes(), &response)
    
    assert.Equal(t, utils.StatusSuccess, response.Status)
    assert.Equal(t, utils.CodeCreated, response.Code)
    assert.NotEmpty(t, response.RequestID)
}
```

## 🚀 **Advanced Features**

### **Custom Response Builder:**
```go
utils.NewResponseBuilder().
    Status(utils.StatusWarning).
    Code(utils.CodeSuccess).
    Message("Warning: Resource will expire soon").
    Data(gin.H{
        "user": user,
        "expires_at": expiresAt,
    }).
    RequestID("custom-id").
    Send(c)
```

### **Legacy Compatibility:**
```go
// For backward compatibility
utils.LegacySuccess(c, "Success", data)
utils.LegacyError(c, 400, "Error message")
utils.LegacyCreated(c, "Created", data)
```

This standardized approach will make your API more professional, maintainable, and easier to integrate with frontend applications! 