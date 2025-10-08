# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a rental property management web application built with Next.js 15, React 19, and Firebase. It supports multiple user roles (Landlord, Renter, Manager, Admin, Support) with role-based access control and internationalization (English/French).

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Deployment (Cloudflare Pages)
- `npm run pages:build` - Build for Cloudflare Pages using @cloudflare/next-on-pages
- `npm run preview` - Build and preview locally with Wrangler
- `npm run deploy` - Build and deploy to Cloudflare Pages

## Architecture

### Authentication & Authorization

**Session Management:**
- Custom JWT-based session system (not NextAuth despite import)
- Session tokens stored in HTTP-only cookies
- Session logic in `src/lib/session.ts` (encrypt, decrypt, createSession, deleteSession, verifySession)
- Sessions expire after 1 hour with a 30-minute grace window
- Firebase Auth used for initial authentication (`src/lib/firebase.ts`)

**Authorization:**
- Role-based middleware in `src/middleware.ts` controls route access
- Supported roles: ADMIN, SUPPORT, LANDLORD, MANAGER, RENTER
- Route-to-role mappings defined in middleware
- Client-side role state managed via Zustand in `src/store/roleStore.ts`
- Role constants in `src/constant/index.ts`

**User Profiles:**
- Users can have multiple profiles/roles
- External user API via Cloudflare Workers at `USER_WORKER_ENDPOINT`
- User service in `src/database/userService.ts` interfaces with external API

### Internationalization

Built with `next-intl`:
- Supported locales: English (en), French (fr)
- Default locale: English
- Configuration in `src/i18n/config.ts`
- Request config in `src/i18n/request.ts`
- Locale service in `src/services/locale.ts` (getUserLocale, setUserLocale)
- Translation files in `messages/en.json` and `messages/fr.json`
- Locale stored in `NEXT_LOCALE` cookie
- Note: Currently working on `feature/internationalization2` branch

### App Structure

**Route Groups:**
- `(auth)` - Sign in/sign up pages
- `(dashboard)` - Protected dashboard routes with nested role-based sections:
  - `/landlord` - Landlord-specific views (properties, units, contracts, requests)
  - `/renter` - Renter-specific views (housing applications)
  - `/manager` - Manager-specific views (mirrors landlord structure)
  - `/support` - Support/admin views (account management, verification)
  - `/settings` - User settings (shared across roles)
  - `/share` - Shared property views

**Key Directories:**
- `src/actions/` - Server actions for assets, auth, configs, requests, users
- `src/components/` - React components organized by feature and type
  - `feature/` - Feature-specific components (Properties, Support, Tenants)
  - `landing/` - Landing page components
  - `pdf/` - PDF generation components using @react-pdf/renderer
- `src/constant/` - Constants for roles, property types, billing items, file extensions
- `src/lib/` - Utilities (Firebase, session management)
- `src/types/` - TypeScript type definitions
- `src/database/` - External API service wrappers
- `src/services/` - Service layer (locale management, session)
- `src/store/` - Zustand state management
- `src/hooks/` - Custom React hooks
- `src/providers/` - React context providers

### Data Flow

1. **Authentication:**
   - User signs in via Firebase Auth
   - Backend validates and fetches user from Cloudflare Worker API
   - Session created with JWT containing user info and roles
   - Session stored in HTTP-only cookie

2. **Authorization:**
   - Middleware intercepts requests
   - Decrypts session cookie
   - Validates user has required role for route
   - Redirects unauthorized users to `/unauthorized`

3. **State Management:**
   - Role and user state persisted in Zustand (`roleStore`)
   - Active role selection for multi-role users
   - Profile code lookup by role name

### External Dependencies

- **Cloudflare Workers:** User management API (`USER_WORKER_ENDPOINT`)
- **Cloudflare R2:** Image storage (`pub-5482c8c79e08450d875d1ba6b0afe368.r2.dev`)
- **Firebase:** Authentication only

## Environment Variables

Required environment variables (create `.env` based on `.env.example` if it exists):
- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`
- `AUTH_SECRET` - JWT signing secret
- `USER_WORKER_ENDPOINT` - Cloudflare Worker API endpoint
- `NODE_ENV` - Environment (production/development)

## Key Implementation Details

**Property Management:**
- Property types: CPLXMOD (Immeuble), STUDMOD (Studio), CHAMMOD (Chambre), APPART (Apartment)
- Properties can have multiple units
- Contracts link tenants to units/properties
- Verification workflow for properties and landlords

**File Uploads:**
- Server actions support up to 100MB body size
- Allowed extensions defined in constants (images: .png/.jpg/.jpeg/.webp/.svg, docs: .pdf/.doc/.docx)
- Image shimmer effect during loading

**Styling:**
- Tailwind CSS with extensive custom theme
- Dark mode support (class-based strategy)
- Custom fonts: Satoshi, Glancyr

**Request Management:**
- Tenants can submit requests (maintenance, inquiries)
- Landlords/managers can view and respond
- Request actions in `src/actions/requestAction.ts`
