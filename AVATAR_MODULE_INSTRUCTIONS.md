# Avatar Module - Postman Collection Update Instructions

## Overview

The Avatar module has been successfully created. This document provides instructions for updating the Postman collection.

## Files Created

### Backend Files

1. `src/modules/avatar/avatar.interface.ts` - Avatar type definitions
2. `src/modules/avatar/avatar.model.ts` - MongoDB schema for avatars
3. `src/modules/avatar/avatar.validation.ts` - Zod validation schemas
4. `src/modules/avatar/avatar.service.ts` - Business logic for avatar CRUD
5. `src/modules/avatar/avatar.controller.ts` - HTTP request handlers
6. `src/modules/avatar/avatar.route.ts` - API endpoints configuration

### Updated Files

1. `src/modules/users/users.interface.ts` - Added avatarId field
2. `src/modules/users/users.model.ts` - Added avatarId reference to Avatar model
3. `src/modules/users/users.validation.ts` - Added avatarId validation
4. `src/modules/users/users.controller.ts` - Updated profile update logic
5. `src/modules/users/users.service.ts` - Added avatar population in queries
6. `src/routes/index.ts` - Registered avatar routes at `/avatars`

### Documentation Updates

1. `API_DOCUMENTATION.md` - Added Avatar module documentation
2. `README.md` - Added Avatar feature to features list and project structure

## Postman Collection Updates Needed

### Option 1: Manual Update

Open the main Postman collection file and add the Avatar module after the Users module (around line 1608, before Products).

The complete Avatar module endpoints are provided in:

- `postman/collections/Avatar_Module_Snippet.json`

### Option 2: Import as Separate Collection

1. Open Postman
2. Import the `Avatar_Module_Snippet.json` file
3. Test the endpoints individually
4. Later merge into the main collection if needed

### Update Users Module - Update Profile Endpoint

The "Update Profile" endpoint should be updated to include the avatarId field:

Add this field to the formdata array:

```json
{
  "key": "avatarId",
  "value": "",
  "description": "Optional, select avatar ID instead of uploading image. Only one of profilePicture or avatarId should be used.",
  "type": "text",
  "disabled": true
}
```

**Important Notes:**

- If `profilePicture` is uploaded, `avatarId` will be automatically cleared
- If `avatarId` is provided, `profilePicture` will be automatically cleared
- Users can only use one at a time

## API Endpoints Summary

### Avatar Module (`/avatars`)

1. **POST /avatars/create** - Create avatar (Admin only)
   - Auth: Required (Admin/Super Admin)
   - Body: multipart/form-data
     - name: string (required)
     - image: file (required)

2. **GET /avatars** - Get all active avatars
   - Auth: Not required
   - Query params: page, limit, search, sort

3. **GET /avatars/:id** - Get specific avatar
   - Auth: Not required
   - Params: id

4. **PATCH /avatars/:id** - Update avatar (Admin only)
   - Auth: Required (Admin/Super Admin)
   - Body: multipart/form-data
     - name: string (optional)
     - image: file (optional)
     - isActive: boolean (optional)

5. **DELETE /avatars/:id** - Delete avatar (Admin only)
   - Auth: Required (Admin/Super Admin)
   - Soft delete (sets isActive to false)

## Testing Flow

### Admin Flow

1. Login as Admin
2. Create multiple avatars using POST /avatars/create
3. View all avatars using GET /avatars
4. Update an avatar using PATCH /avatars/:id
5. Delete an avatar using DELETE /avatars/:id

### User Flow

1. Login as User
2. Get all avatars using GET /avatars
3. Select an avatar and note its ID
4. Update profile using PATCH /users/update with avatarId field
5. Get profile using GET /users/profile to see avatar populated

## Data Model

```typescript
Avatar {
  _id: ObjectId
  name: string (unique)
  imageUrl: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

User {
  ...existing fields...
  profilePicture: string (optional)
  avatarId: ObjectId (optional, ref: "Avatar")
  ...
}
```

## Important Implementation Details

1. **Mutual Exclusivity**: Users can either have a profilePicture OR an avatarId, not both
2. **Automatic Cleanup**: When switching between image and avatar, the other is automatically cleared
3. **Population**: Avatar details are populated when fetching user profile
4. **Soft Delete**: Deleting avatars sets isActive to false instead of removing from database
5. **Admin Only Creation**: Only admins can create, update, or delete avatars
6. **Public Access**: Anyone can view active avatars (no auth required for GET endpoints)

## Environment Variables

No new environment variables are needed. The Avatar module uses existing Cloudinary configuration for image uploads.

## Next Steps

1. Import the Avatar module into Postman collection
2. Test all endpoints
3. Create some sample avatars for users to select
4. Update any Flutter/mobile app code to support avatar selection

---

Generated: January 29, 2026
