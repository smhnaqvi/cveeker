# Chat Prompt History Feature

## Overview

The chat prompt history feature automatically stores every AI prompt and response for each resume, providing context for future AI interactions to create more consistent and contextually aware resume updates.

## Database Schema

### ChatPromptHistory Table

```sql
CREATE TABLE chat_prompt_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT,
    provider VARCHAR(50) DEFAULT 'openai',
    status VARCHAR(20) DEFAULT 'success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
```

## API Endpoints

### Get Chat History for Resume
```
GET /api/v1/chat-history/resumes/:resume_id
```

### Get Recent Chat History
```
GET /api/v1/chat-history/resumes/:resume_id/recent?limit=5
```

### Get All Chat History for User
```
GET /api/v1/chat-history/users/:user_id
```

### Get Chat History Statistics
```
GET /api/v1/chat-history/users/:user_id/stats
```

### Delete Specific Chat History Entry
```
DELETE /api/v1/chat-history/:id
```

### Delete All Chat History for Resume
```
DELETE /api/v1/chat-history/resumes/:resume_id
```

## How It Works

1. **Automatic Storage**: Every AI prompt and response is automatically saved
2. **Context-Aware AI**: Recent history (last 5 prompts) is included in AI prompts
3. **History Management**: Users can view, manage, and delete their chat history

## Benefits

- **Contextual Continuity**: AI maintains awareness of previous interactions
- **Consistent Updates**: Resume updates build upon previous changes
- **User Experience**: Users can see their conversation history
- **Analytics**: Track AI usage patterns and success rates 