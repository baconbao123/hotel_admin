import "./app.css";
import "@/asset/images/styles/main.scss";
import { Provider } from "react-redux";
import { store } from "./store";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";

function ErrorBoundary() {
  const error = useRouteError();
  console.log("ErrorBoundary caught:", error); // Add logging for debugging
  return (
    <div className="error-container">
      <h1>Oops! Something went wrong</h1>
      <p>{error?.toString() || "Unknown error occurred"}</p>
    </div>
  );
}

function AppContent() {
  return <Outlet />;
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
        {children} {/* Remove LoadingProvider from here */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Layout>
        <AppContent />
      </Layout>
    </Provider>
  );
}

export { ErrorBoundary };
