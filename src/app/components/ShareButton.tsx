"use client";

import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const [label, setLabel] = useState("Compartir");

  async function handleShare() {
    const shareData = { title, text, url: window.location.href };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setLabel("Copiado");
        window.setTimeout(() => setLabel("Compartir"), 1800);
      }
    } catch {
      setLabel("No disponible");
      window.setTimeout(() => setLabel("Compartir"), 1800);
    }
  }

  return <button className="share-btn" type="button" onClick={handleShare} aria-label={label}><span aria-hidden="true">↗</span><span>{label}</span></button>;
}
