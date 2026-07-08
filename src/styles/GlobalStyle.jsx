const FONT_IMPORT = "https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

export function GlobalStyle() {
  return (
    <style>{`
      @import url('${FONT_IMPORT}');

      .fw-root {
        --pitch-night: #0B1F17;
        --pitch-deep: #10301F;
        --pitch-panel: #143726;
        --pitch-line: #234E3B;
        --touchline: #F4F6F0;
        --kit-gold: #E8B54A;
        --kit-gold-dim: #B98B2E;
        --chalk-dim: #9FB3A9;
        --yellow-card: #F2C230;
        --red-card: #E15B5B;
        --pitch-accent: #45B884;
        --font-display: 'Big Shoulders Display', sans-serif;
        --font-body: 'Inter', sans-serif;
        --font-mono: 'JetBrains Mono', monospace;
        font-family: var(--font-body);
        background: var(--pitch-night);
        color: var(--touchline);
        min-height: 100vh;
        position: relative;
      }
      .fw-root * { box-sizing: border-box; }
      .fw-display { font-family: var(--font-display); letter-spacing: 0.01em; }
      .fw-mono { font-family: var(--font-mono); }

      .fw-scoreboard {
        font-family: var(--font-display);
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        color: var(--kit-gold);
        text-shadow: 0 0 18px rgba(232,181,74,0.45), 0 0 2px rgba(232,181,74,0.8);
        letter-spacing: 0.02em;
      }

      .fw-pitch-divider {
        height: 6px;
        width: 100%;
        background: linear-gradient(90deg, var(--pitch-accent) 0%, var(--pitch-accent) 100%);
        position: relative;
        border-radius: 2px;
        overflow: hidden;
      }
      .fw-pitch-divider::after {
        content: '';
        position: absolute; left: 0; right: 0; top: 2px; height: 2px;
        background: var(--kit-gold);
        opacity: 0.9;
      }
      .fw-pitch-divider.thin { height: 3px; }
      .fw-pitch-divider.thin::after { top: 1px; height: 1px; }

      .fw-card {
        background: var(--pitch-panel);
        border: 1px solid var(--pitch-line);
        border-radius: 14px;
        position: relative;
      }
      .fw-card-top {
        position: absolute; left: 14px; right: 14px; top: 0; height: 4px;
        background: linear-gradient(90deg, var(--pitch-accent), var(--kit-gold));
        border-radius: 0 0 4px 4px;
      }

      .fw-btn {
        font-family: var(--font-body);
        font-weight: 700;
        font-size: 14px;
        border-radius: 10px;
        padding: 11px 18px;
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        cursor: pointer;
        transition: transform 0.12s ease, filter 0.12s ease, background 0.12s ease;
        border: 1px solid transparent;
        user-select: none;
      }
      .fw-btn:active { transform: scale(0.97); }
      .fw-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .fw-btn-primary { background: var(--kit-gold); color: #16210F; }
      .fw-btn-primary:hover:not(:disabled) { filter: brightness(1.08); }
      .fw-btn-ghost { background: transparent; color: var(--touchline); border-color: var(--pitch-line); }
      .fw-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.04); }
      .fw-btn-danger { background: rgba(214,69,69,0.12); color: var(--red-card); border-color: rgba(214,69,69,0.35); }
      .fw-btn-danger:hover:not(:disabled) { background: rgba(214,69,69,0.2); }
      .fw-btn-sm { padding: 7px 12px; font-size: 12.5px; border-radius: 8px; }

      .fw-input {
        width: 100%;
        background: var(--pitch-night);
        border: 1px solid var(--pitch-line);
        color: var(--touchline);
        border-radius: 10px;
        padding: 12px 14px;
        font-family: var(--font-body);
        font-size: 14px;
        outline: none;
        transition: border-color 0.12s ease, box-shadow 0.12s ease;
      }
      .fw-input:focus {
        border-color: var(--kit-gold);
        box-shadow: 0 0 0 3px rgba(232,181,74,0.18);
      }
      .fw-input::placeholder { color: var(--chalk-dim); }
      .fw-label {
        font-size: 11.5px; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.08em; color: var(--chalk-dim); margin-bottom: 6px; display: block;
      }

      .fw-nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 14px; border-radius: 10px; cursor: pointer;
        color: var(--chalk-dim); font-weight: 600; font-size: 13.5px;
        transition: background 0.12s ease, color 0.12s ease;
        border-left: 3px solid transparent;
      }
      .fw-nav-item:hover { background: rgba(255,255,255,0.04); color: var(--touchline); }
      .fw-nav-item.active {
        background: rgba(232,181,74,0.1); color: var(--kit-gold);
        border-left: 3px solid var(--kit-gold);
      }

      .fw-badge {
        font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px;
        display: inline-flex; align-items: center; gap: 5px; letter-spacing: 0.02em;
      }
      .fw-badge-green { background: rgba(69,184,132,0.15); color: var(--pitch-accent); }
      .fw-badge-gold { background: rgba(232,181,74,0.15); color: var(--kit-gold); }
      .fw-badge-red { background: rgba(214,69,69,0.15); color: var(--red-card); }
      .fw-badge-grey { background: rgba(159,179,169,0.15); color: var(--chalk-dim); }

      .fw-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .fw-scroll::-webkit-scrollbar-track { background: transparent; }
      .fw-scroll::-webkit-scrollbar-thumb { background: var(--pitch-line); border-radius: 8px; }

      .fw-fade-in { animation: fwFadeIn 0.28s ease both; }
      @keyframes fwFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

      .fw-pulse-dot { animation: fwPulse 2s ease-in-out infinite; }
      @keyframes fwPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

      .fw-qr-cell { background: var(--pitch-night); }
      .fw-qr-cell.on { background: var(--touchline); }

      .fw-jersey-num {
        font-family: var(--font-display); font-weight: 900; font-size: 64px;
        color: rgba(244,246,240,0.06); line-height: 1; position: absolute; right: 10px; top: -6px;
        pointer-events: none; user-select: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .fw-fade-in, .fw-pulse-dot { animation: none !important; }
      }

      .fw-focus:focus-visible {
        outline: 2px solid var(--kit-gold); outline-offset: 2px;
      }
    `}</style>
  );
}
