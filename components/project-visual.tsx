export function ProjectVisual({ tone, label, compact = false }: { tone: string; label: string; compact?: boolean }) {
  return (
    <div className={`project-visual project-visual--${tone} ${compact ? "is-compact" : ""}`} role="img" aria-label={label}>
      <div className="visual-browser">
        <div className="visual-chrome"><i /><i /><i /><span>{label}</span></div>
        <div className="visual-layout"><div className="visual-copy"><b /><b /><span /><span /><span /><em /></div><div className="visual-image"><span /></div></div>
      </div>
      <span className="asset-flag">PLACEHOLDER / REPLACE</span>
    </div>
  );
}
