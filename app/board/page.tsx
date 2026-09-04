"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Listing } from "@/lib/supabase";
import AuthBar from "@/lib/AuthBar";

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setListings((data as Listing[]) ?? []));
  }, []);

  const filtered = listings.filter((l) => {
    if (filter !== "all" && l.type !== filter) return false;
    if (!query) return true;
    const haystack = `${l.pet_name ?? ""} ${l.species} ${l.color ?? ""} ${l.last_seen_location}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 font-sans text-sm">
      <header className="flex items-baseline justify-between border-b border-zinc-300 pb-2 mb-4">
        <Link href="/" className="text-xl font-bold">homeward</Link>
        <div className="flex items-center gap-3">
          <Link href="/post" className="text-[#0074D9] underline hover:text-[#001F3F]">
            post a listing
          </Link>
          <AuthBar />
        </div>
      </header>

      <div className="flex gap-3 mb-4 items-center">
        {(["all", "lost", "found"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 border rounded ${
              filter === f ? "bg-[#FF851B] text-[#111111] font-semibold" : "border-zinc-300"
            }`}
          >
            {f}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search name, species, location..."
          className="ml-auto border border-zinc-300 rounded px-2 py-1 flex-1 max-w-xs"
        />
      </div>

      <ul className="divide-y divide-zinc-200">
        {filtered.map((l) => (
          <li key={l.id} className="py-2">
            <Link href={`/listing?id=${l.id}`} className="flex items-baseline gap-2 hover:underline">
              <span
                className={`uppercase text-xs font-bold px-1 rounded ${
                  l.type === "lost" ? "bg-[#FF4136] text-[#111111]" : "bg-[#2ECC40] text-[#111111]"
                }`}
              >
                {l.type}
              </span>
              <span className="font-medium">{l.pet_name || l.species}</span>
              <span className="text-zinc-500">— {l.species}, {l.color}</span>
              <span className="text-zinc-400 ml-auto">{l.last_seen_location}</span>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-zinc-400">no listings yet</li>
        )}
      </ul>
    </div>
  );
}
