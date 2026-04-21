"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  className?: string;
  onDarkBg?: boolean;
}

export function ExpandableText({ text, className = "", onDarkBg = false }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  const textColor = onDarkBg ? "text-[var(--on-dark-secondary)]" : "text-[var(--text-secondary)]";
  const btnColor = onDarkBg ? "text-white/80 hover:text-white" : "text-[var(--primary)] hover:underline";

  return (
    <p className={`leading-relaxed ${textColor} ${className}`} style={{ fontSize: "var(--text-base)" }}>
      <span className={!expanded ? "line-clamp-3" : undefined}>{text}</span>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`ml-1 font-medium focus:outline-none whitespace-nowrap ${btnColor}`}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </p>
  );
}
