# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured in this project.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `AWS_*` — S3 credentials for image storage
- `AUTH_MICROSOFT_ENTRA_ID_*` — Azure AD OAuth app credentials
- `AUTH_SECRET` — Random string for NextAuth session encryption
- `NEXT_PUBLIC_API_BASE_URL` — Backend API base URL (e.g. `localhost:5000/api/v1`)

## Architecture

**Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, TanStack Query v5, TanStack Form, NextAuth v5 (Microsoft Entra ID), Axios, Zod, AWS S3.

### Auth Flow

NextAuth is configured with Microsoft Entra ID. The middleware (`middleware.ts`) protects all routes except Next.js internals. The access token from the JWT is stored in the NextAuth session.

`AuthTokenSync` (in `components/providers/`) is a client component that syncs the session token into a module-level variable (`lib/auth-token.ts`). The Axios instance (`lib/api-client.ts`) uses a request interceptor that reads this variable on the client side, or calls NextAuth's `auth()` on the server side, to attach the `Authorization: Bearer` header automatically.

### Service / Data Fetching Layer

`service/base.ts` exports `createDataService(endpoint)` — a factory that returns a typed CRUD service for any entity. It wraps Axios calls in TanStack Query hooks: `useGetAll`, `useGet`, `useCreate`, `useUpdate`, `useDelete`. All entity services are instantiated in `service/services.ts` and consumed directly in page/component files.

### Types & Validation

Each entity has a Zod schema file in `types/`. Schemas define both the shape (via `z.infer`) and runtime validation. Separate Create/Update DTOs are defined per entity. API endpoints are listed as an enum in `config/endpoints.ts`.

### Image Handling

Image upload/delete goes through Next.js API routes (`app/api/images/`). Upload compresses to max 500 KB using `sharp` before uploading to S3. The `next.config.ts` whitelists the S3 bucket domain for Next.js `<Image>` optimization.

### UI Conventions

- Headless UI (`@headlessui/react`) for accessible unstyled primitives (combobox, listbox, switch)
- `react-hot-toast` for all toast notifications
- Error messages are centralized in `config/error-messages.ts` (written in Estonian)
- Path alias `@/*` resolves to the project root
