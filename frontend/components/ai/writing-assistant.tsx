"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button, Textarea } from "@/components/ui";
import { useImproveWritingMutation, type WritingAction, type WritingTarget } from "@/features/ai/writing-api";

const labels: Record<WritingAction, string> = {
  IMPROVE: "Improve writing", PROFESSIONAL: "Make professional", CONCISE: "Make concise",
  HIGHLIGHT_IMPACT: "Highlight impact", FIX_GRAMMAR: "Fix grammar",
};

export function WritingAssistant({ target, text, onAccept }: {
  target: WritingTarget; text: string; onAccept: (text: string) => void;
}) {
  const id = useId();
  const [generate, { isLoading }] = useImproveWritingMutation();
  const [menu, setMenu] = useState(false);
  const [action, setAction] = useState<WritingAction>("IMPROVE");
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState<{ original: string; edited: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pending = useRef<ReturnType<typeof generate> | null>(null);
  const generation = useRef(0);
  const max = target === "PROFILE_BIO" ? 3000 : 5000;
  useEffect(() => () => { generation.current++; pending.current?.abort(); }, []);

  async function improve() {
    if (pending.current) return;
    if (!text.trim()) { setError("Add some details first so AI has something to improve."); return; }
    if (text.trim().length < 5) { setError("Add a little more detail before improving this with AI."); return; }
    if (text.length > max) { setError(`Use at most ${max} characters for AI writing assistance.`); return; }
    setError("");
    const current = ++generation.current;
    const original = text;
    const request = generate({ target, action, text: original });
    pending.current = request;
    try {
      const response = await request.unwrap();
      if (generation.current !== current) return;
      const edited = response.data.suggestedText;
      if (edited.trim() === original.trim()) {
        setError("No changes recommended. Your text is already clear enough, or AI could not safely improve it.");
        setMenu(false);
        return;
      }
      setSuggestion({ original, edited }); setEditing(false); setMenu(false);
    } catch {
      if (generation.current === current) setError("AI writing assistance is currently unavailable. Your text has not changed. Please try again later.");
    } finally { if (generation.current === current) pending.current = null; }
  }

  const changed = suggestion !== null && suggestion.original !== text;
  return <div className="mt-2 space-y-2">
    <Button ref={trigger} type="button" variant="secondary" disabled={isLoading} aria-expanded={menu}
      onClick={() => { setMenu(!menu); setError(""); }}>
      {isLoading ? <Loader2 size={15} className="animate-spin motion-reduce:animate-none"/> : <Sparkles size={15}/>}
      {isLoading ? "Generating…" : "Improve with AI"}
    </Button>
    <span className="sr-only" role="status">{isLoading ? "Generating writing suggestion." : ""}</span>
    {menu && <div className="space-y-2 rounded-lg border p-3">
      <label htmlFor={`${id}-action`} className="text-sm font-medium">Writing action</label>
      <select id={`${id}-action`} value={action} onChange={e => setAction(e.target.value as WritingAction)}
        className="w-full rounded-md border bg-white p-2 text-sm" disabled={isLoading}>
        {(Object.keys(labels) as WritingAction[]).filter(value => target !== "PROFILE_BIO" || value !== "HIGHLIGHT_IMPACT").map(value =>
          <option key={value} value={value}>{value === "HIGHLIGHT_IMPACT" && target === "PROJECT_DESCRIPTION" ? "Highlight technical work" : labels[value]}</option>)}
      </select>
      <p className="text-xs text-slate-600">Only this field’s text is sent to our AI provider for processing. Review every fact before using a suggestion.</p>
      <Button type="button" disabled={isLoading} onClick={() => void improve()}>Generate suggestion</Button>
    </div>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <Dialog.Root open={!!suggestion} onOpenChange={open => { if (!open) setSuggestion(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-slate-950/60"/>
        <Dialog.Content onCloseAutoFocus={e => { e.preventDefault(); trigger.current?.focus(); }}
          className="fixed left-1/2 top-1/2 z-[100] flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border bg-white p-5 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">AI suggestion</Dialog.Title>
          <Dialog.Description className="mt-1 text-sm text-slate-600">Review the wording and facts. Using this suggestion updates your form; you still need to Save.</Dialog.Description>
          <div className="mt-4 min-h-0 space-y-4 overflow-y-auto break-words">
            <div><h3 className="text-sm font-semibold">Original</h3><p className="mt-1 whitespace-pre-wrap text-sm">{suggestion?.original}</p></div>
            <div><label htmlFor={`${id}-suggested`} className="text-sm font-semibold">Suggested</label>
              <Textarea id={`${id}-suggested`} readOnly={!editing} value={suggestion?.edited ?? ""} maxLength={max}
                onChange={e => setSuggestion(current => current && ({ ...current, edited: e.target.value }))} className="mt-1 min-h-36"/>
            </div>
            {changed && <p role="alert" className="text-sm text-amber-800">Your original field changed while generating. Reject this suggestion and generate again using the latest text.</p>}
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
            <Dialog.Close asChild><Button type="button" variant="secondary">Reject</Button></Dialog.Close>
            <Button type="button" variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
            <Button type="button" disabled={changed || !suggestion?.edited.trim()} onClick={() => {
              if (suggestion && !changed) { onAccept(suggestion.edited); setSuggestion(null); }
            }}>Use Suggestion</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>;
}
