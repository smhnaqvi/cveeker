# Zustand Auth Store

This directory contains Zustand stores for managing application state. The main store is the `authStore` which handles authentication state management.

## Auth Store

The auth store provides a centralized way to manage authentication state using Zustand with persistence to localStorage.

### Features

- **Persistent State**: Authentication state is automatically saved to localStorage
- **Token Management**: Handles access tokens and user data
- **Loading States**: Provides loading states for async operations
- **Type Safety**: Fully typed with TypeScript
- **Performance**: Uses selectors for optimized re-renders

### Usage

#### Basic Usage

```tsx
import { useAuthStore } from '../stores';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

#### Using Selectors for Better Performance

```tsx
import { useUser, useIsAuthenticated, useAuthActions } from '../stores';

function MyComponent() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { login, logout } = useAuthActions();
  
  // Component only re-renders when these specific values change
}
```

### Available Hooks

#### Main Store Hook
- `useAuthStore()` - Access the entire auth store

#### Selector Hooks (Recommended)
- `useUser()` - Get current user data
- `useToken()` - Get current access token
- `useIsAuthenticated()` - Check if user is authenticated
- `useIsLoading()` - Get loading state
- `useAuthActions()` - Get all auth actions (login, register, logout, etc.)

### Store Actions

#### Authentication Actions
- `login(email: string, password: string)` - Login with email/password
- `register(name: string, email: string, password: string)` - Register new user
- `logout()` - Logout and clear state
- `updateUser(userData: User)` - Update user data
- `initializeAuth()` - Initialize auth state from localStorage
- `setLoading(loading: boolean)` - Set loading state

### State Structure

```typescript
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  initializeAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}
```

### Persistence

The store automatically persists the following data to localStorage:
- `user` - User data
- `token` - Access token
- `isAuthenticated` - Authentication status

The `isLoading` state is not persisted as it's only relevant for the current session.

### Initialization

The auth store is automatically initialized in `main.tsx`:

```tsx
// Initialize auth store
useAuthStore.getState().initializeAuth()
```

This checks for existing tokens in localStorage and validates them with the backend.

### Error Handling

All async actions (login, register, initializeAuth) throw errors that should be caught by the calling component:

```tsx
const { login } = useAuthStore();

try {
  await login(email, password);
  // Success - navigate to dashboard
} catch (error) {
  // Handle error - show error message
  console.error('Login failed:', error);
}
```

### Migration from React Context

This Zustand store replaces the previous React Context implementation. The main benefits are:

1. **Better Performance**: No unnecessary re-renders
2. **Simpler API**: No need for providers or context consumers
3. **Built-in Persistence**: Automatic localStorage persistence
4. **Type Safety**: Better TypeScript support
5. **DevTools**: Better debugging with Zustand devtools 