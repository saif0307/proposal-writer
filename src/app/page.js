"use client";

import { ProfileForm } from "@/components/Form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { DialogOverlay } from "@radix-ui/react-dialog";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="px-4 md:px-6 py-4 pt-8 max-w-[800px] mx-auto w-full">
      <Toaster />
      <h1 className="text-center text-4xl font-bold text-slate-900 tracking-wide pb-10">
        Upwork Proposal Generator
      </h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay>
          <DialogContent>
            {loading ? (
              <div className="flex flex-col mx-auto space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 max-w-[250px] w-full" />
                  <Skeleton className="h-4 max-w-[200px] w-full" />
                  <Skeleton className="h-4 max-w-[250px] w-full" />
                  <Skeleton className="h-4 max-w-[200px] w-full" />
                  <Skeleton className="h-4 max-w-[250px] w-full" />
                  <Skeleton className="h-4 max-w-[200px] w-full" />
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[80vh] overflow-auto   p-4">
                <pre
                  className="w-full  text-wrap"
                  dangerouslySetInnerHTML={{ __html: response }}
                ></pre>
              </ScrollArea>
            )}
          </DialogContent>
        </DialogOverlay>
      </Dialog>
      <ProfileForm
        setOpen={setOpen}
        setResponse={setResponse}
        setLoading={setLoading}
      />
    </main>
  );
}
