'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

          // Log to error reporting service (e.g., Sentry) in production
          if (process.env.NODE_ENV === 'production') {
            try {
              const { logError } = require('@/lib/error-logging');
              logError(error, {
                level: 'error',
                tags: {
                  component: 'ErrorBoundary',
                  errorBoundary: 'true',
                },
                extra: {
                  componentStack: errorInfo.componentStack,
                },
              });
            } catch (e) {
              console.error('Failed to log error:', e);
            }
          }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardBody className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <Typography variant="h4" className="mb-2">Something went wrong</Typography>
                <Typography color="gray" className="mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
                </Typography>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
                    <Typography variant="small" className="font-mono text-red-800">
                      {this.state.error.toString()}
                    </Typography>
                    {this.state.errorInfo && (
                      <Typography variant="small" className="font-mono text-red-600 mt-2 text-xs">
                        {this.state.errorInfo.componentStack}
                      </Typography>
                    )}
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button onClick={this.handleReset} color="gray" variant="outlined">
              Try Again
                  </Button>
                  <Button onClick={() => window.location.href = '/'} color="purple">
                    Go Home
                  </Button>
                </div>
          </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      try {
        const { logError } = require('@/lib/error-logging');
        logError(error, {
          level: 'error',
          tags: {
            component: 'useErrorHandler',
          },
          extra: {
            componentStack: errorInfo?.componentStack,
          },
        });
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    }
  };
}
