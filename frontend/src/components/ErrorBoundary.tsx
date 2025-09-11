"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigogo-1000">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <AlertTriangle size={48} className="mx-auto text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-indigogo-200 mb-6">
          An unexpected error occurred. This might be a temporary issue.
        </p>
        <details className="mb-6 text-left">
          <summary className="text-indigogo-300 cursor-pointer mb-2">Error details</summary>
          <pre className="text-xs text-indigogo-400 bg-indigogo-900 p-3 rounded overflow-x-auto">
            {error.message}
          </pre>
        </details>
        <div className="space-y-4">
          <PrimaryButton onClick={resetError} className="w-full">
            Try Again
          </PrimaryButton>
          <button
            onClick={() => window.location.reload()}
            className="w-full text-indigogo-300 hover:text-white transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
