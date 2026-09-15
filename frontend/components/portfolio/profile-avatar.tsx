"use client";

import Image from "next/image";
import { useState } from "react";

export function ProfileAvatar({ src, name, width, height, className, fallbackClassName }: { src?: string; name: string; width: number; height: number; className: string; fallbackClassName: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

  if (!src || failed) {
    return <span aria-label={`${name} profile photo unavailable`} className={fallbackClassName}>{initials}</span>;
  }

  return <Image src={src} alt={`${name} profile photo`} width={width} height={height} className={className} onError={() => setFailed(true)} />;
}
