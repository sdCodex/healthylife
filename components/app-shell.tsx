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
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n-context";

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
  const { t } = useI18n();
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

            <div className="flex items-center gap-1">
              <LanguageSwitcher variant="minimal" />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">
                      {t("common_privacy")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      {t("privacy_dialog_title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-slate-700">
                    <p>
                      <strong>
                        {t("privacy_dialog_what_we_dont_collect")}
                      </strong>{" "}
                      {t("privacy_dialog_what_we_dont_collect_desc")}
                    </p>
                    <p>
                      <strong>{t("privacy_dialog_what_happens")}</strong>{" "}
                      {t("privacy_dialog_what_happens_desc")}
                    </p>
                    <p>
                      <strong>{t("privacy_dialog_pdf")}</strong>{" "}
                      {t("privacy_dialog_pdf_desc")}
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
                    <span className="hidden sm:inline">
                      {t("common_disclaimer")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileWarning className="w-5 h-5 text-amber-600" />
                      {t("disclaimer_dialog_title")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm text-slate-700">
                    <p>{t("disclaimer_dialog_p1")}</p>
                    <p>{t("disclaimer_dialog_p2")}</p>
                    <p>{t("disclaimer_dialog_p3")}</p>
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
                  {t("common_step_of", {
                    current: currentStep.toString(),
                    total: totalSteps.toString(),
                  })}
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
