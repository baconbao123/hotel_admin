// import {
//   Links,
//   Meta,
//   Outlet,
//   Scripts,
//   ScrollRestoration,
//   useRouteError,
// } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import "./app.css";
import "@/asset/images/styles/main.scss";
import { LoadingProvider } from "./contexts/LoadingContext";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store";
import { useEffect } from "react";
import { fetchCommonData } from "./store/slices/commonDataSlice";
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
        <LoadingProvider>{children}</LoadingProvider>
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
