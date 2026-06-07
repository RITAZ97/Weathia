'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setAuthMode('signup');
    } else {
      setAuthMode('signin');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (authMode === 'signin') {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        window.location.href = '/';
      }
    } else {
      try {
  setLoading(true);
  setError('');

  const res = await fetch('/api/register?action=register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Registration failed');
  }

  const data = await res.json();

  alert('Registration successful! Please sign in with your password.');
  setAuthMode('signin');
  setError('');

} catch (err: any) {
  console.error("Frontend catch caught error:", err);
  setError(err.message || 'Something went wrong during registration');
} finally {
  setLoading(false);
}
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
      <h1 className="text-2xl font-bold tracking-wider text-black uppercase mb-1">
        {authMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
      </h1>
      <p className="text-sm text-gray-500 mb-2">
        {authMode === 'signin' ? 'Login to Your Account' : 'Get started with us'}
      </p>

      <p className="text-sm text-gray-500 mb-6">
        {authMode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/register?mode=register')}
              className="font-semibold underline text-black hover:text-gray-600 transition"
            >
              Register
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/register?mode=login')}
              className="font-semibold underline text-black hover:text-gray-600 transition"
            >
              Sign In
            </button>
          </>
        )}
      </p>

      {error && (
        <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2.5 text-black placeholder-gray-400 text-sm focus:outline-none focus:border-black transition"
            required
          />
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2.5 text-black placeholder-gray-400 text-sm focus:outline-none focus:border-black transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-white via-[#80F3DA] via-60% to-[#04DBAC] to-90% text-black py-3 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer hover:brightness-90 transition mt-6 disabled:opacity-50"
        >
          {loading ? 'Processing...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        {authMode === 'signin' && (
          <div className="mt-4">
            <button
              type="button"
              className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-black transition uppercase"
            >
              Forgot Password?
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
} 