"use client";

import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { PreviewDevice } from "./builder-device-switcher";
import { BuilderDeviceSwitcher } from "./builder-device-switcher";

export function BuilderTopbar({ name, published, slug, device, onDeviceChange, onPreview, onPublish }: { name: string; published: boolean; slug?: string; device: PreviewDevice; onDeviceChange: (device: PreviewDevice) => void; onPreview: () => void; onPublish: () => void }) { const copy = async () => { if (slug) await navigator.clipboard.writeText(`${window.location.origin}/u/${slug}`); }; return <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3"><div><p className="font-semibold">{name || "New portfolio"}</p><Badge className="mt-1">{published ? "Published" : "Draft"}</Badge></div><BuilderDeviceSwitcher value={device} onChange={onDeviceChange} /><div className="flex items-center gap-2"><Button type="button" className="inline-flex items-center gap-2 bg-white text-primary ring-1 ring-primary" onClick={onPreview}><ExternalLink size={16} /> Preview</Button>{published && slug && <Button type="button" className="inline-flex items-center gap-2 bg-white text-primary ring-1 ring-primary" aria-label="Copy public link" onClick={() => void copy()}><LinkIcon size={16} /> Copy link</Button>}<Button type="button" onClick={onPublish}>{published ? "Unpublish" : "Publish"}</Button></div></header>; }
