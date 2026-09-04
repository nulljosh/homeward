"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthBar() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (email === undefined) return null;

  if (email) {
    return (
      <span className="text-zinc-500">
        {email} ·{" "}
        <button onClick={() => supabase.auth.signOut()} className="text-[#0074D9] underline">
          log out
        </button>
      </span>
    );
  }

  return (
    <Link href="/login" className="text-[#0074D9] underline hover:text-[#001F3F]">
      log in
    </Link>
  );
}
