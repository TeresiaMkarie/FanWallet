export function PitchDivider({ thin = false, style }) {
  return <div className={`fw-pitch-divider ${thin ? "thin" : ""}`} style={style} />;
}
