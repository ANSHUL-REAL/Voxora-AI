import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';
import './global.css';
import { SmoothCursor } from '@/components/SmoothCursor';
// Vite returns processed CSS for ?inline imports. Keeping this in the root
// prevents a client-render fallback from dropping the app styles.
import sonnerCss from 'sonner/dist/styles.css?inline';
import globalCss from './global.css?inline';

export const links = () => [
  {
    rel: 'icon',
    type: 'image/png',
    href: '/assets/voxora-logo.png',
  },
  {
    rel: 'apple-touch-icon',
    href: '/assets/voxora-logo.png',
  },
  {
    rel: 'shortcut icon',
    href: '/assets/voxora-logo.png',
  },
  {
    rel: 'manifest',
    href: '/site.webmanifest',
  },
];

export const meta = () => [
  { title: 'Voxora AI' },
  {
    name: 'description',
    content:
      'Customer operations workspace for AI inboxes, calls, leads, automations, analytics, and knowledge workflows.',
  },
  { property: 'og:title', content: 'Voxora AI' },
  {
    property: 'og:description',
    content:
      'A customer operations workspace for AI-powered conversations, voice calls, CRM, automations, and analytics.',
  },
  { property: 'og:image', content: '/assets/voxora-logo.png' },
  { name: 'theme-color', content: '#07070f' },
];

function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <style
          data-voxora-critical-css
          dangerouslySetInnerHTML={{ __html: `${sonnerCss}\n${globalCss}` }}
        />
        <Links />
      </head>
      <body>
        {children}
        <ClientOnly>
          <SmoothCursor />
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            toastOptions={{
              style: {
                background: '#0b0b16',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f4f4f5',
                boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
              },
            }}
          />
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  return (
    <main className="min-h-screen bg-[#07070f] px-6 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Voxora AI
        </p>
        <h1 className="mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          The app hit an unexpected state. Return to the workspace and try again.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return <Outlet />;
}
