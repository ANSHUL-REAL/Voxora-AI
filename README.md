# Voxora AI

Voxora AI is a customer operations platform for teams that manage conversations, calls, leads, automations, analytics, and knowledge workflows from one workspace. It combines a polished SaaS interface with a fully interactive demo mode and a production-ready integration structure for real channels and AI services.

The product is designed around a simple idea: every customer interaction should become an action. Messages can turn into lead updates, calls can produce summaries, automations can route follow-ups, and the knowledge base can help generate faster, more consistent responses.

## Highlights

- Interactive landing page with a premium dark visual system, animated earth, custom cursor, and smooth section navigation
- Secure authentication flow with Firebase email/password, Google sign-in, and local demo access
- Global Demo and Real mode architecture
- Unified inbox for WhatsApp, Instagram, Facebook, LinkedIn, and web chat style conversations
- AI reply generation with server-side Gemini support and automatic mock fallback
- AI call simulation with accept/decline flow, transcript playback, timer, summaries, and appointment booking
- Lead CRM with stages, notes, assignments, editing, deletion, and local persistence
- Analytics dashboard with live-feeling metrics, charts, refresh behavior, and activity updates
- Automation builder with workflow blocks, conditions, toggles, simulated runs, and saved state
- Knowledge base tools for FAQs, mock document uploads, training progress, search, and deletion
- Settings area for tone, notifications, mode switching, API key placeholders, and integration readiness

## Demo Mode

Demo Mode is the default experience. It runs completely with mock data, simulated realtime updates, and local storage, so the product can be explored without configuring external APIs.

Demo access creates a local user:

```json
{
  "id": "demo-user",
  "name": "Demo User",
  "email": "demo@voxora.ai",
  "role": "demo"
}
```

This mode is ideal for product walkthroughs, internal reviews, UI validation, and offline presentations.

## Real Mode

Real Mode exposes the integration-ready architecture without forcing credentials during local setup. When API keys are available, server routes can call real services. When keys are missing, the app gracefully falls back to demo behavior and shows clear integration-ready messaging.

Supported integration structure includes:

- Gemini AI responses through a server-side `/api/ai/reply` route
- Firebase Authentication
- WhatsApp-ready service boundaries
- Meta messaging-ready pipeline concepts
- LinkedIn placeholder architecture
- Voice and transcript workflow structure
- Knowledge base and RAG-ready abstractions

## Tech Stack

- React Router
- Vite
- React
- TypeScript and JavaScript
- Tailwind CSS
- Framer Motion / Motion
- Zustand
- Firebase
- Gemini API-ready server route
- Recharts
- Vercel-ready build configuration

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment Variables

Create a local `.env` file from `.env.example` when enabling real services:

```bash
cp .env.example .env
```

Firebase variables:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Gemini variable:

```text
GEMINI_API_KEY=
```

The app still works in Demo Mode when these values are not provided.

## Firebase Setup

1. Create a Firebase web app.
2. Enable Firebase Authentication.
3. Turn on Email/Password and Google sign-in providers.
4. Add authorized domains such as `localhost`, `127.0.0.1`, and the production deployment domain.
5. Add the Firebase web config values to the local `.env` file or deployment provider.

## Gemini Setup

1. Create a Gemini API key.
2. Add `GEMINI_API_KEY` as a server-side environment variable.
3. Restart the dev server or redeploy the app.

If Gemini is unavailable, the AI reply route automatically returns a smart mock response.

## Build

Run a production build:

```bash
npm run build
```

Run type checking:

```bash
npm run typecheck
```

## Deployment

The project is ready for deployment on Vercel or any platform that supports the React Router/Vite build flow.

Recommended Vercel settings:

- Build command: `npm run build`
- Install command: `npm install`
- Environment variables: optional for Demo Mode, required only for real Firebase/Gemini behavior

## Project Structure

```text
src/
  app/                 Application routes and layouts
  components/          Shared UI and visual components
  features/            Feature-specific modules
  integrations/        External service boundaries
  lib/                 Shared helpers
  mock/                Demo data and mock services
  services/            Demo and real service layers
  store/               Zustand state stores
  types/               Shared types
  utils/               Utility functions
```

## Product Notes

Voxora AI is built to feel like a real operating system for customer-facing teams. Demo Mode focuses on reliability and a smooth product walkthrough. Real Mode keeps the architecture ready for production services while maintaining graceful fallbacks for local development.
