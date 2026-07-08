import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ theme, onToggle, className = "" }) {
  const isLight = theme === "light";
  return (
    <button
      type="button"
      className={`fw-btn fw-btn-ghost fw-btn-sm fw-focus ${className}`}
      onClick={onToggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  );
}
