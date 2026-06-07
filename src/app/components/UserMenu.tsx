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
      // 情况 A：已登录头像
      <button className="flex w-6 h-6 items-center justify-center cursor-pointer">
        {session.user.image ? (
          <img src="/icons/user-logged-in.svg" alt="logged_in" className="w-auto h-full" />
        ) : (
          <span className="text-sm">{session.user.email?.charAt(0).toUpperCase()}</span>
        )}
      </button>
    ) : (
      // 情况 B：离线游客灰色图标
      <button className="flex w-6 h-6 items-center justify-center cursor-pointer">
        <img src="/icons/user-logged-out.svg" alt="logged_out" className="w-auto h-full" />
      </button>
    )}
    {isDropdownOpen && (
      <>
        {/* 已登录用户的下拉菜单 */}
        {session?.user ? (
          <div className="absolute right-0 mt-2 w-52 bg-[#222]/55 backdrop-blur-sm rounded-lg shadow-xl py-1.5 border border-gray-100 z-50 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-gray-50 truncate">
              {session.user.email}
            </div>
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 transition">
              Saved Locations
            </button>
            <hr className="border-gray-100 my-1" />
            <button
              onClick={() => { setIsDropdownOpen(false); signOut(); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* 离线游客福利菜单 */
          <div className="absolute right-0 mt-2 w-72 bg-[#222]/55 backdrop-blur-sm rounded-md shadow-2xl p-6 z-50 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="font-bold text-lg text-white mb-1 leading-tight">Don't have an account ?</h3>
            <p className="text-xs text-white mb-4">Create one and start enjoying your perks right away.</p>

            <ul className="text-xs text-white space-y-2.5 mb-6 pl-1">
              <li className="flex items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Save unlimited favorite cities</li>
              <li className="flex items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Real-time severe weather alerts</li>
              <li className="flex items-center gap-2"><span className="text-[#2DEBC9]">✓</span> Personalized climate dashboards</li>
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
