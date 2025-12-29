"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAssessment } from "@/lib/assessment-context";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";

export default function Step5Page() {
  const router = useRouter();
  const { data, updateData } = useAssessment();
  const { t } = useI18n();

  const GENERAL_SYMPTOMS = [
    {
      id: "non_healing_ulcer",
      label: t("step5_symptom_non_healing_ulcer"),
    },
    { id: "lumps", label: t("step5_symptom_lumps") },
    {
      id: "difficulty_swallowing",
      label: t("step5_symptom_difficulty_swallowing"),
    },
    {
      id: "voice_change",
      label: t("step5_symptom_voice_change"),
    },
    { id: "weight_loss", label: t("step5_symptom_weight_loss") },
    { id: "blood_sputum", label: t("step5_symptom_blood_sputum") },
    { id: "persistent_cough", label: t("step5_symptom_persistent_cough") },
  ];

  const WOMEN_SYMPTOMS = [
    { id: "breast_lump", label: t("step5_symptom_breast_lump") },
    {
      id: "nipple_discharge",
      label: t("step5_symptom_nipple_discharge"),
    },
    { id: "breast_shape", label: t("step5_symptom_breast_shape") },
    {
      id: "postmenopausal_bleeding",
      label: t("step5_symptom_postmenopausal_bleeding"),
    },
    {
      id: "bleeding_intercourse",
      label: t("step5_symptom_bleeding_intercourse"),
    },
  ];

  const [generalSymptoms, setGeneralSymptoms] = useState<
    Record<string, boolean>
  >(data.generalSymptoms || {});
  const [womenSymptoms, setWomenSymptoms] = useState<Record<string, boolean>>(
    data.womenSymptoms || {}
  );

  const showWomenSection = data.gender === "female";

  const hasAnySymptom =
    Object.values(generalSymptoms).some((v) => v) ||
    Object.values(womenSymptoms).some((v) => v);

  const handleSymptomChange = (
    id: string,
    value: boolean,
    isWomen: boolean = false
  ) => {
    if (isWomen) {
      setWomenSymptoms((prev) => ({ ...prev, [id]: value }));
    } else {
      setGeneralSymptoms((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleNext = () => {
    updateData({
      generalSymptoms,
      womenSymptoms,
    });
    router.push("/assessment/step-4");
  };

  return (
    <AppShell currentStep={5} totalSteps={5}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("step5_title")}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t("step5_subtitle")}</p>
        </div>

        {/* General Symptoms */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {t("step5_general_symptoms_title")}
            </CardTitle>
            <CardDescription>
              {t("step5_general_symptoms_description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {GENERAL_SYMPTOMS.map((symptom) => (
              <div
                key={symptom.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
              >
                <Label className="text-sm text-slate-700 flex-1 cursor-pointer">
                  {symptom.label}
                </Label>
                <RadioGroup
                  value={
                    generalSymptoms[symptom.id] === true
                      ? "yes"
                      : generalSymptoms[symptom.id] === false
                        ? "no"
                        : ""
                  }
                  onValueChange={(v) =>
                    handleSymptomChange(symptom.id, v === "yes")
                  }
                  className="flex gap-2"
                >
                  <label
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                      generalSymptoms[symptom.id] === true
                        ? "bg-rose-50 border-rose-200 text-rose-800"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value="yes" className="sr-only" />
                    {t("common_yes")}
                  </label>
                  <label
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                      generalSymptoms[symptom.id] === false
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value="no" className="sr-only" />
                    {t("common_no")}
                  </label>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Women-specific Symptoms */}
        {showWomenSection && (
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("step5_women_symptoms_title")}
              </CardTitle>
              <CardDescription>
                {t("step5_women_symptoms_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {WOMEN_SYMPTOMS.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <Label className="text-sm text-slate-700 flex-1 cursor-pointer">
                    {symptom.label}
                  </Label>
                  <RadioGroup
                    value={
                      womenSymptoms[symptom.id] === true
                        ? "yes"
                        : womenSymptoms[symptom.id] === false
                          ? "no"
                          : ""
                    }
                    onValueChange={(v) =>
                      handleSymptomChange(symptom.id, v === "yes", true)
                    }
                    className="flex gap-2"
                  >
                    <label
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                        womenSymptoms[symptom.id] === true
                          ? "bg-rose-50 border-rose-200 text-rose-800"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <RadioGroupItem value="yes" className="sr-only" />
                      {t("common_yes")}
                    </label>
                    <label
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border cursor-pointer text-sm transition-colors ${
                        womenSymptoms[symptom.id] === false
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <RadioGroupItem value="no" className="sr-only" />
                      {t("common_no")}
                    </label>
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Result Banner */}
        {hasAnySymptom ? (
          <Alert className="bg-rose-50 border-rose-200">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <AlertTitle className="text-rose-900 font-semibold">
              {t("step5_result_symptoms_title")}
            </AlertTitle>
            <AlertDescription className="text-rose-800">
              {t("step5_result_symptoms_description")}
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="bg-emerald-50 border border-emerald-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("step5_result_no_symptoms_title")}
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    {t("step5_result_no_symptoms_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Self-breast exam info for women */}
        {showWomenSection && !hasAnySymptom && (
          <Accordion
            type="single"
            collapsible
            className="bg-white border border-slate-200 rounded-lg"
          >
            <AccordionItem value="breast-exam" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm font-medium text-slate-900 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  {t("step5_breast_exam_title")}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-slate-700">
                <div className="space-y-3">
                  <p className="font-medium">{t("step5_breast_exam_how_to")}</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>{t("step5_breast_exam_step_1")}</li>
                    <li>{t("step5_breast_exam_step_2")}</li>
                    <li>{t("step5_breast_exam_step_3")}</li>
                    <li>{t("step5_breast_exam_step_4")}</li>
                    <li>{t("step5_breast_exam_step_5")}</li>
                    <li>{t("step5_breast_exam_step_6")}</li>
                    <li>{t("step5_breast_exam_step_7")}</li>
                  </ol>
                  <Alert className="bg-sky-50 border-sky-200 mt-4">
                    <Info className="h-4 w-4 text-sky-600" />
                    <AlertDescription className="text-sky-800 text-sm">
                      {t("step5_breast_exam_note")}
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <DisclaimerAlert />

        {/* Navigation */}
        <div className="flex justify-between gap-3 pt-4">
          <Link href="/assessment/step-4">
            <Button variant="outline" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              {t("common_back")}
            </Button>
          </Link>
          <Button
            onClick={handleNext}
            className="gap-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {t("common_view_summary")}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
