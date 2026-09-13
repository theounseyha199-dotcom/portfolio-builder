"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
const DialogContext = createContext<{ open: boolean; setOpen: (value: boolean) => void }>({ open: false, setOpen: () => {} });
export function AlertDialog({ children, open: controlledOpen, onOpenChange }: { children: ReactNode; open?: boolean; onOpenChange?: (value: boolean) => void }) { const [uncontrolledOpen, setUncontrolledOpen] = useState(false); const open = controlledOpen ?? uncontrolledOpen; return <DialogContext.Provider value={{ open, setOpen: onOpenChange ?? setUncontrolledOpen }}>{children}</DialogContext.Provider>; }
export function AlertDialogTrigger({ children }: { children: ReactNode }) { const { setOpen } = useContext(DialogContext); return <span onClick={() => setOpen(true)}>{children}</span>; }
export function AlertDialogContent({ children }: { children: ReactNode }) { const { open } = useContext(DialogContext); return open ? <div role="dialog" className="rounded border bg-white p-6">{children}</div> : null; }
export const AlertDialogHeader = ({ children }: { children: ReactNode }) => <div>{children}</div>; export const AlertDialogFooter = AlertDialogHeader; export const AlertDialogTitle = AlertDialogHeader; export const AlertDialogDescription = AlertDialogHeader;
export function AlertDialogCancel({ children }: { children: ReactNode }) { const { setOpen } = useContext(DialogContext); return <button onClick={() => setOpen(false)}>{children}</button>; }
export const AlertDialogAction = AlertDialogCancel;
