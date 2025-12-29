"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types
export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "moderate" | "adequate";
export type TobaccoUse = "never" | "past" | "daily";
export type AlcoholUse = "no" | "yes";
export type SugarType = "rbs" | "fbs" | "ppbs" | "hba1c";
export type WaistReference = "male" | "female";

export interface AssessmentData {
  // Step 1: Demographics
  age: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;

  // Step 2: Anthropometry & Vitals
  height: number | null;
  weight: number | null;
  systolic: number | null;
  diastolic: number | null;
  sugarType: SugarType | null;
  sugarValue: number | null;

  // Step 3: NCD Risk (CBAC)
  tobaccoUse: TobaccoUse | null;
  alcoholUse: AlcoholUse | null;
  waistCircumference: number | null;
  waistReference: WaistReference | null;
  familyHistory: boolean | null;

  // Step 5: Cancer Symptom Screening
  generalSymptoms: Record<string, boolean>;
  womenSymptoms: Record<string, boolean>;

  // Computed flags
  bpEntered: boolean;
  sugarEntered: boolean;
  bpElevated: boolean;
  sugarElevated: boolean;
}

const initialData: AssessmentData = {
  age: null,
  gender: null,
  activityLevel: null,
  height: null,
  weight: null,
  systolic: null,
  diastolic: null,
  sugarType: null,
  sugarValue: null,
  tobaccoUse: null,
  alcoholUse: null,
  waistCircumference: null,
  waistReference: null,
  familyHistory: null,
  generalSymptoms: {},
  womenSymptoms: {},
  bpEntered: false,
  sugarEntered: false,
  bpElevated: false,
  sugarElevated: false,
};

interface AssessmentContextType {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  resetAssessment: () => void;
  calculateBMI: () => number | null;
  getBMICategory: (bmi: number) => { label: string; color: string };
  calculateCBACScore: () => number;
  needsLifestyleGuidance: () => {
    tobacco: boolean;
    alcohol: boolean;
    activity: boolean;
  };
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

// BMI Categories
const BMI_CATEGORIES = [
  { max: 18.5, label: "Underweight", color: "sky" },
  { max: 25, label: "Normal range", color: "emerald" },
  { max: 30, label: "Overweight", color: "amber" },
  { max: 35, label: "Obese class I", color: "orange" },
  { max: 40, label: "Obese class II", color: "rose" },
  { max: Infinity, label: "Obese class III", color: "red" },
];

// Sugar Thresholds
const SUGAR_THRESHOLDS = {
  fbs: { hypoglycaemia: 70, normal: 99, prediabetes: 126 },
  rbs: { hypoglycaemia: 70, normal: 140, diabetes: 200 },
  ppbs: { hypoglycaemia: 70, normal: 139, prediabetes: 200 },
  hba1c: { normal: 5.7, prediabetes: 6.5 },
};

// Waist thresholds
export const WAIST_THRESHOLDS = {
  female: { low: 80, high: 90 },
  male: { low: 90, high: 100 },
};

export function AssessmentProvider({ children }: { children: ReactNode }) {
  // Load from sessionStorage on mount
  const [data, setData] = useState<AssessmentData>(() => {
    // Check if we're in the browser before accessing sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("assessmentData");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // Invalid data, use initial
        }
      }
    }
    return initialData;
  });

  // Save to sessionStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("assessmentData", JSON.stringify(data));
    }
  }, [data]);

  const updateData = (updates: Partial<AssessmentData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetAssessment = () => {
    setData(initialData);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("assessmentData");
    }
  };

  const calculateBMI = (): number | null => {
    if (!data.height || !data.weight) return null;
    const heightM = data.height / 100;
    return Math.round((data.weight / (heightM * heightM)) * 10) / 10;
  };

  const getBMICategory = (bmi: number) => {
    return (
      BMI_CATEGORIES.find((c) => bmi < c.max) ||
      BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
    );
  };

  const calculateCBACScore = (): number => {
    let score = 0;

    // Age band
    const age = data.age || 0;
    if (age >= 60) score += 4;
    else if (age >= 50) score += 3;
    else if (age >= 40) score += 2;
    else if (age >= 30) score += 1;

    // Tobacco
    if (data.tobaccoUse === "daily") score += 2;
    else if (data.tobaccoUse === "past") score += 1;

    // Alcohol
    if (data.alcoholUse === "yes") score += 1;

    // Waist circumference
    const waist = data.waistCircumference;
    const reference =
      data.waistReference || (data.gender === "male" ? "male" : "female");
    if (waist) {
      const thresholds = WAIST_THRESHOLDS[reference];
      if (waist > thresholds.high) score += 2;
      else if (waist > thresholds.low) score += 1;
    }

    // Physical activity (from step 1)
    if (
      data.activityLevel === "sedentary" ||
      data.activityLevel === "moderate"
    ) {
      score += 1;
    }

    // Family history
    if (data.familyHistory) score += 2;

    return score;
  };

  const needsLifestyleGuidance = () => {
    return {
      tobacco: data.tobaccoUse !== null && data.tobaccoUse !== "never",
      alcohol: data.alcoholUse === "yes",
      activity: data.activityLevel !== "adequate",
    };
  };

  return (
    <AssessmentContext.Provider
      value={{
        data,
        updateData,
        resetAssessment,
        calculateBMI,
        getBMICategory,
        calculateCBACScore,
        needsLifestyleGuidance,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
}

// Helper to check if BP is elevated
export function isBPElevated(
  systolic: number | null,
  diastolic: number | null
): boolean {
  if (!systolic || !diastolic) return false;
  if (systolic >= 180 || diastolic >= 120) return true;
  if (systolic >= 160 || diastolic >= 100) return true;
  if (
    (systolic >= 140 && systolic <= 159) ||
    (diastolic >= 90 && diastolic <= 99)
  )
    return true;
  if (systolic < 90 || diastolic < 60) return true;
  return false;
}

// Helper to check if sugar is elevated
export function isSugarElevated(
  type: SugarType | null,
  value: number | null
): boolean {
  if (!type || !value) return false;
  const thresholds = SUGAR_THRESHOLDS[type];

  if ("diabetes" in thresholds && value >= thresholds.diabetes) return true;
  if ("prediabetes" in thresholds && value >= thresholds.prediabetes)
    return true;
  if ("hypoglycaemia" in thresholds && value < thresholds.hypoglycaemia)
    return true;

  return false;
}

// Helper to get BP status
export function getBPStatus(
  systolic: number | null,
  diastolic: number | null
): { label: string; color: string } {
  if (!systolic || !diastolic) return { label: "Not entered", color: "slate" };

  if (systolic >= 180 || diastolic >= 120)
    return { label: "Hypertensive Crisis", color: "rose" };
  if (systolic >= 160 || diastolic >= 100)
    return { label: "Stage 2 Hypertension", color: "rose" };
  if (
    (systolic >= 140 && systolic <= 159) ||
    (diastolic >= 90 && diastolic <= 99)
  )
    return { label: "Stage 1 Hypertension", color: "amber" };
  if (systolic < 140 && diastolic < 90 && systolic >= 90 && diastolic >= 60)
    return { label: "Normal", color: "emerald" };
  if (systolic < 90 || diastolic < 60)
    return { label: "Hypotension", color: "amber" };

  return { label: "Normal", color: "emerald" };
}

// Helper to get sugar status
export function getSugarStatus(
  type: SugarType | null,
  value: number | null
): { label: string; color: string } {
  if (!type || !value) return { label: "Not entered", color: "slate" };
  const thresholds = SUGAR_THRESHOLDS[type];

  // Hypoglycaemia check (not for HbA1c)
  if (
    type !== "hba1c" &&
    "hypoglycaemia" in thresholds &&
    value < thresholds.hypoglycaemia
  ) {
    return { label: "Hypoglycaemia", color: "sky" };
  }

  if (value <= thresholds.normal) {
    return { label: "Normal", color: "emerald" };
  }

  // RBS special case (no pre-diabetes)
  if (type === "rbs" && "diabetes" in thresholds) {
    if (value < thresholds.diabetes) {
      return { label: "Elevated", color: "amber" };
    }
    return { label: "Diabetes Mellitus", color: "rose" };
  }

  // Pre-diabetes range (FBS, PPBS, HbA1c)
  if ("prediabetes" in thresholds && value < thresholds.prediabetes) {
    return { label: "Pre-diabetes", color: "amber" };
  }
  return { label: "Diabetes Mellitus", color: "rose" };
}
