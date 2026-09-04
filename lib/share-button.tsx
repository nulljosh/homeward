"use client";

// ponytail: navigator.share with a clipboard fallback. No backend, no analytics.
export default function ShareButton() {
  return (
    <button
      type="button"
      className="fixed bottom-4 right-4 z-50 rounded-full border border-black/20 bg-white px-3.5 py-2 text-sm shadow-sm hover:border-black/40 dark:border-white/20 dark:bg-neutral-900 dark:hover:border-white/40"
      onClick={(e) => {
        const btn = e.currentTarget;
        const data = { title: document.title, url: location.href };
        if (navigator.share) navigator.share(data).catch(() => {});
        else
          navigator.clipboard?.writeText(location.href).then(() => {
            btn.textContent = "Link copied";
            setTimeout(() => (btn.textContent = "Share"), 1600);
          });
      }}
    >
      Share
    </button>
  );
}
