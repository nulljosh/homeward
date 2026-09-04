"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.resetPasswordForEmail(form.get("email") as string, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-10 font-sans text-sm">
        <h1 className="text-lg font-bold mb-2">check your email</h1>
        <p>If that account exists, a password reset link is on its way.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4">forgot password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" required placeholder="email" className="border border-zinc-300 rounded px-2 py-1" />
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={submitting} className="bg-[#FF851B] text-[#111111] font-semibold rounded px-4 py-2 disabled:opacity-50">
          {submitting ? "sending..." : "send reset link"}
        </button>
      </form>
    </div>
  );
}
