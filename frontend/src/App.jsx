import { useState } from "react";
import PaymentForm from "./components/PaymentForm";
import ResultCard from "./components/ResultCard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <div
          className="absolute animate-orb-float"
          style={{
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute animate-orb-float"
          style={{
            bottom: '-15%',
            left: '-10%',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '3s',
          }}
        />
        {/* Accent orb */}
        <div
          className="absolute animate-pulse-soft"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation Bar */}
        <nav className="w-full px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-heading font-700 text-base text-white" style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>FraudGateway</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full font-600" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>BETA</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="pulse-dot" style={{ background: '#10b981', color: '#10b981' }}></div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>System Online</span>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 px-4 py-10 sm:px-6">
          <div className="max-w-2xl mx-auto">
            
            {/* Hero Header */}
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
                AI-Powered Fraud Detection
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight"
                style={{ fontFamily: 'Space Grotesk', letterSpacing: '-1.5px', color: 'white' }}>
                Secure{" "}
                <span className="gradient-text">Payment</span>
                <br />Gateway
              </h1>
              <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Real-time fraud analysis powered by machine learning. Every transaction is scored before processing.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up delay-200">
              {[
                { label: 'Detection Rate', value: '99.7%', icon: '🎯' },
                { label: 'Transactions', value: '2.4M+', icon: '⚡' },
                { label: 'Response Time', value: '<50ms', icon: '🚀' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card text-center py-4 px-3">
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Payment Form */}
            <div className="animate-fade-in-up delay-300">
              <PaymentForm setResult={setResult} />
            </div>

            {/* Result Card */}
            {result && (
              <div className="mt-6 animate-fade-in-up">
                <ResultCard data={result} />
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-6 text-center border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            🔒 Bank-level AES-256 encryption · ML fraud scoring · PCI DSS compliant
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;