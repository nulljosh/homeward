"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import OAuthButtons from "@/lib/OAuthButtons";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-4 py-10 font-sans text-sm">
        <h1 className="text-lg font-bold mb-2">check your email</h1>
        <p>We sent a confirmation link to finish creating your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4">register</h1>
      <OAuthButtons />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" required placeholder="email" className="border border-zinc-300 rounded px-2 py-1" />
        <input name="password" type="password" required minLength={6} placeholder="password" className="border border-zinc-300 rounded px-2 py-1" />
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={submitting} className="bg-[#FF851B] text-[#111111] font-semibold rounded px-4 py-2 disabled:opacity-50">
          {submitting ? "creating account..." : "register"}
        </button>
      </form>
      <Link href="/login" className="block mt-4 text-[#0074D9] underline">already have an account? log in</Link>
    </div>
  );
}
