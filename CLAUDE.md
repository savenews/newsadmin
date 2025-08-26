
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaveNews Admin Dashboard - A React-based single-file admin interface for managing the SaveNews platform. The entire admin UI is deliberately implemented in `src/Admin.tsx` for rapid development and easy maintenance.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (port 8082)
npm start

# Build for production
npm run build

# Run tests (if any)
npm test
```

**Note**: 빌드 테스트는 필요없음 - hotfix dev 모드 실행 중

## Architecture

### Single-File Design Pattern
**IMPORTANT**: All admin functionality is intentionally contained in `src/Admin.tsx`. When adding features or fixing bugs, modify this single file rather than creating new component files. This design enables:
- Rapid prototyping and development
- Easy state sharing between components
- Simplified debugging

### API Communication
All API calls go through `src/utils/adminApi.ts`:
- Base URL: `https://api.saveticker.com`
- Authentication: Bearer token in localStorage (`access_token`)
- Auto-logout on 401 responses
- Admin endpoints: `/admin-api/*` (requires auth)
- Public endpoints: `/api/*`

### Content Structure
All content entities (news, reports, calendar) use unified format:
```typescript
type Content = Array<
  | { type: 'text'; content: string }
  | { type: 'image'; content: string; url: string; alt?: string }
>
```

## Key Features & API Endpoints

### Authentication
- Login: `POST /api/auth/login` - Uses existing SaveNews credentials
- Token stored in localStorage as `access_token`

### News Management  
- List: `GET /api/news/list?page=1&page_size=20&sort=created_at_desc`
- Detail: `GET /api/news/detail/:id`
- Create: `POST /admin-api/news/create`
- Update: `PUT /admin-api/news/update/:id`
- Delete: `DELETE /admin-api/news/delete/:id`
- Categories: Stock, Bond, Currency, Fund, Real, Crypto

### Report Management
- List: `GET /api/reports`
- Create: `POST /admin-api/reports/create`
- Update: `PUT /admin-api/reports/update/:id`
- Delete: `DELETE /admin-api/reports/delete/:id`

### Calendar Management
- List: `GET /api/calendar`
- Create: `POST /admin-api/calendar/create`
- Update: `PUT /admin-api/calendar/update/:id`
- Delete: `DELETE /admin-api/calendar/delete/:id`
- Date format: ISO 8601 with timezone (YYYY-MM-DDTHH:mm:ss+09:00 for KST)

### User Management
- List: `GET /admin-api/users?page=1&page_size=20`
- Update: `PUT /admin-api/users/update/:id`
- Delete: `DELETE /admin-api/users/delete/:id`

### Community Management
- List posts: `GET /api/community`
- Delete post: `DELETE /admin-api/community/delete/:id`
- Delete comment: `DELETE /admin-api/community/:id/comments/:commentId`

### File Uploads
- Images: `POST /api/uploads/image` (returns `{ url: string }`)
- Documents: `POST /admin-api/uploads/document` (returns `{ url: string }`)

## Git Configuration

```bash
# Repository already configured with auth
git remote -v  # Check current remotes

# Commit and push changes
git add . && git commit -m "message" && git push origin main

# If token update needed (user provides)
git remote set-url origin https://[TOKEN]@github.com/savenews/newsadmin.git
```

## Important Implementation Notes

1. **Data Protection**: All form data auto-saves to localStorage to prevent data loss
2. **Rich Text Editor**: Uses Quill for content editing
3. **Timezone Handling**: Calendar events use KST (+09:00) - add 9 hours offset when needed
4. **Auto-refresh**: CRUD operations trigger automatic data refresh
5. **Error Handling**: 401 errors trigger automatic logout and redirect

## File Structure

```
/var/www/newsadmin/
├── src/
│   ├── Admin.tsx       # Main admin component (ALL UI CODE HERE)
│   ├── index.tsx       # React entry point
│   └── utils/
│       └── adminApi.ts # API utilities
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript config
└── .env               # Environment vars (PORT=8082)
```

## Common Development Tasks

### Adding New Features
1. Add navigation item in `Admin.tsx` navigation section
2. Add component function within `Admin.tsx` file
3. Add API functions to `adminApi.ts` if needed
4. Follow existing CRUD pattern for consistency

### Debugging
- Check browser console for API errors
- Verify token in localStorage
- API base URL: `https://api.saveticker.com`

### Testing Changes
After making changes:
1. Test locally with `npm start`
2. Check all CRUD operations work
3. Verify auto-refresh after operations
4. Test error handling (try invalid data)
5. Build with `npm run build` to verify production build
