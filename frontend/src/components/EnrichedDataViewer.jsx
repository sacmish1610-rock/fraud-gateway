import { useState } from "react";

function syntaxHighlight(json) {
  if (!json) return "";
  const str = JSON.stringify(json, null, 2);
  return str.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "json-key";
        } else {
          cls = "json-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "json-bool";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function EnrichedDataViewer({ data }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ width: "100%" }}>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          width: "100%",
          padding: "14px 20px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.2s ease",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(99,102,241,0.08)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
          e.currentTarget.style.color = "#a5b4fc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          e.currentTarget.style.color = "var(--text-secondary)";
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 14 }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          Technical Analysis Data
        </span>
        <span style={{
          fontSize: 12,
          transition: "transform 0.25s ease",
          display: "inline-block",
          transform: show ? "rotate(180deg)" : "rotate(0deg)",
          color: "#6366f1",
        }}>
          ▾
        </span>
      </button>

      {/* Expandable Panel */}
      {show && (
        <div
          className="animate-fade-in-up"
          style={{ marginTop: 8 }}
        >
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
          }}>

            {/* Panel Header */}
            <div style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(99,102,241,0.05)",
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>
                <span>📋</span>
                Enriched Transaction Data
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Language badge */}
                <span style={{
                  padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                  background: "rgba(99,102,241,0.15)", color: "#818cf8",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}>
                  JSON
                </span>
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: copied ? "#6ee7b7" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              </div>
            </div>

            {/* Line Numbers + Code */}
            <div style={{ maxHeight: 340, overflowY: "auto", position: "relative" }}>
              <style>{`
                .json-key   { color: #93c5fd; }
                .json-string { color: #86efac; }
                .json-number { color: #fbbf24; }
                .json-bool  { color: #c084fc; }
                .json-null  { color: #94a3b8; }
              `}</style>
              <pre style={{
                padding: "20px 24px",
                margin: 0,
                fontSize: 13,
                lineHeight: 1.7,
                overflowX: "auto",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              }}>
                <code
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
                />
              </pre>
            </div>

            {/* Footer hint */}
            <div style={{
              padding: "10px 20px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              fontSize: 12,
              color: "var(--text-muted)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>💡</span>
              This JSON contains enriched data: user profile, transaction patterns & external data enrichment
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrichedDataViewer;