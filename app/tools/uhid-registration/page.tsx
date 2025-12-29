"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n-context";
import {
  Heart,
  ChevronLeft,
  ExternalLink,
  IdCard,
  CheckCircle2,
  Smartphone,
  Shield,
  Building2,
  FileText,
  Info,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

export default function UHIDRegistrationPage() {
  const { t } = useI18n();

  const handleRedirect = () => {
    window.open(
      "https://ehealth.kerala.gov.in/portal/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                {t("app_name")}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-sky-100 text-sky-700 border-sky-200"
              >
                <IdCard className="w-3 h-3 mr-1" />
                {t("tool_uhid_badge")}
              </Badge>
              <LanguageSwitcher variant="minimal" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t("common_back_to_home")}
        </Link>

        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
              <IdCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {t("tool_uhid_title")}
            </h1>
            <p className="text-slate-600">{t("tool_uhid_subtitle")}</p>
          </div>

          {/* What is UHID */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-sky-600" />
                {t("tool_uhid_what_is_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {t("tool_uhid_what_is_description_1")}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t("tool_uhid_what_is_description_2")}
              </p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("tool_uhid_benefits_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { icon: FileText, text: t("tool_uhid_benefit_1") },
                  { icon: Building2, text: t("tool_uhid_benefit_2") },
                  { icon: Shield, text: t("tool_uhid_benefit_3") },
                  { icon: Smartphone, text: t("tool_uhid_benefit_4") },
                  { icon: CheckCircle2, text: t("tool_uhid_benefit_5") },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <span className="text-sm text-slate-700 pt-1.5">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How to Register */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-sky-600" />
                {t("tool_uhid_how_to_title")}
              </CardTitle>
              <CardDescription>
                {t("tool_uhid_how_to_description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {[
                  t("tool_uhid_step_1"),
                  t("tool_uhid_step_2"),
                  t("tool_uhid_step_3"),
                  t("tool_uhid_step_4"),
                  t("tool_uhid_step_5"),
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-700 pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <Button
            onClick={handleRedirect}
            size="lg"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-500/30 gap-2"
          >
            {t("tool_uhid_go_to_portal")}
            <ExternalLink className="w-5 h-5" />
          </Button>

          {/* Already have UHID */}
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800 font-semibold">
              {t("tool_uhid_already_have_title")}
            </AlertTitle>
            <AlertDescription className="text-emerald-700">
              {t("tool_uhid_already_have_description")}
            </AlertDescription>
          </Alert>

          {/* FAQ */}
          <Accordion
            type="single"
            collapsible
            className="bg-white border border-slate-200 rounded-lg shadow-lg"
          >
            <AccordionItem value="faq-1" className="border-b border-slate-200">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                {t("tool_uhid_faq_1_question")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                {t("tool_uhid_faq_1_answer")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2" className="border-b border-slate-200">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                {t("tool_uhid_faq_2_question")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                {t("tool_uhid_faq_2_answer")}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                {t("tool_uhid_faq_3_question")}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
                {t("tool_uhid_faq_3_answer")}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          {/* Full Assessment CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  {t("tool_uhid_cta_title")}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {t("tool_uhid_cta_description")}
                </p>
                <Link href="/assessment/step-1">
                  <Button
                    variant="secondary"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    {t("tool_uhid_cta_button")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
