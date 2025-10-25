/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center p-4">
          <div className="card-base max-w-md w-full text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-error dark:text-dark-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-on-surface dark:text-dark-on-surface mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-on-surface-variant dark:text-dark-on-surface-variant mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 bg-error-container dark:bg-dark-error-container p-4 rounded-xl">
                <summary className="cursor-pointer text-sm font-medium text-on-error-container dark:text-dark-on-error-container mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto text-on-error-container dark:text-dark-on-error-container">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="button-primary w-full"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
