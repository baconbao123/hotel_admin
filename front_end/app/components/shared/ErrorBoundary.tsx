import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Navigate } from "react-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <Navigate to="/500" replace />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
