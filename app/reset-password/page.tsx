"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.auth.updateUser({
      password: form.get("password") as string,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else router.push("/");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-10 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4">set a new password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="password" type="password" required minLength={6} placeholder="new password" className="border border-zinc-300 rounded px-2 py-1" />
        {error && <p className="text-red-600">{error}</p>}
        <button disabled={submitting} className="bg-[#FF851B] text-[#111111] font-semibold rounded px-4 py-2 disabled:opacity-50">
          {submitting ? "saving..." : "save password"}
        </button>
      </form>
    </div>
  );
}
