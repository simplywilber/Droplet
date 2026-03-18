import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary" style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                    <h2>Something went wrong.</h2>
                    <p>We are having trouble loading this section. Please refresh the page or try again later.</p>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
