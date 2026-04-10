import { useState, useRef, useEffect } from "react";

const POPULAR_MERCHANTS = [
  { name: "Amazon", emoji: "🛒", category: "E-commerce" },
  { name: "Flipkart", emoji: "📦", category: "E-commerce" },
  { name: "Google Pay", emoji: "💚", category: "Payments" },
  { name: "PhonePe", emoji: "💜", category: "Payments" },
  { name: "Paytm", emoji: "🔵", category: "Payments" },
  { name: "Swiggy", emoji: "🍔", category: "Food Delivery" },
  { name: "Zomato", emoji: "🍕", category: "Food Delivery" },
  { name: "IRCTC", emoji: "🚂", category: "Travel" },
  { name: "MakeMyTrip", emoji: "✈️", category: "Travel" },
  { name: "Myntra", emoji: "👗", category: "Fashion" },
  { name: "Netflix", emoji: "🎬", category: "Entertainment" },
  { name: "Spotify", emoji: "🎵", category: "Entertainment" },
];

function MerchantCombobox({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = POPULAR_MERCHANTS.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  // Sync internal query with parent value when it clears
  useEffect(() => {
    if (value === "") setQuery("");
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (merchantName) => {
    setQuery(merchantName);
    onChange(merchantName);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        {/* Store icon */}
        <span style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          fontSize: 18, zIndex: 1, pointerEvents: "none", opacity: 0.5
        }}>🏪</span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Search or type merchant name..."
          disabled={disabled}
          className="premium-input"
          style={{ paddingRight: 44 }}
          autoComplete="off"
        />

        {/* Chevron toggle */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(!open); inputRef.current?.focus(); }}
          disabled={disabled}
          style={{
            position: "absolute", right: 14, top: "50%", transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", transition: "transform 0.2s ease",
            display: "flex", alignItems: "center", fontSize: 13,
          }}
        >
          ▾
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="merchant-dropdown">
          {/* Popular label */}
          {query === "" && (
            <div style={{
              padding: "10px 16px 6px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              Popular Merchants
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: 14, textAlign: "center" }}>
              No matches — your typed name will be used
            </div>
          ) : (
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {filtered.map((m) => (
                <div
                  key={m.name}
                  className="merchant-option"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(m.name); }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{m.category}</div>
                  </div>
                  {value === m.name && (
                    <span style={{ color: "#6366f1", fontSize: 16 }}>✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, icon, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        marginBottom: 8,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: "var(--text-secondary)",
        textTransform: "uppercase",
      }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function PaymentForm({ setResult }) {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !amount.trim() || !merchant.trim()) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a valid positive number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, merchant }),
      });

      const data = await res.json();
      setResult(data);
      setUserId("");
      setAmount("");
      setMerchant("");
    } catch (err) {
      setError("Unable to connect to server. Please check your connection and try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="glass-card p-7" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>

        {/* Form Header */}
        <div className="flex items-center gap-3 mb-7">
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(99,102,241,0.4)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="4" width="22" height="16" rx="3" stroke="white" strokeWidth="2"/>
              <path d="M1 10h22" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 20, color: "white", margin: 0 }}>
              Payment Details
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              Fill in the details to check fraud risk
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="animate-fade-in mb-6" style={{
            padding: "14px 16px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1.2 }}>⚠️</span>
            <p style={{ fontSize: 14, color: "#fca5a5", lineHeight: 1.5, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* User ID */}
          <InputField label="User ID" icon="👤">
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                fontSize: 18, opacity: 0.5, pointerEvents: "none",
              }}>🔑</span>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. user_123 or customer_id"
                disabled={loading}
                className="premium-input"
              />
            </div>
          </InputField>

          {/* Amount in INR */}
          <InputField label="Transaction Amount (INR)" icon="💰">
            <div style={{ position: "relative", display: "flex" }}>
              {/* INR prefix box */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 52, display: "flex", alignItems: "center", justifyContent: "center",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                color: "#a5b4fc",
                fontWeight: 700,
                fontSize: 17,
                fontFamily: "Space Grotesk",
                zIndex: 1,
              }}>
                ₹
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={loading}
                className="premium-input"
                style={{ paddingLeft: 64 }}
              />
            </div>
            {amount && !isNaN(amount) && parseFloat(amount) > 0 && (
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)", paddingLeft: 4 }}>
                ≈ ₹{parseFloat(amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </div>
            )}
          </InputField>

          {/* Merchant — Combobox */}
          <InputField label="Merchant Name" icon="🏪">
            <MerchantCombobox
              value={merchant}
              onChange={setMerchant}
              disabled={loading}
            />
            <p style={{ marginTop: 6, fontSize: 12, color: "var(--text-muted)", paddingLeft: 4 }}>
              Select from popular list or type any custom merchant name
            </p>
          </InputField>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" }} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-neon"
          style={{
            width: "100%",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: 20, height: 20,
                border: "2.5px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
              }} className="animate-spin-slow" />
              <span>Analyzing Transaction...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Analyze & Submit Payment</span>
            </>
          )}
        </button>

        {/* Trust Badges */}
        <div style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
          {["🔒 Encrypted", "🤖 AI Scored", "⚡ Real-time"].map((badge) => (
            <span key={badge} style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}

export default PaymentForm;