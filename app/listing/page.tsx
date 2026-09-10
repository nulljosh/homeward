"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, Listing } from "@/lib/supabase";

function ListingDetailInner() {
  const id = useSearchParams().get("id");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setListing(data as Listing));
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
  }, [id]);

  async function markFound() {
    if (!id) return;
    const { data } = await supabase.rpc("resolve_listing", { p_id: id }).single();
    if (!data) return;
    setListing(data as Listing);
    supabase.functions.invoke("notify-found", { body: { listingId: id } });
  }

  if (!listing) {
    return <div className="max-w-xl mx-auto px-4 py-10 font-sans text-sm">loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 font-sans text-sm">
      <Link href="/board" className="text-[#0074D9] underline">
        &larr; back
      </Link>
      <h1 className="text-xl font-bold mt-3 mb-1">
        {listing.type === "lost" ? "Lost" : "Found"}: {listing.pet_name || listing.species}
      </h1>
      {listing.status === "resolved" ? (
        <p className="text-green-700 font-semibold mb-2">resolved</p>
      ) : (
        loggedIn && (
          <button
            onClick={markFound}
            className="mb-3 bg-[#2ECC40] text-[#111111] font-semibold rounded px-4 py-2"
          >
            mark found
          </button>
        )
      )}
      {listing.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.photo_url}
          alt={listing.pet_name ?? listing.species}
          className="rounded mb-3 w-full h-auto object-cover"
        />
      )}
      <dl className="grid grid-cols-[120px_1fr] gap-y-1">
        <dt className="text-zinc-500">species</dt>
        <dd>{listing.species}</dd>
        <dt className="text-zinc-500">color</dt>
        <dd>{listing.color || "—"}</dd>
        <dt className="text-zinc-500">tag / chip #</dt>
        <dd>{listing.tag_number || "—"}</dd>
        <dt className="text-zinc-500">sex</dt>
        <dd>{listing.sex || "—"}</dd>
        <dt className="text-zinc-500">reward</dt>
        <dd>{listing.reward || "—"}</dd>
        <dt className="text-zinc-500">last seen</dt>
        <dd>{listing.last_seen_location}{listing.last_seen_at ? ` (${listing.last_seen_at})` : ""}</dd>
        <dt className="text-zinc-500">notes</dt>
        <dd>{listing.description || "—"}</dd>
        <dt className="text-zinc-500">contact</dt>
        <dd>
          {listing.contact_phone && <div>{listing.contact_phone}</div>}
          {listing.contact_email && <div>{listing.contact_email}</div>}
        </dd>
      </dl>
    </div>
  );
}

// useSearchParams needs a Suspense boundary to prerender at build time.
export default function ListingDetail() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-10 font-sans text-sm">loading...</div>}>
      <ListingDetailInner />
    </Suspense>
  );
}
