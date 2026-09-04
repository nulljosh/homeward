"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, Listing } from "@/lib/supabase";

export default function PostListing() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    let photo_url: string | null = null;
    if (photo) {
      const path = `${crypto.randomUUID()}-${photo.name}`;
      const { data, error } = await supabase.storage.from("pet-photos").upload(path, photo);
      if (!error && data) {
        photo_url = supabase.storage.from("pet-photos").getPublicUrl(data.path).data.publicUrl;
      }
    }

    const { data, error } = await supabase
      .rpc("create_listing", {
        type: form.get("type"),
        species: form.get("species"),
        last_seen_location: form.get("last_seen_location"),
        pet_name: form.get("pet_name"),
        color: form.get("color"),
        description: form.get("description"),
        tag_number: form.get("tag_number"),
        contact_phone: form.get("contact_phone"),
        contact_email: form.get("contact_email"),
        reward: form.get("reward") || null,
        sex: form.get("sex") || null,
        last_seen_at: form.get("last_seen_at") || null,
        photo_url,
      })
      .single();

    setSubmitting(false);
    if (!error && data) {
      setEditToken((data as Listing).edit_token ?? null);
    }
  }

  if (editToken) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 font-sans text-sm">
        <h1 className="text-lg font-bold mb-2">Listing posted!</h1>
        <p className="mb-4">
          Save this link to edit or mark your listing resolved later — it won&apos;t be shown again:
        </p>
        <code className="block bg-zinc-100 p-2 rounded break-all mb-4">
          {typeof window !== "undefined" ? window.location.origin : ""}/listing/edit?token={editToken}
        </code>
        <button onClick={() => router.push("/board")} className="text-[#0074D9] underline">
          back to listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 font-sans text-sm">
      <h1 className="text-lg font-bold mb-4">post a lost/found pet</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          type
          <select name="type" required className="border border-zinc-300 rounded px-2 py-1">
            <option value="lost">lost</option>
            <option value="found">found</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          pet name (if known)
          <input name="pet_name" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          species
          <input name="species" required placeholder="cat, dog, ..." className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          color / description
          <input name="color" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          notes (temperament, identifying marks, etc.)
          <textarea name="description" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          ear tattoo / tag / chip number
          <input name="tag_number" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          last seen location
          <input name="last_seen_location" required className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          last seen date
          <input name="last_seen_at" type="date" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          sex
          <select name="sex" className="border border-zinc-300 rounded px-2 py-1">
            <option value="">unknown</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          reward (optional)
          <input name="reward" placeholder="$1000" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="border border-zinc-300 rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          contact phone
          <input name="contact_phone" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <label className="flex flex-col gap-1">
          contact email
          <input name="contact_email" type="email" className="border border-zinc-300 rounded px-2 py-1" />
        </label>
        <button
          disabled={submitting}
          className="mt-2 bg-[#FF851B] text-[#111111] font-semibold rounded px-4 py-2 disabled:opacity-50"
        >
          {submitting ? "posting..." : "post listing"}
        </button>
      </form>
    </div>
  );
}
