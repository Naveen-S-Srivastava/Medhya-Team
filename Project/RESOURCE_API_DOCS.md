# Resource API Documentation

## Overview
The Resource API provides endpoints for managing psychoeducational resources, user libraries, and resource interactions.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require authentication using Clerk. Include the `X-Clerk-User-ID` header with the user's Clerk ID.

## Endpoints

### Public Endpoints

#### 1. Get All Resources
```
GET /resources
```

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of resources per page (default: 12)
- `category` (string): Filter by category (anxiety, depression, stress, etc.)
- `type` (string): Filter by type (video, audio, article, etc.)
- `resourceLanguage` (string): Filter by language
- `difficulty` (string): Filter by difficulty (beginner, intermediate, advanced)
- `search` (string): Search in title, description, and tags

**Response:**
```json
{
  "status": "success",
  "results": 6,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 6,
    "hasNextPage": false,
    "hasPrevPage": false,
    "limit": 12
  },
  "data": [
    {
      "_id": "resource_id",
      "title": "Understanding Anxiety: A Student's Guide",
      "description": "A comprehensive guide...",
      "type": "article",
      "category": "anxiety",
      "resourceLanguage": "english",
      "url": "https://example.com/anxiety-guide",
      "thumbnail": "https://example.com/images/anxiety-guide.jpg",
      "duration": "15 min read",
      "author": "Dr. Sarah Johnson",
      "publisher": "MindCare University",
      "publishDate": "2024-01-15T00:00:00.000Z",
      "tags": ["anxiety", "students", "mental health"],
      "difficulty": "beginner",
      "ageGroup": "young-adults",
      "isFeatured": true,
      "isActive": true,
      "views": 1250,
      "downloads": 340,
      "averageRating": 4.5,
      "totalRatings": 12,
      "accessibility": {
        "hasSubtitles": false,
        "hasAudioDescription": false,
        "isScreenReaderFriendly": true
      },
      "metadata": {
        "fileSize": "2.5 MB",
        "format": "PDF",
        "resolution": "N/A",
        "languageSubtitles": []
      },
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

#### 2. Get Featured Resources
```
GET /resources/featured
```

**Query Parameters:**
- `limit` (number): Number of featured resources to return (default: 6)

**Response:**
```json
{
  "status": "success",
  "results": 3,
  "data": [
    // Array of featured resources
  ]
}
```

#### 3. Get Resource by ID
```
GET /resources/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    // Single resource object with populated ratings
  }
}
```

#### 4. Get Resource Statistics
```
GET /resources/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalResources": 6,
    "totalCategories": 6,
    "totalLanguages": 1,
    "categories": [
      { "_id": "anxiety", "count": 1 },
      { "_id": "stress", "count": 1 }
    ],
    "languages": [
      { "_id": "english", "count": 6 }
    ],
    "types": [
      { "_id": "article", "count": 3 },
      { "_id": "video", "count": 2 }
    ]
  }
}
```

### Protected Endpoints (Require Authentication)

#### 5. Save Resource to Library
```
POST /resources/save
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
Content-Type: application/json
```

**Body:**
```json
{
  "resourceId": "resource_id"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource saved to library successfully",
  "data": {
    "_id": "user_resource_id",
    "user": "user_id",
    "resource": "resource_id",
    "status": "saved",
    "savedAt": "2024-01-15T00:00:00.000Z",
    "lastAccessed": "2024-01-15T00:00:00.000Z",
    "progress": 0,
    "isFavorite": false,
    "downloadCount": 0,
    "viewCount": 0,
    "timeSpent": 0
  }
}
```

#### 6. Get User Library
```
GET /resources/library/user
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
```

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of resources per page (default: 12)

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 2,
    "hasNextPage": false,
    "hasPrevPage": false,
    "limit": 12
  },
  "data": [
    {
      "_id": "user_resource_id",
      "user": "user_id",
      "resource": {
        // Full resource object
      },
      "status": "saved",
      "savedAt": "2024-01-15T00:00:00.000Z",
      "lastAccessed": "2024-01-15T00:00:00.000Z",
      "progress": 0,
      "notes": null,
      "rating": null,
      "review": null,
      "isFavorite": false,
      "tags": [],
      "downloadCount": 0,
      "viewCount": 0,
      "timeSpent": 0,
      "completedAt": null
    }
  ]
}
```

#### 7. Remove Resource from Library
```
DELETE /resources/library/:resourceId
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource removed from library successfully"
}
```

#### 8. Update User Resource
```
PATCH /resources/library/:resourceId
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
Content-Type: application/json
```

**Body:**
```json
{
  "progress": 75,
  "notes": "Very helpful resource",
  "rating": 5,
  "review": "Excellent content",
  "isFavorite": true,
  "tags": ["helpful", "recommended"]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    // Updated user resource object
  }
}
```

#### 9. Mark Resource as Downloaded
```
POST /resources/library/:resourceId/download
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource marked as downloaded"
}
```

#### 10. Rate Resource
```
POST /resources/:id/rate
```

**Headers:**
```
X-Clerk-User-ID: user_clerk_id
Content-Type: application/json
```

**Body:**
```json
{
  "rating": 5,
  "review": "Excellent resource for understanding anxiety"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Resource rated successfully",
  "data": {
    // Updated resource object with new rating
  }
}
```

### Admin Endpoints (Require Admin Role)

#### 11. Create Resource
```
POST /resources
```

**Headers:**
```
X-Clerk-User-ID: admin_clerk_id
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Resource Title",
  "description": "Resource description",
  "type": "article",
  "category": "anxiety",
  "resourceLanguage": "english",
  "url": "https://example.com/resource",
  "thumbnail": "https://example.com/thumbnail.jpg",
  "duration": "10 min read",
  "author": "Dr. Author Name",
  "publisher": "Publisher Name",
  "tags": ["tag1", "tag2"],
  "difficulty": "beginner",
  "ageGroup": "young-adults",
  "isFeatured": false,
  "accessibility": {
    "hasSubtitles": false,
    "hasAudioDescription": false,
    "isScreenReaderFriendly": true
  },
  "metadata": {
    "fileSize": "1.5 MB",
    "format": "PDF",
    "resolution": "N/A",
    "languageSubtitles": []
  }
}
```

#### 12. Update Resource
```
PATCH /resources/:id
```

**Headers:**
```
X-Clerk-User-ID: admin_clerk_id
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated Title",
  "isFeatured": true
}
```

#### 13. Delete Resource
```
DELETE /resources/:id
```

**Headers:**
```
X-Clerk-User-ID: admin_clerk_id
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "You are not logged in. Please login to access"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## Resource Categories
- anxiety
- depression
- stress
- sleep
- relationships
- academic
- mindfulness
- self-care
- crisis
- general

## Resource Types
- video
- audio
- article
- guide
- worksheet
- podcast
- book

## Resource Languages
- english
- hindi
- tamil
- telugu
- bengali
- marathi
- gujarati
- kannada
- malayalam
- punjabi
- urdu

## Resource Difficulties
- beginner
- intermediate
- advanced

## Age Groups
- teens
- young-adults
- adults
- all-ages

## User Resource Statuses
- saved
- downloaded
- completed
- in-progress
