"use client";

import { useEffect, useState } from "react";

interface FreshnessIndicatorProps {
  lastFetchedAt: number;
}

export function FreshnessIndicator({ lastFetchedAt }: FreshnessIndicatorProps) {
  const [minutes, setMinutes] = useState(
    Math.floor((Date.now() - lastFetchedAt) / 60_000)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setMinutes(Math.floor((Date.now() - lastFetchedAt) / 60_000));
    }, 30_000);
    return () => clearInterval(id);
  }, [lastFetchedAt]);

  const fresh = minutes < 15;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs"
      style={{ fontFamily: "var(--font-body)", color: "var(--color-text-tertiary, #9E9890)" }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ background: fresh ? "#A8C4B8" : "#D97B4F" }}
      />
      Mis à jour il y a {minutes} min
    </span>
  );
}
