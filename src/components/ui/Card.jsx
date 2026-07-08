export function Card({ children, style, top = true, className = "" }) {
  return (
    <div className={`fw-card ${className}`} style={{ padding: 20, ...style }}>
      {top && <div className="fw-card-top" />}
      {children}
    </div>
  );
}
