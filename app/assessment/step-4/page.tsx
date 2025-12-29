"use client";

import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { StatusBadge, getStatusType } from "@/components/status-badge";
import { InterpretationRow } from "@/components/interpretation-row";
import { DisclaimerAlert } from "@/components/disclaimer-alert";
import {
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Utensils,
  Building2,
  Heart,
  Scale,
  HeartPulse,
  Droplet,
  ClipboardList,
  Stethoscope,
  FileText,
  Loader2,
  Cigarette,
  Wine,
  Lightbulb,
  ChevronLeft,
} from "lucide-react";
import {
  useAssessment,
  getBPStatus,
  getSugarStatus,
} from "@/lib/assessment-context";
import { useI18n } from "@/lib/i18n-context";
import { generateHealthPDF } from "@/lib/generate-pdf";
import { toast } from "sonner";
import Link from "next/link";

export default function Step4Page() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useI18n();
  const {
    data,
    resetAssessment,
    calculateBMI,
    getBMICategory,
    calculateCBACScore,
    needsLifestyleGuidance,
  } = useAssessment();

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);
  const cbacScore = calculateCBACScore();
  const guidance = needsLifestyleGuidance();

  const isHighCBACRisk = cbacScore > 4;
  const needsConsultation = isHighCBACRisk;
  const hasAnyLifestyleTrigger =
    guidance.tobacco || guidance.alcohol || guidance.activity;

  // Generate advice based on data
  const keyAdvice = useMemo(() => {
    const advice: string[] = [];

    if (isHighCBACRisk) {
      advice.push(t("step4_advice_visit_jak"));
    }

    if (guidance.tobacco) {
      advice.push(t("step4_advice_tobacco"));
    }

    if (guidance.alcohol) {
      advice.push(t("step4_advice_alcohol"));
    }

    if (guidance.activity) {
      advice.push(t("step4_advice_activity"));
    }

    return advice;
  }, [isHighCBACRisk, guidance, t]);

  // Diet tips based on BMI
  const dietTips = useMemo(() => {
    if (!bmiCategory) return [];

    switch (bmiCategory.label) {
      case "Underweight":
        return [
          t("step4_diet_underweight_1"),
          t("step4_diet_underweight_2"),
          t("step4_diet_underweight_3"),
        ];
      case "Overweight":
      case "Obese":
        return [
          t("step4_diet_overweight_1"),
          t("step4_diet_overweight_2"),
          t("step4_diet_overweight_3"),
          t("step4_diet_overweight_4"),
        ];
      default:
        return [
          t("step4_diet_normal_1"),
          t("step4_diet_normal_2"),
          t("step4_diet_normal_3"),
        ];
    }
  }, [bmiCategory, t]);

  // Sugar-specific tips
  const sugarTips = useMemo(() => {
    if (sugarStatus?.color === "amber" || sugarStatus?.color === "rose") {
      return [
        t("step4_sugar_tip_1"),
        t("step4_sugar_tip_2"),
        t("step4_sugar_tip_3"),
        t("step4_sugar_tip_4"),
      ];
    }
    return [];
  }, [sugarStatus, t]);

  // Activity tips based on level
  const activityTips = useMemo(() => {
    switch (data.activityLevel) {
      case "sedentary":
        return [
          t("step4_activity_sedentary_1"),
          t("step4_activity_sedentary_2"),
          t("step4_activity_sedentary_3"),
        ];
      case "moderate":
        return [
          t("step4_activity_moderate_1"),
          t("step4_activity_moderate_2"),
          t("step4_activity_moderate_3"),
        ];
      case "adequate":
        return [
          t("step4_activity_adequate_1"),
          t("step4_activity_adequate_2"),
          t("step4_activity_adequate_3"),
        ];
      default:
        return [];
    }
  }, [data.activityLevel, t]);

  const handleRestart = () => {
    resetAssessment();
    router.push("/");
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      generateHealthPDF({
        data,
        bmi,
        bmiCategory,
        cbacScore,
        keyAdvice,
        dietTips,
        sugarTips,
        activityTips,
      });
    } catch {
      toast.error(t("step4_download_error"), {
        description: t("step4_download_error_desc"),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell currentStep={4} totalSteps={4}>
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  {t("step4_title")}
                </CardTitle>
                <CardDescription>
                  {t("step4_subtitle_date", {
                    date: new Date().toLocaleDateString(),
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Consultation Alert (if needed) */}
        {needsConsultation && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 font-semibold">
              {t("step4_consultation_title")}
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              <div>{t("step4_consultation_description")}</div>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 gap-2 w-full">
                <Building2 className="w-4 h-4" />
                {t("step4_consultation_find_jak")}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Measurements Section */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              {t("step4_measurements_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bmi && bmiCategory && (
              <InterpretationRow
                label={t("step4_measurements_bmi")}
                value={bmi}
                status={bmiCategory}
              />
            )}

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {t("step4_measurements_bp")}
                </span>
              </div>
              {data.bpEntered ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.systolic}/{data.diastolic} mmHg
                  </span>
                  <StatusBadge
                    status={getStatusType(bpStatus.color)}
                    label={bpStatus.label}
                  />
                </div>
              ) : (
                <StatusBadge
                  status="muted"
                  label={t("step4_measurements_not_entered")}
                />
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {t("step4_measurements_sugar")}
                </span>
              </div>
              {data.sugarEntered ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.sugarValue}{" "}
                    {data.sugarType === "hba1c" ? "%" : "mg/dL"}
                  </span>
                  <StatusBadge
                    status={getStatusType(sugarStatus.color)}
                    label={sugarStatus.label}
                  />
                </div>
              ) : (
                <StatusBadge
                  status="muted"
                  label={t("step4_measurements_not_entered")}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Score Section */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              {t("step4_risk_score_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm text-slate-600">
                  {t("step4_cbac_score")}
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  {cbacScore}
                </p>
              </div>
              <StatusBadge
                status={isHighCBACRisk ? "elevated" : "normal"}
                label={
                  isHighCBACRisk
                    ? t("step3_score_higher_risk")
                    : t("step3_score_lower_risk")
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Advice Section */}
        {keyAdvice.length > 0 && (
          <Card className="bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                {t("step4_key_advice_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {keyAdvice.map((advice, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {advice}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle Guidance Section */}
        {hasAnyLifestyleTrigger && (
          <Card className="bg-white border border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("step4_focus_areas_title")}
              </CardTitle>
              <CardDescription>
                {t("step4_focus_areas_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Focus Area Badges */}
              <div className="flex flex-wrap gap-2">
                {guidance.tobacco && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Cigarette className="w-3 h-3 mr-1" />
                    {t("step4_focus_tobacco")}
                  </Badge>
                )}
                {guidance.alcohol && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Wine className="w-3 h-3 mr-1" />
                    {t("step4_focus_alcohol")}
                  </Badge>
                )}
                {guidance.activity && (
                  <Badge className="bg-amber-50 text-amber-800 border border-amber-200">
                    <Activity className="w-3 h-3 mr-1" />
                    {t("step4_focus_activity")}
                  </Badge>
                )}
              </div>

              <Accordion type="multiple" className="space-y-2">
                {/* Tobacco Guidance */}
                {guidance.tobacco && (
                  <AccordionItem
                    value="tobacco"
                    className="border border-slate-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Cigarette className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">
                          {t("step4_tobacco_guidance_title")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_tobacco_tip_1")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_tobacco_tip_2")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_tobacco_tip_3")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_tobacco_tip_4")}
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Alcohol Guidance */}
                {guidance.alcohol && (
                  <AccordionItem
                    value="alcohol"
                    className="border border-slate-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Wine className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium">
                          {t("step4_alcohol_guidance_title")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_alcohol_tip_1")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_alcohol_tip_2")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_alcohol_tip_3")}
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          {t("step4_alcohol_tip_4")}
                        </li>
                      </ul>
                      <Alert className="bg-sky-50 border-sky-200 mt-3">
                        <Lightbulb className="h-4 w-4 text-sky-600" />
                        <AlertDescription className="text-sky-800 text-sm">
                          {t("step4_alcohol_support_note")}
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Activity Guidance */}
                {guidance.activity && (
                  <AccordionItem
                    value="activity"
                    className="border border-slate-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium">
                          {t("step4_activity_guidance_title")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-slate-900">
                          {t("step4_activity_starter_plan")}
                        </p>
                        <div className="space-y-2 text-sm text-slate-700">
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">
                              {t("step4_activity_week1")}
                            </Badge>
                            <span>{t("step4_activity_week1_plan")}</span>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">
                              {t("step4_activity_week2")}
                            </Badge>
                            <span>{t("step4_activity_week2_plan")}</span>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge variant="outline" className="text-xs">
                              {t("step4_activity_week3")}
                            </Badge>
                            <span>{t("step4_activity_week3_plan")}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm text-emerald-800">
                            {t("step4_activity_strength_tip")}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Healthy habits message when no triggers */}
        {!hasAnyLifestyleTrigger && (
          <Card className="bg-emerald-50 border border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    {t("step4_good_track_title")}
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    {t("step4_good_track_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diet & Activity Tips */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {t("step4_personalized_tips_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem
                value="diet"
                className="border border-slate-200 rounded-lg px-4"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">
                      {t("step4_diet_tips")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-slate-700">
                    {dietTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  {sugarTips.length > 0 && (
                    <>
                      <p className="text-sm font-medium text-slate-700 mt-4 mb-2">
                        {t("step4_for_blood_sugar")}
                      </p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {sugarTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="exercise"
                className="border border-slate-200 rounded-lg px-4"
              >
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">
                      {t("step4_activity_tips")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-slate-700">
                    {activityTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <DisclaimerAlert variant="warning" />

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Download className="w-5 h-5" />
                {t("step4_download_title")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  {t("step4_download_dialog_title")}
                </DialogTitle>
                <DialogDescription>
                  {t("step4_download_dialog_description")}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900">
                    {t("step4_download_includes")}
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t("step4_download_includes_1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t("step4_download_includes_2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t("step4_download_includes_3")}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t("step4_download_includes_4")}
                    </li>
                  </ul>
                </div>
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    {t("step4_download_privacy_note")}
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t("common_cancel")}</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                    onClick={handleDownload}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("common_generating")}
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {t("common_download_pdf")}
                      </>
                    )}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex gap-3">
            <Link href="/assessment/step-3" className="flex-1">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <ChevronLeft className="w-4 h-4" />
                {t("common_back")}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 gap-2"
              onClick={handleRestart}
            >
              <RotateCcw className="w-4 h-4" />
              {t("common_start_over")}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
