import { Button } from "@/components/ui";
export function ProfileSaveFooter({ dirty, busy, failed }: { dirty: boolean; busy: boolean; failed: boolean }) {
  return <div className="space-y-2"><p role="status" className={`text-xs ${failed ? "text-red-700" : "text-slate-500"}`}>{busy ? "Saving…" : failed ? "Save failed" : dirty ? "Unsaved changes" : "Saved"}</p><Button type="submit" form="portfolio-form" disabled={busy || !dirty} className="w-full">{busy ? "Saving…" : "Save Profile"}</Button></div>;
}
