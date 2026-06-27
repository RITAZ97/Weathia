"use client";

import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ActivateTrialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2DEBC9] border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
        <div className="max-w-md w-full bg-[#222]/55 backdrop-blur-sm rounded-md shadow-2xl p-8 text-center border border-white/10">
          <h3 className="font-bold text-lg text-white mb-2 leading-tight">Access Denied</h3>
          <p className="text-xs text-white/60 mb-6">You must be signed in to activate your free Premium trial.</p>
          <button
            onClick={() => signIn()}
            className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-2.5 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmTrial = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout/activate-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user?.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✨ Your 2-week Premium trial has been activated successfully!');
        router.refresh();
        router.push('/');
      } else {
        alert(data.error || 'Failed to activate trial.');
      }
    } catch (error) {
      console.error('Activate trial error:', error);
      alert('Network error, please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
      <div className="max-w-md w-full bg-[#222]/55 backdrop-blur-sm rounded-md shadow-2xl p-8 border border-white/10 text-white animate-in fade-in slide-in-from-top-2 duration-200">
        <h3 className="font-bold text-xl text-[#2DEBC9] mb-4 leading-tight flex items-center gap-1.5">
          Do you want to activate your 2-week free trial?
        </h3>

        {/* Confirmation & Terms Statement */}
        <div className="text-s text-white/90 leading-relaxed pl-1 mb-8">
          <ul className=" py-4 text-white/70 pl-1 list-none">
            <li className="flex items-center gap-2">
              <span className="text-[#2DEBC9]">✓</span> Save & sync up to 99 cities worldwide
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#2DEBC9]">✓</span> Interactive AI Weather Consultant
            </li>
          </ul>

          <div className="bg-white/5 border border-white/10 rounded mt-4 px-3 py-2.5 text-white/60 text-[12px] leading-normal">
            <span className="text-[#2DEBC9] font-bold">Please note:</span> This promotional trial can only be activated <span className="text-white font-semibold underline underline-offset-2">once per account</span>. You will not be eligible to claim another trial after it expires.
          </div>
        </div>

        <button
          onClick={handleConfirmTrial}
          disabled={isLoading}
          className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-2.5 rounded-full font-bold
          text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition mb-3 disabled:opacity-50 flex items-center justify-center min-h-[38px]"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            '⚡ Yes, Activate Trial'
          )}
        </button>

        <button
          onClick={() => router.back()}
          disabled={isLoading}
          className="w-full bg-transparent text-white py-2.5 rounded-full font-bold text-xs uppercase tracking-wider border border-white/20 
          cursor-pointer hover:bg-white/5 transition disabled:opacity-50"
        >
          Cancel and Go Back
        </button>
      </div>
    </div>
  );
}