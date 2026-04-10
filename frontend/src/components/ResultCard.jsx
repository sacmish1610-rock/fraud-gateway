import { useEffect, useState } from "react";
import EnrichedDataViewer from "./EnrichedDataViewer";

const DECISION_CONFIG = {
  ALLOW: {
    label: "Transaction Approved",
    sublabel: "Low fraud risk — payment can proceed safely",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #059669, #10b981)",
    glowColor: "rgba(16,185,129,0.3)",
    bgCard: "rgba(16,185,129,0.06)",
    borderColor: "rgba(16,185,129,0.25)",
    badgeStyle: { background: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.3)" },
    barColor: "linear-gradient(90deg, #059669, #10b981)",
    textColor: "#6ee7b7",
    tag: "✓ APPROVED",
  },
  OTP_REQUIRED: {
    label: "OTP Verification Required",
    sublabel: "Elevated risk detected — additional authentication needed",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
    glowColor: "rgba(245,158,11,0.3)",
    bgCard: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.25)",
    badgeStyle: { background: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "1px solid rgba(245,158,11,0.3)" },
    barColor: "linear-gradient(90deg, #d97706, #f59e0b)",
    textColor: "#fcd34d",
    tag: "! OTP REQUIRED",
  },
  BLOCK: {
    label: "Transaction Blocked",
    sublabel: "High fraud risk — transaction has been declined",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    glowColor: "rgba(239,68,68,0.3)",
    bgCard: "rgba(239,68,68,0.06)",
    borderColor: "rgba(239,68,68,0.25)",
    badgeStyle: { background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" },
    barColor: "linear-gradient(90deg, #dc2626, #ef4444)",
    textColor: "#fca5a5",
    tag: "✕ BLOCKED",
  },
};

function AnimatedRiskBar({ score, barColor }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.min(score * 100, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div style={{
      height: 10, borderRadius: 100,
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        height: "100%",
        borderRadius: 100,
        background: barColor,
        width: `${width}%`,
        transition: "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: `0 0 12px currentColor`,
      }} />
    </div>
  );
}

function RiskSegment({ label, active, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
      <div style={{
        height: 4, width: "100%", borderRadius: 100,
        background: active ? color : "rgba(255,255,255,0.08)",
        transition: "background 0.5s ease",
      }} />
      <span style={{ fontSize: 10, color: active ? color : "var(--text-muted)", fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
    </div>
  );
}

function ResultCard({ data }) {
  const decision = data.decision || "ALLOW";
  const riskScore = data.riskScore || 0;
  const cfg = DECISION_CONFIG[decision] || DECISION_CONFIG.ALLOW;
  const riskPercent = (riskScore * 100).toFixed(1);

  const riskLevel = riskScore < 0.33 ? "Low" : riskScore < 0.66 ? "Medium" : "High";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Decision Card */}
      <div className="glass-card animate-badge-pop" style={{
        border: `1px solid ${cfg.borderColor}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${cfg.glowColor}`,
        overflow: "hidden",
      }}>

        {/* Top accent strip */}
        <div style={{ height: 4, background: cfg.gradient, width: "100%" }} />

        <div style={{ padding: "24px 28px" }}>

          {/* Status Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: cfg.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 24px ${cfg.glowColor}`,
            }}>
              {cfg.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h3 style={{
                  fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 18,
                  color: "white", margin: 0,
                }}>
                  {cfg.label}
                </h3>
                <span className="animate-badge-pop" style={{
                  ...cfg.badgeStyle,
                  padding: "3px 10px", borderRadius: 100,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}>
                  {cfg.tag}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {cfg.sublabel}
              </p>
            </div>
          </div>

          {/* Risk Score Section */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "20px 20px 16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                  📊 Fraud Risk Score
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: cfg.textColor, fontFamily: "Space Grotesk", lineHeight: 1 }}>
                  {riskPercent}<span style={{ fontSize: 18, opacity: 0.7 }}>%</span>
                </div>
              </div>
              <div style={{
                padding: "6px 14px", borderRadius: 100,
                fontSize: 13, fontWeight: 700,
                ...cfg.badgeStyle,
              }}>
                {riskLevel} Risk
              </div>
            </div>

            <AnimatedRiskBar score={riskScore} barColor={cfg.barColor} />

            {/* Segments */}
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <RiskSegment label="Low" active={riskScore < 0.33} color="#10b981" />
              <RiskSegment label="Medium" active={riskScore >= 0.33 && riskScore < 0.66} color="#f59e0b" />
              <RiskSegment label="High" active={riskScore >= 0.66} color="#ef4444" />
            </div>
          </div>

          {/* Transaction Summary */}
          {data.userProfile && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12,
              }}>
                Transaction Summary
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {data.userProfile.transaction_amount != null && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Amount</div>
                    <div style={{ fontWeight: 700, color: "white", fontFamily: "Space Grotesk", fontSize: 16 }}>
                      ₹{parseFloat(data.userProfile.transaction_amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
                {data.userProfile.suspicious_keywords != null && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Fraud Flags</div>
                    <div style={{
                      fontWeight: 700,
                      fontFamily: "Space Grotesk",
                      fontSize: 16,
                      color: data.userProfile.suspicious_keywords.length > 0 ? "#fca5a5" : "#6ee7b7",
                    }}>
                      {data.userProfile.suspicious_keywords.length} flag{data.userProfile.suspicious_keywords.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enriched Data Viewer */}
      <EnrichedDataViewer data={data.enrichedData} />
    </div>
  );
}

export default ResultCard;