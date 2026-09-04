"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase, Listing } from "@/lib/supabase";
import AuthBar from "@/lib/AuthBar";
import "./landing.css";

// Modelled on the real posters seeded on the board — the first three are the
// actual neighbourhood cases, the rest is generic filler so the wall stays full.
const SAMPLES: [string, string, string][] = [
  ["lost", "Oakley, siamese", "203 St & 54A Ave, Langley"],
  ["lost", "Cali, calico", "Portage Park, Langley"],
  ["lost", "grey cat", "Langley"],
  ["found", "black lab", "Trout Lake"],
  ["lost", "grey whippet", "Kits Beach"],
  ["found", "orange tabby", "Mount Pleasant"],
  ["lost", "border collie", "Queen Elizabeth Park"],
  ["found", "budgie", "Main & 24th"],
  ["lost", "tortoiseshell cat", "Strathcona"],
  ["found", "shih tzu", "Stanley Park seawall"],
  ["lost", "husky mix", "Burnaby Heights"],
  ["found", "white rabbit", "Jericho"],
  ["lost", "ginger kitten", "Fraser & King Ed"],
  ["found", "beagle", "New Westminster Quay"],
  ["lost", "tabby cat", "Commercial Drive"],
  ["found", "corgi", "Olympic Village"],
  ["lost", "grey parrot", "Gastown"],
  ["found", "tuxedo cat", "Renfrew"],
  ["lost", "jack russell", "Deep Cove"],
  ["found", "german shepherd", "Central Park"],
  ["lost", "ragdoll cat", "Yaletown"],
  ["found", "cockatiel", "Kerrisdale"],
  ["lost", "dachshund", "Coal Harbour"],
  ["found", "calico cat", "Hastings-Sunrise"],
];

function HeroWall() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wall = ref.current;
    if (!wall) return;
    wall.replaceChildren();

    const items = [...SAMPLES];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // shuffle, so the wall differs each visit
      [items[i], items[j]] = [items[j], items[i]];
    }

    const cols = Math.max(3, Math.min(7, Math.ceil(window.innerWidth / 220)));
    const per = Math.max(4, Math.floor(items.length / cols));
    for (let c = 0; c < cols; c++) {
      const col = document.createElement("div");
      col.className = `wall-col ${c % 2 ? "down" : "up"}`;
      col.style.setProperty("--dur", `${70 + c * 11}s`);
      const slice = items.slice(c * per, (c + 1) * per);
      for (const [type, what, where] of [...slice, ...slice]) { // doubled, so the loop is seamless
        const el = document.createElement("span");
        const tag = document.createElement("i");
        tag.className = type;
        tag.textContent = type;
        const name = document.createElement("b");
        name.textContent = what;
        el.append(tag, name, document.createTextNode(where));
        col.appendChild(el);
      }
      wall.appendChild(col);
    }
  }, []);

  return <div className="hero-wall" ref={ref} aria-hidden="true" />;
}

export default function Landing() {
  const [recent, setRecent] = useState<Listing[]>([]);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setRecent((data as Listing[]) ?? []));
  }, []);

  return (
    <div className="lp">
      <section className="hero">
        <HeroWall />
        <div className="container">
          <div className="topbar">
            <span className="name">homeward</span>
            <span><Link href="/board">browse the board</Link> · <AuthBar /></span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-icon" src="/icon.svg" alt="Homeward icon" width={88} height={88} />
          <h1>A lost pet doesn&apos;t have time for a signup form.</h1>
          <p>
            A plain public board for lost and found pets. Post in under a minute with no
            account, and keep a private link to close the listing the moment they turn up.
          </p>
          <div className="buttons">
            <Link className="btn btn-primary" href="/post">Post a lost or found pet</Link>
            <Link className="btn btn-outline" href="/board">Browse the board</Link>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="recent">
          <div className="container" style={{ maxWidth: "44rem", paddingTop: "3rem" }}>
            <h2 style={{ marginBottom: "1.25rem" }}>On the board right now</h2>
            <ul>
              {recent.map((l) => (
                <li key={l.id}>
                  <Link href={`/listing?id=${l.id}`}>
                    <span className={`tag ${l.type}`}>{l.type}</span>
                    <b>{l.pet_name || l.species}</b>
                    <span className="meta">{l.species}{l.color ? `, ${l.color}` : ""}</span>
                    <span className="where">{l.last_seen_location}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="features">
        <div className="container">
          <h2>How it works</h2>
          <div className="grid">
            <div className="feature">
              <h3>No account needed</h3>
              <p>
                Post anonymously when every minute counts. You get a private edit link that
                nobody else has, so only you can change or close your listing.
              </p>
            </div>
            <div className="feature">
              <h3>Searchable, not a feed</h3>
              <p>
                Filter lost from found and search by name, species, colour, tag or chip
                number, or where the pet was last seen. Nothing scrolls away.
              </p>
            </div>
            <div className="feature">
              <h3>Public on purpose</h3>
              <p>
                Every listing is readable without logging in, so neighbours, shelters and
                vets can actually find it — and so can a search engine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Install it anywhere</h2>
          <div className="grid">
            <div className="feature">
              <h3>Web</h3>
              <p>Nothing to install. The whole board works in any modern browser.</p>
              <Link href="/board">Open the board &rarr;</Link>
            </div>
            <div className="feature">
              <h3>iPhone and Mac</h3>
              <p>
                Native apps built from the same sources, with a two-pane window on the Mac.
                Not on the App Store yet.
              </p>
            </div>
            <div className="feature">
              <h3>Android, Windows, Linux</h3>
              <p>
                A real installable app, not a bookmark — one Kotlin/Compose codebase built
                into an APK, an MSI and a DEB. Downloads land with the first release.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container">
          <h2 style={{ marginBottom: "1rem" }}>Free, and staying that way</h2>
          <p>
            No ads, no accounts required, no reason to sit on a listing. If it helps one
            animal get home it has paid for itself.
          </p>
          <div className="buttons">
            <Link className="btn btn-primary" href="/post">Post a listing</Link>
          </div>
        </div>
      </section>

      <footer><div className="container">Built by Joshua.</div></footer>
    </div>
  );
}
