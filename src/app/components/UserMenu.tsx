"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { timeEnd } from 'node:console';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (<div
    className="relative inline-block"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {session?.user ? (
      <button className="flex w-7 h-7 rounded-full border-2 border-[#2DEBC9] items-center justify-center cursor-pointer">
        {session.user.image ? (
          <img src="/icons/user-logged-in.svg" alt="logged_in" className="w-auto h-full" />
        ) : (
          <span className="text-sm font-medium text-center">{session.user.email?.charAt(0).toUpperCase()}</span>
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
            <div className="px-2 py-2 flex gap-2 items-end text-white font-medium truncate">
              <img src="/icons/user-logged-in.svg" alt="logged_out" className="w-auto h-5" />
              <p className="text-sm">{session.user.email}</p>
            </div>
            <h3 className="px-2 py-2 font-bold text-lg text-white mb-1 leading-tight">Welcome back!</h3>
            <ul className="text-xs px-2 py-1  text-white space-y-2.5 mb-6 pl-1">
              <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Extended 24-hour hourly forecasts</li>
              <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Expand your city limits to 15</li>
              <li className="flex pl-1 items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Unlock a free 2-week Premium trial</li>
            </ul>

            <button
              onClick={() => { setIsDropdownOpen(false); signOut(); }}
              className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-2.5 rounded-full font-bold
               text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition mb-2.5"
            >
              Sign Out
            </button>
            <button
              onClick={() => { setIsDropdownOpen(false); router.push('/auth/register?mode=register'); }}
              className="w-full bg-white text-black py-2.5 rounded-full font-bold text-xs uppercase tracking-wider border border-black 
              cursor-pointer hover:bg-gray-100 transition"
            >
              Add Another Account
            </button>
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
  </div>)
}
