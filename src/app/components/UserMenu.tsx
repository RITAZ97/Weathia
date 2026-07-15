"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, CheckoutSessionResponse } from '@/types/weather';


export default function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);

  const timeOutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    }
    setIsDropdownOpen(true);
  }

  const handleMouseLeave = () => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current)
    timeOutRef.current = setTimeout(() => { setIsDropdownOpen(false) }, 1000);
  }

  if (status === 'loading') {
    return <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 animate-pulse" />;
  }

  const handleUpgrade = async (): Promise<void> => {
    if (!session?.user) {
      signIn();
      return;
    }

    setIsPaymentLoading(true);
    try {
      const priceId = 'price_1TkMKsDrnf9PBdtp4VX9Q6A7';
      console.log('--- Preparing data for backend ---');
      console.log('Current user session:', session);
      console.log('Retrieved userId:', (session?.user as any)?.id);
      console.log('Retrieved priceId:', priceId);
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.email,
          priceId: priceId,
        }),
      });

      const data: CheckoutSessionResponse = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Stripe error:', error);
      alert('Network error, please try again later');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {session?.user ? (
        <button className="flex w-7 h-7 rounded-full border-2 border-[#2DEBC9] items-center justify-center cursor-pointer">
          {session.user.image ? (
            <img src="/icons/user-logged-in.svg" alt="logged_in" className="w-auto h-full" />
          ) : (
            <span className="text-sm font-medium text-center text-white">{session.user.email?.charAt(0).toUpperCase()}</span>
          )}
        </button>
      ) : (
        <button className="flex w-6 h-6 items-center justify-center cursor-pointer">
          <img src="/icons/user-logged-out.svg" alt="logged_out" className="w-auto h-full" />
        </button>
      )}

      {isDropdownOpen && (
        <>
          {session?.user ? (
            <div className="absolute right-0 w-72 bg-[#222]/55 backdrop-blur-sm rounded-md shadow-2xl p-6 z-50 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
              {(session.user as any).isPremium ? (
                <div className="px-2 flex gap-2 items-end text-white font-medium truncate">
                  <img src="/icons/user-premium.svg" alt="logged_out" className="w-auto h-5" />
                  <p className="text-sm">{session.user.email}</p>
                </div>
              ) : (
                <div className="px-2 py-2 flex gap-2 items-end text-white font-medium truncate">
                  <img src="/icons/user-logged-in.svg" alt="logged_out" className="w-auto h-5" />
                  <p className="text-sm">{session.user.email}</p>
                </div>
              )}

              {(session.user as any).isPremium ? (
                <h3 className="px-2 py-2 font-bold text-lg text-[#2DEBC9] mb-1 leading-tight flex items-center gap-1.5">
                  Weathia Premium
                </h3>
              ) : (
                <h3 className="px-2 py-2 font-bold text-lg text-white mb-1 leading-tight">Welcome back!</h3>
              )}
              {(session.user as any).isPremium ? (
                <ul className="text-xs px-2 py-1 text-white space-y-2.5 mb-6 pl-1">
                  <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> 48-Hour Detailed Hourly Forecast</li>
                  <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Save & sync up to 99 cities worldwide</li>
                  <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Interactive AI Weather Consultant</li>
                </ul>
              ) : (
                <ul className="text-xs px-2 py-1 text-white space-y-2.5 mb-6 pl-1">
                  <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Extended 24-hour hourly forecasts</li>
                  <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Expand your city limits to 15</li>
                  <li className="flex pl-1 items-center gap-2">
                    <span className="text-[#2DEBC9]">✓</span>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (session?.user) {
                          router.push('/premium/activate-trial');
                        } else {
                          router.push('/auth/register?mode=signin');
                        }
                      }}
                      className="text-[#2DEBC9] flex items-center underline underline-offset-4 hover:text-[#25ccae] transition cursor-pointer font-medium"
                    >
                      Unlock a free 2-week Premium trial
                    </button>
                  </li>
                </ul>
              )}

              {session?.user && (session.user as any).isPremium && (
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/chat'); 
                  }}
                  className="w-full mb-3 justify-center items-center py-2.5 px-4 border border-[#2DEBC9] rounded-full flex transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer group bg-transparent"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#2DEBC9] shadow-md shadow-[#2DEBC9]/50" />
                    <span className="text-xs font-medium text-white tracking-wider uppercase group-hover:text-[#2DEBC9] transition-colors">
                      Weathia Assistant
                    </span>
                  </div>
                </button>
              )}

              {!(session.user as any).isPremium && (
                <button
                  onClick={handleUpgrade}
                  disabled={isPaymentLoading}
                  className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-2.5 rounded-full font-bold
    text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition mb-2.5 disabled:opacity-50"
                >
                  {isPaymentLoading ? 'Redirecting...' : '⚡ Upgrade To Premium'}
                </button>
              )}

              <button
                onClick={() => { setIsDropdownOpen(false); signOut(); }}
                className="w-full text-xs uppercase font-bold bg-white text-black py-2.5 rounded-full tracking-wider
                cursor-pointer hover:bg-gray-100 transition mb-2.5"
              >
                Sign Out
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); router.push('/auth/register?mode=register'); }}
                className="w-full bg-transparent text-white py-2.5 rounded-full text-xs uppercase font-bold tracking-wider border border-white/20 
                cursor-pointer hover:bg-white/5 transition"
              >
                Add Another Account
              </button>
              <div className="mt-4 pt-2.5 px-1 text-[12px] text-white leading-tight">
                <p>
                  <span className="text-[#2DEBC9] font-medium">Test Mode: </span> Use Link payment or standard Stripe test cards to activate premium. No real fees.
                </p>
              </div>
            </div>

          ) : (
            <div className="absolute right-0 mt-2 w-72 bg-[#222]/55 backdrop-blur-sm rounded-md shadow-2xl p-6 z-50 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="font-bold text-lg text-white mb-1 leading-tight">Don't have an account ?</h3>
              <p className="text-xs text-white mb-4">Create one and start enjoying your perks right away.</p>

              <ul className="text-xs text-white space-y-2.5 mb-6 pl-1">
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Extended 24-hour hourly forecasts</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Expand your city limits to 15</li>
                <li className="flex items-center gap-2"><span className="text-white">✓</span> Unlock a free 2-week Premium trial</li>
              </ul>

              <button
                onClick={() => { setIsDropdownOpen(false); router.push('/auth/register?mode=signin'); }}
                className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-2.5 rounded-full font-bold
                text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition mb-2.5"
              >
                Sign In
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); router.push('/auth/register?mode=register'); }}
                className="w-full bg-white text-black py-2.5 rounded-full font-bold text-xs uppercase tracking-wider border border-black 
                cursor-pointer hover:bg-gray-100 transition"
              >
                Create An Account
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}