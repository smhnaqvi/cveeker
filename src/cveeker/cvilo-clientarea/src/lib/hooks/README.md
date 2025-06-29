# React Query Hooks

This directory contains custom React Query hooks for managing server state in the application.

## Setup

React Query (TanStack Query) is configured in `src/App.tsx` with the following default options:

- **staleTime**: 5 minutes - Data is considered fresh for 5 minutes
- **gcTime**: 10 minutes - Cached data is garbage collected after 10 minutes
- **retry**: 1 - Failed requests are retried once
- **refetchOnWindowFocus**: false - Don't refetch when window regains focus

## Available Hooks

### Resume Hooks

#### `useResumes(params?)`
Fetches all resumes with optional filters and pagination.

```typescript
const { data, isLoading, error, refetch } = useResumes({
  page: 1,
  limit: 10,
  search: 'engineer',
  is_active: true
});
```

#### `useResume(id)`
Fetches a single resume by ID.

```typescript
const { data, isLoading, error } = useResume(123);
```

#### `useCreateResume()`
Creates a new resume.

```typescript
const createResume = useCreateResume();
const handleCreate = async (data) => {
  await createResume.mutateAsync(data);
};
```

#### `useUpdateResume()`
Updates an existing resume.

```typescript
const updateResume = useUpdateResume();
const handleUpdate = async (id, data) => {
  await updateResume.mutateAsync({ id, data });
};
```

#### `useDeleteResume()`
Deletes a resume.

```typescript
const deleteResume = useDeleteResume();
const handleDelete = async (id) => {
  await deleteResume.mutateAsync(id);
};
```

#### `useToggleResumeStatus()`
Toggles the active status of a resume.

```typescript
const toggleStatus = useToggleResumeStatus();
const handleToggle = async (id) => {
  await toggleStatus.mutateAsync(id);
};
```

#### `useCloneResume()`
Clones/duplicates a resume.

```typescript
const cloneResume = useCloneResume();
const handleClone = async (id) => {
  await cloneResume.mutateAsync(id);
};
```

## Query Keys

Query keys are organized hierarchically for efficient cache management:

```typescript
export const resumeKeys = {
  all: ['resumes'],
  lists: () => [...resumeKeys.all, 'list'],
  list: (filters) => [...resumeKeys.lists(), filters],
  details: () => [...resumeKeys.all, 'detail'],
  detail: (id) => [...resumeKeys.details(), id],
  user: (userId) => [...resumeKeys.all, 'user', userId],
};
```

## Cache Management

The hooks automatically manage cache invalidation:

- **Create/Update/Delete operations** invalidate list queries
- **Individual resume updates** update the specific resume in cache
- **Status toggles** update both the individual resume and list cache

## Error Handling

Each hook provides error states that can be used in components:

```typescript
const { error, isError } = useResumes();

if (isError) {
  console.error('Failed to fetch resumes:', error.message);
}
```

## Loading States

Loading states are available for both queries and mutations:

```typescript
const { isLoading } = useResumes();
const { isPending } = useCreateResume();

if (isLoading) return <LoadingSpinner />;
if (isPending) return <SavingIndicator />;
```

## Optimistic Updates

Some mutations support optimistic updates for better UX:

- **Status toggles** immediately update the UI
- **Cache updates** happen before server confirmation

## DevTools

React Query DevTools are included in development mode. Press `Ctrl+H` (or `Cmd+H` on Mac) to open the DevTools panel.

## Best Practices

1. **Use the hooks directly** instead of calling services manually
2. **Handle loading and error states** in your components
3. **Use `enabled` option** for conditional queries
4. **Leverage cache** - don't refetch unnecessarily
5. **Use `staleTime`** to control when data is considered fresh
6. **Handle mutations properly** with loading states and error handling

## Example Usage

```typescript
import { useResumes, useDeleteResume } from '@/lib/hooks';

const ResumeList = () => {
  const { data, isLoading, error } = useResumes();
  const deleteResume = useDeleteResume();

  const handleDelete = async (id) => {
    try {
      await deleteResume.mutateAsync(id);
      // Success notification
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.resumes.map(resume => (
        <ResumeCard 
          key={resume.id} 
          resume={resume}
          onDelete={() => handleDelete(resume.id)}
          isDeleting={deleteResume.isPending}
        />
      ))}
    </div>
  );
};
``` 