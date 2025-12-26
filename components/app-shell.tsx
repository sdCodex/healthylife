"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Shield, FileWarning } from "lucide-react";
import { Footer } from "@/components/footer";

interface AppShellProps {
  children: ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showStepper?: boolean;
}

export function AppShell({
  children,
  currentStep = 0,
  totalSteps = 6,
  showStepper = true,
}: AppShellProps) {
  const progress = currentStep > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Healthy Life
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Privacy</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      Privacy
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-slate-700">
                    <p>
                      <strong>What we don&apos;t collect:</strong> Your name,
                      phone number, email, Aadhaar, address, or any other
                      personal identifiers.
                    </p>
                    <p>
                      <strong>What happens to your answers:</strong> All
                      calculations happen on your device. Your answers are
                      stored temporarily in your browser and are cleared when
                      you restart the assessment.
                    </p>
                    <p>
                      <strong>PDF downloads:</strong> When you download your
                      summary, it saves directly to your device. We don&apos;t
                      see or store it.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <FileWarning className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Disclaimer</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileWarning className="w-5 h-5 text-amber-600" />
                      Important Disclaimer
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-slate-700">
                    <p>
                      This tool provides{" "}
                      <strong>general health risk information</strong> and is{" "}
                      <strong>not a medical diagnosis</strong>.
                    </p>
                    <p>
                      It <strong>does not provide treatment advice</strong>. The
                      results are for awareness and educational purposes only.
                    </p>
                    <p>
                      If you have symptoms, health concerns, or receive a
                      high-risk result, please <strong>consult a doctor</strong>{" "}
                      or visit your nearest health facility for proper
                      evaluation.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Step indicator */}
          {showStepper && currentStep > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                >
                  Step {currentStep} of {totalSteps}
                </Badge>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-xl mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
