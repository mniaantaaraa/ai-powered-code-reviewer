"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Check, ExternalLink } from "lucide-react";

interface ApplyFixDialogProps {
  repositoryId: string;
  prNumber: number;
  fileName: string;
  issue: string;
  suggestion?: string;
  onSuccess?: () => void;
}

export function ApplyFixDialog({
  repositoryId,
  prNumber,
  fileName,
  issue,
  suggestion,
  onSuccess,
}: ApplyFixDialogProps) {
  const [open, setOpen] = useState(false);
  const [originalCode, setOriginalCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [step, setStep] = useState<"idle" | "generating" | "preview" | "applying" | "success">("idle");

  const generateFix = trpc.fix.generateFix.useMutation({
    onSuccess: (data) => {
      setOriginalCode(data.originalCode);
      setFixedCode(data.fixedCode);
      setStep("preview");
      toast.success("Fix generated successfully");
    },
    onError: (error) => {
      toast.error("Failed to generate fix", {
        description: error.message,
      });
      setOpen(false);
      setStep("idle");
    },
  });

  const applyFix = trpc.fix.applyFix.useMutation({
    onSuccess: (data) => {
      setCommitUrl(data.commitUrl);
      setStep("success");
      toast.success("Fix applied successfully!", {
        description: "Changes have been committed to the PR branch",
        action: {
          label: "View Commit",
          onClick: () => window.open(data.commitUrl, "_blank"),
        },
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to apply fix", {
        description: error.message,
      });
      setOpen(false);
      setStep("idle");
    },
  });

  const handleGenerateFix = () => {
    setOpen(true);
    setStep("generating");
    toast.loading("Generating fix...", { id: "generate-fix" });
    generateFix.mutate(
      {
        repositoryId,
        fileName,
        prNumber,
        issue,
        suggestion,
      },
      {
        onSettled: () => {
          toast.dismiss("generate-fix");
        },
      }
    );
  };

  const handleApplyFix = () => {
    setStep("applying");
    toast.loading("Applying fix and creating commit...", { id: "apply-fix" });
    applyFix.mutate(
      {
        repositoryId,
        prNumber,
        fileName,
        fixedCode,
        issue,
      },
      {
        onSettled: () => {
          toast.dismiss("apply-fix");
        },
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep("idle");
      setOriginalCode("");
      setFixedCode("");
      setCommitUrl("");
    }, 300);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateFix}
        disabled={generateFix.isPending}
        className="gap-1.5"
      >
        {generateFix.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Wand2 className="h-3 w-3" />
        )}
        Apply Fix
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {step === "success" ? "Fix Applied Successfully" : "Apply AI-Generated Fix"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {step === "generating" && "Generating fix..."}
              {step === "preview" && `Review the proposed changes to ${fileName}`}
              {step === "applying" && "Applying fix and creating commit..."}
              {step === "success" && "The fix has been committed to the PR branch"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {step === "generating" && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {step === "preview" && (
            <div className="flex-1 overflow-hidden flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                <div className="flex flex-col overflow-hidden border border-zinc-800 rounded-lg">
                  <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                    <p className="text-xs font-medium text-zinc-400">Original</p>
                  </div>
                  <pre className="flex-1 overflow-auto p-4 text-xs bg-black scrollbar-custom">
                    <code>{originalCode}</code>
                  </pre>
                </div>
                <div className="flex flex-col overflow-hidden border border-green-900 rounded-lg">
                  <div className="px-3 py-2 bg-green-950 border-b border-green-900">
                    <p className="text-xs font-medium text-green-400">Fixed</p>
                  </div>
                  <pre className="flex-1 overflow-auto p-4 text-xs bg-black scrollbar-custom">
                    <code>{fixedCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {step === "applying" && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-zinc-400">
                Changes have been committed to the PR branch
              </p>
              {commitUrl && (
                <a
                  href={commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                >
                  View commit on GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          <AlertDialogFooter>
            {step === "preview" && (
              <>
                <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleApplyFix}>
                  Apply Fix
                </AlertDialogAction>
              </>
            )}
            {step === "success" && (
              <AlertDialogAction onClick={handleClose}>Close</AlertDialogAction>
            )}
            {(step === "generating" || step === "applying") && (
              <AlertDialogCancel disabled>Cancel</AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
