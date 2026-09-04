"use client";

import { supabase } from "@/lib/supabase";

const providers = [
  { id: "apple", label: "Apple" },
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
] as const;

export default function OAuthButtons() {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: p.id,
              options: { redirectTo: `${window.location.origin}/` },
            })
          }
          className="border border-zinc-300 rounded px-4 py-2 hover:bg-zinc-50"
        >
          continue with {p.label}
        </button>
      ))}
      <div className="text-center text-zinc-400 text-xs">or use your email</div>
    </div>
  );
}
