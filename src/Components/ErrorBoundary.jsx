import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#06080e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          color: "#f0ede6",
          padding: "40px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>
          <h2 style={{ fontSize: 24, marginBottom: 12, color: "#ff6b6b" }}>
            Something went wrong
          </h2>
          <p style={{ color: "rgba(240,237,230,0.4)", marginBottom: 28, fontSize: 14 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, #00ffb4, #0090ff)",
              border: "none",
              borderRadius: 10,
              color: "#06080e",
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;