# API Services with Axios

This directory contains a modular API service architecture with Axios for making HTTP requests to your backend API. The services are organized following Go best practices with separate files for each model/domain.

## Directory Structure

```
src/lib/
├── axios.ts              # Main Axios configuration
├── services/
│   ├── index.ts          # Service exports
│   ├── types.ts          # TypeScript interfaces
│   ├── base.ts           # Base service class
│   ├── auth.service.ts   # Authentication service
│   ├── user.service.ts   # User management service
│   └── resume.service.ts # Resume management service
└── README.md             # This documentation
```

## Architecture Overview

### Base Service Class
The `BaseService` class provides common HTTP methods and utilities that all services inherit from:
- Standardized HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Query parameter building
- Type-safe responses
- Error handling

### Service Classes
Each service class extends `BaseService` and provides domain-specific API methods:
- **AuthService**: Authentication, registration, password management
- **UserService**: User profile, user management (admin)
- **ResumeService**: Resume CRUD, export, sharing, templates

### Type Safety
All services are fully typed with TypeScript interfaces for:
- Request payloads
- Response data
- Query parameters
- Error responses

## Setup

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_URL=http://localhost:8080
```

### Authentication

The Axios configuration automatically handles authentication:
1. Reads `access_token` from localStorage
2. Adds Bearer token to Authorization header
3. Handles 401 responses by redirecting to `/login`

## Usage

### Import Services

```typescript
import { 
  authService, 
  userService, 
  resumeService,
  type User,
  type Resume 
} from '@/lib/services';
```

### Authentication Service

```typescript
// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password'
});

if (loginResponse.success) {
  localStorage.setItem('access_token', loginResponse.data.token);
}

// Register
const registerResponse = await authService.register({
  email: 'newuser@example.com',
  password: 'password',
  name: 'New User'
});

// Get current user
const userResponse = await authService.getCurrentUser();

// Refresh token
const refreshResponse = await authService.refreshToken();

// Logout
await authService.logout();
```

### User Service

```typescript
// Get current user profile
const profile = await userService.getProfile();

// Update profile
const updatedProfile = await userService.updateProfile({
  name: 'Updated Name',
  email: 'newemail@example.com'
});

// Admin: Get all users
const users = await userService.getUsers({
  page: 1,
  limit: 10,
  sort_by: 'created_at',
  sort_order: 'desc'
});

// Admin: Search users
const searchResults = await userService.searchUsers('john', {
  page: 1,
  limit: 20
});
```

### Resume Service

```typescript
// Get all resumes
const resumes = await resumeService.getResumes({
  page: 1,
  limit: 10
});

// Get single resume
const resume = await resumeService.getResume(123);

// Create resume
const newResume = await resumeService.createResume({
  title: 'My Professional Resume',
  content: 'Resume content...',
  template: 'modern'
});

// Update resume
const updatedResume = await resumeService.updateResume(123, {
  title: 'Updated Title',
  content: 'Updated content...'
});

// Delete resume
await resumeService.deleteResume(123);

// Duplicate resume
const duplicatedResume = await resumeService.duplicateResume(123);

// Export as PDF
const pdfExport = await resumeService.exportResumeAsPDF(123);
window.open(pdfExport.data.downloadUrl, '_blank');

// Share resume
const shareResponse = await resumeService.shareResume(123, {
  expiresAt: '2024-12-31',
  password: 'optional-password'
});

// Search resumes
const searchResults = await resumeService.searchResumes('developer', {
  page: 1,
  limit: 20
});

// Get templates
const templates = await resumeService.getTemplates();

// Bulk operations
await resumeService.bulkDeleteResumes([1, 2, 3]);
await resumeService.bulkDuplicateResumes([1, 2, 3]);
```

## Error Handling

### Automatic Error Handling
The Axios configuration handles common errors automatically:
- **401**: Redirects to login, clears token
- **403**: Logs forbidden access
- **404**: Logs resource not found
- **500**: Logs server error
- **Network**: Logs network errors

### Manual Error Handling

```typescript
try {
  const response = await userService.getProfile();
  
  if (response.success) {
    // Handle success
    setUser(response.data);
  } else {
    // Handle API error
    setError(response.message);
  }
} catch (error) {
  // Handle network/other errors
  console.error('Request failed:', error);
  setError('Network error occurred');
}
```

## Advanced Usage

### Custom Service Class

```typescript
import { BaseService } from '@/lib/services';

export class CustomService extends BaseService {
  constructor() {
    super('/api/custom');
  }

  async getCustomData(id: number): Promise<ApiResponse<CustomData>> {
    return this.get<CustomData>(`/${id}`);
  }

  async createCustomData(data: CreateCustomData): Promise<ApiResponse<CustomData>> {
    return this.post<CustomData>('', data);
  }
}

export const customService = new CustomService();
```

### Query Parameters

```typescript
// Pagination
const results = await resumeService.getResumes({
  page: 1,
  limit: 20
});

// Sorting
const sortedResults = await resumeService.getResumes({
  sort_by: 'created_at',
  sort_order: 'desc'
});

// Filtering
const filteredResults = await resumeService.getResumes({
  search: 'developer',
  template: 'modern'
});
```

### Type Safety

```typescript
// Define custom types
interface CustomResponse {
  id: number;
  name: string;
  data: unknown;
}

// Use with services
const response = await apiService.get<CustomResponse>('/api/custom/1');
```

## Best Practices

1. **Use Service Classes**: Always use the service classes instead of direct Axios calls
2. **Handle Errors**: Always wrap service calls in try-catch blocks
3. **Check Success**: Always check `response.success` before using `response.data`
4. **Type Everything**: Use TypeScript interfaces for all request/response data
5. **Use Query Parameters**: Use the built-in query parameter support for filtering/sorting
6. **Singleton Pattern**: Use the exported service instances (e.g., `authService`) rather than creating new instances

## Testing

The services include request/response logging for debugging. Check the browser console to see:
- Request method and URL
- Response status and URL
- Error details

This helps with debugging API calls during development. 