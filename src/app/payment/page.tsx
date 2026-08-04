"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, Suspense } from "react";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const status = searchParams.get('status');
  const isSuccess = status === 'success';

  const handleGoDashboard = async () => {
    if (isSuccess && session?.user?.email) {
      setLoading(true);
      try {
        const res = await fetch('/api/checkout/activate-premium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email }),
        });
        
        const data = await res.json();
        if (data.success) {
          await update();
        }
      } catch (err) {
        console.error("failed to update statues:", err);
      }
    }
    
    router.push('/');
  };

  return (
    <div className={`max-w-md w-full bg-[#222]/55 backdrop-blur-sm border ${isSuccess ? 'border-[#2DEBC9]/30' : 'border-white/10'} rounded-xl p-8 text-center shadow-2xl`}>

      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white/5 border-2 ${isSuccess ? 'border-[#2DEBC9] text-[#2DEBC9]' : 'border-white/20 text-gray-400'}`}>
        {isSuccess ? (
          <svg
            className="w-11 h-11 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 60,
              strokeDashoffset: 60,
              animation: 'drawCheck 0.6s ease-out 0.2s forwards' 
            }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="text-xl font-bold">✕</span>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {isSuccess ? 'Upgrade Successful!' : 'Payment Cancelled'}
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        {isSuccess
          ? 'Thank you for subscribing to Weathia Premium. Your advanced weather insights are now unlocked.'
          : 'The checkout process was cancelled. No charges were made to your account.'}
      </p>

      <button
        onClick={handleGoDashboard}
        disabled={loading}
        className={`block w-full py-3 rounded-full font-bold text-xs uppercase tracking-wider text-center transition ${
          isSuccess
            ? 'bg-gradient-to-br from-white via-[#80F3DA] to-[#04DBAC] text-black hover:brightness-95'
            : 'bg-white text-black hover:bg-gray-100'
        } disabled:opacity-50 cursor-pointer`}
      >
        {loading ? 'Updating Status...' : (isSuccess ? 'Go to Dashboard' : 'Back to Home')}
      </button>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-6">
      <Suspense fallback={<div className="text-sm text-gray-400 animate-pulse">Loading payment details...</div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}