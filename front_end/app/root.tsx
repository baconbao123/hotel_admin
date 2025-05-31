import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from "react-router";
import { Tooltip } from 'primereact/tooltip';
import './app.css'

import { LoadingProvider } from './contexts/LoadingContext';

// Error Boundary Component
function ErrorBoundary() {
    const error = useRouteError();
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <div className="error-container">
                    <h1>Oops! Something went wrong</h1>
                    <p>{error?.toString() || 'Unknown error occurred'}</p>
                </div>
                <Scripts />
            </body>
        </html>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <LoadingProvider>
                    <div className="">
                        {children}
                    </div>
                </LoadingProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return (
        <div suppressHydrationWarning>
            <LoadingProvider>
                <Outlet />
            </LoadingProvider>
        </div>
    );
}

// Export error boundary
export { ErrorBoundary };