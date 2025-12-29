"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import {
  Droplet,
  Heart,
  ChevronLeft,
  Info,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type SugarType = "fbs" | "rbs" | "ppbs" | "hba1c";

const SUGAR_TESTS = [
  {
    value: "fbs",
    label: "Fasting Blood Sugar (FBS)",
    unit: "mg/dL",
    description: "Measured after 8+ hours of fasting",
    ranges: [
      { label: "Normal", value: "70-99 mg/dL", color: "emerald" },
      { label: "Pre", value: "100-125 mg/dL", color: "amber" },
      { label: "High", value: "≥126 mg/dL", color: "rose" },
    ],
  },
  {
    value: "rbs",
    label: "Random Blood Sugar (RBS)",
    unit: "mg/dL",
    description: "Measured at any time of day",
    ranges: [
      { label: "Normal", value: "<140 mg/dL", color: "emerald" },
      { label: "High", value: "≥200 mg/dL", color: "rose" },
    ],
  },
  {
    value: "ppbs",
    label: "2-hour PPBS",
    unit: "mg/dL",
    description: "Measured 2 hours after a meal",
    ranges: [
      { label: "Normal", value: "<140 mg/dL", color: "emerald" },
      { label: "Pre", value: "140-199 mg/dL", color: "amber" },
      { label: "High", value: "≥200 mg/dL", color: "rose" },
    ],
  },
  {
    value: "hba1c",
    label: "HbA1c",
    unit: "%",
    description: "Average blood sugar over 2-3 months",
    ranges: [
      { label: "Normal", value: "<5.7%", color: "emerald" },
      { label: "Pre", value: "5.7-6.4%", color: "amber" },
      { label: "High", value: "<6.5%", color: "rose" },
    ],
  },
];

const SUGAR_THRESHOLDS = {
  fbs: { hypoglycaemia: 70, normal: 99, prediabetes: 126 },
  rbs: { hypoglycaemia: 70, normal: 140, diabetes: 200 },
  ppbs: { hypoglycaemia: 70, normal: 139, prediabetes: 200 },
  hba1c: { normal: 5.7, prediabetes: 6.5 },
};

const getResult = (type: SugarType, value: number) => {
  const thresholds = SUGAR_THRESHOLDS[type];

  // Hypoglycaemia check (not for HbA1c)
  if (
    type !== "hba1c" &&
    "hypoglycaemia" in thresholds &&
    value < thresholds.hypoglycaemia
  ) {
    return {
      status: "low" as const,
      label: "Hypoglycaemia",
      color: "blue",
      description:
        "Your blood sugar is too low. This can be dangerous and requires immediate attention.",
      tips: [
        "Consume quick-acting carbohydrates (juice, candy)",
        "Recheck blood sugar after 15 minutes",
        "Seek medical help if symptoms persist",
        "Discuss with your doctor to adjust medication",
      ],
    };
  }

  // Normal range
  if (value <= thresholds.normal) {
    return {
      status: "normal" as const,
      label: "Normal",
      color: "emerald",
      description: "Your blood sugar is within the healthy range.",
      tips: [
        "Maintain a balanced diet",
        "Stay physically active",
        "Continue regular check-ups",
      ],
    };
  }

  // RBS special case (no pre-diabetes)
  if (type === "rbs" && "diabetes" in thresholds) {
    if (value < thresholds.diabetes) {
      return {
        status: "elevated" as const,
        label: "Elevated",
        color: "amber",
        description:
          "Your random blood sugar is elevated. Consider getting a fasting test or HbA1c for better assessment.",
        tips: [
          "Get a fasting blood sugar test",
          "Consider HbA1c test for accurate diagnosis",
          "Monitor your blood sugar levels",
          "Consult a healthcare provider",
        ],
      };
    }
    return {
      status: "high" as const,
      label: "Diabetes Mellitus",
      color: "rose",
      description:
        "Your blood sugar is in the diabetes range. Please consult a doctor for proper diagnosis.",
      tips: [
        "Consult a doctor immediately",
        "Get confirmatory tests (FBS or HbA1c)",
        "Follow prescribed treatment",
        "Monitor blood sugar regularly",
      ],
    };
  }

  // Pre-diabetes range (FBS, PPBS, HbA1c)
  if ("prediabetes" in thresholds && value < thresholds.prediabetes) {
    return {
      status: "elevated" as const,
      label: "Pre-diabetes",
      color: "amber",
      description:
        "Your blood sugar is higher than normal. Lifestyle changes can help prevent diabetes.",
      tips: [
        "Reduce sugar and refined carbs",
        "Increase physical activity",
        "Monitor blood sugar regularly",
        "Consult a healthcare provider",
      ],
    };
  }

  return {
    status: "high" as const,
    label: "Diabetes Mellitus",
    color: "rose",
    description:
      "Your blood sugar is in the diabetes range. Please consult a doctor for proper diagnosis.",
    tips: [
      "Consult a doctor for diagnosis",
      "Get additional tests done",
      "Follow prescribed treatment",
      "Monitor blood sugar regularly",
    ],
  };
};

const MAX_VALUES = {
  fbs: 400,
  rbs: 400,
  ppbs: 400,
  hba1c: 15,
};

export default function SugarCheckerPage() {
  const [testType, setTestType] = useState<SugarType | "">("");
  const [value, setValue] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const { t } = useI18n();

  const selectedTest = SUGAR_TESTS.find((t) => t.value === testType);

  const isValueTooHigh = useMemo(() => {
    if (!testType || !value) return false;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    return numValue > MAX_VALUES[testType as SugarType];
  }, [testType, value]);

  const result = useMemo(() => {
    if (!testType || !value) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return null;

    if (numValue > MAX_VALUES[testType as SugarType]) return null;

    return getResult(testType as SugarType, numValue);
  }, [testType, value]);

  const handleCheck = () => {
    if (result) setShowResult(true);
  };

  const handleReset = () => {
    setTestType("");
    setValue("");
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-slate-50">
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
                className="bg-amber-100 text-amber-700 border-amber-200"
              >
                <Droplet className="w-3 h-3 mr-1" />
                {t("tool_sugar_badge")}
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Droplet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {t("tool_sugar_title")}
            </h1>
            <p className="text-slate-600">{t("tool_sugar_subtitle")}</p>
          </div>

          {/* Input Card */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplet className="w-5 h-5 text-amber-600" />
                {t("tool_sugar_enter_reading")}
              </CardTitle>
              <CardDescription>
                {t("tool_sugar_card_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("step2_sugar_test_type")}</Label>
                <Select
                  value={testType}
                  onValueChange={(v) => {
                    setTestType(v as SugarType);
                    setShowResult(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("step2_sugar_test_placeholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {SUGAR_TESTS.map((test) => (
                      <SelectItem key={test.value} value={test.value}>
                        <div>
                          <span>{test.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTest && (
                  <p className="text-xs text-slate-500">
                    {selectedTest.description}
                  </p>
                )}
              </div>

              {testType && (
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {t("step2_sugar_value")} ({selectedTest?.unit})
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    inputMode="decimal"
                    placeholder={
                      testType === "hba1c"
                        ? t("step2_sugar_value_placeholder_hba1c")
                        : t("step2_sugar_value_placeholder")
                    }
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setShowResult(false);
                    }}
                    className="text-lg"
                  />
                  {isValueTooHigh && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertTriangle className="size-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        {t("tool_sugar_value_too_high")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  disabled={!result}
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  {t("tool_sugar_check_reading")}
                </Button>
                {showResult && (
                  <Button variant="outline" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {showResult && result && (
            <Card
              className={cn(
                "border-2",
                result.color === "emerald" &&
                  "border-emerald-200 bg-emerald-50",
                result.color === "amber" && "border-amber-200 bg-amber-50",
                result.color === "rose" && "border-rose-200 bg-rose-50",
                result.color === "blue" && "border-blue-200 bg-blue-50"
              )}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      {t("tool_sugar_your_reading")} {selectedTest?.label}
                    </p>
                    <p className="text-4xl font-bold tabular-nums text-slate-900">
                      {value}
                      <span className="text-lg font-normal text-slate-500 ml-2">
                        {selectedTest?.unit}
                      </span>
                    </p>
                  </div>
                  <StatusBadge
                    status={result.status}
                    label={result.label}
                    className="text-base px-4 py-1"
                  />
                  <p className="text-sm text-slate-700 max-w-sm mx-auto">
                    {result.description}
                  </p>

                  <div className="text-left bg-white/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      {t("tool_bp_recommendations")}
                    </p>
                    <ul className="space-y-1">
                      {result.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2
                            className={cn(
                              "size-4 mt-0.5 shrink-0",
                              result.color === "emerald" && "text-emerald-600",
                              result.color === "amber" && "text-amber-600",
                              result.color === "rose" && "text-rose-600",
                              result.color === "blue" && "text-blue-600"
                            )}
                          />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-700">
                {t("tool_sugar_reference_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SUGAR_TESTS.map((test) => (
                  <div
                    key={test.value}
                    className={`p-3 rounded-lg ${
                      testType === test.value
                        ? "bg-amber-50 ring-1 ring-amber-200"
                        : "bg-slate-50"
                    }`}
                  >
                    <p className="font-medium text-slate-800 text-sm mb-2">
                      {test.label}
                    </p>
                    <div
                      className={`grid grid-cols-${test.ranges.length} gap-2 text-xs`}
                    >
                      {test.ranges.map((range, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <div
                            className={cn(
                              "size-2 rounded-full shrink-0",
                              range.color === "emerald" && "bg-emerald-500",
                              range.color === "amber" && "bg-amber-500",
                              range.color === "rose" && "bg-rose-500"
                            )}
                          />
                          <span className="text-slate-600">
                            {range.label}: {range.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="bg-slate-100 border-slate-200">
            <Info className="size-4 text-slate-600" />
            <AlertTitle className="text-slate-800">
              {t("tool_sugar_note_title")}
            </AlertTitle>
            <AlertDescription className="text-slate-600">
              {t("tool_sugar_note_description")}
            </AlertDescription>
          </Alert>

          <Separator />

          {/* CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">{t("tool_cta_title")}</h3>
                <p className="text-emerald-100 text-sm">
                  {t("tool_cta_description")}
                </p>
                <Link href="/assessment/step-1">
                  <Button
                    variant="secondary"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    {t("tool_cta_button")}
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
