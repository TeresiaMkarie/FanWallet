import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, width = 440 }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(4,10,7,0.65)", backdropFilter: "blur(3px)",
      zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div className="fw-fade-in fw-card fw-scroll" style={{ width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", padding: 24 }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="fw-display" style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{title}</h3>
          <button className="fw-btn fw-btn-ghost fw-btn-sm" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
