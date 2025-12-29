"use client";

import { useState } from "react";
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
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n-context";
import {
  Heart,
  ChevronLeft,
  Building2,
  Search,
  Clock,
  Phone,
  Stethoscope,
  CheckCircle2,
  Info,
  ArrowRight,
  Navigation,
  Users,
  Pill,
  Activity,
} from "lucide-react";

// Kerala districts for the dropdown
const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export default function FindJAKPage() {
  const [district, setDistrict] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { t } = useI18n();

  const handleSearch = () => {
    setHasSearched(true);
    // TODO: Implement actual search when data is available
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50">
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
                className="bg-teal-100 text-teal-700 border-teal-200"
              >
                <Building2 className="w-3 h-3 mr-1" />
                {t("tool_jak_badge")}
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/30">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {t("tool_jak_title")}
            </h1>
            <p className="text-slate-600">{t("tool_jak_subtitle")}</p>
          </div>

          {/* What is JAK */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" />
                {t("tool_jak_what_is_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {t("tool_jak_what_is_description_1")}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t("tool_jak_what_is_description_2")}
              </p>
            </CardContent>
          </Card>

          {/* Services Available */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("tool_jak_services_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Stethoscope, text: t("tool_jak_service_opd") },
                  { icon: Activity, text: t("tool_jak_service_ncd") },
                  { icon: Pill, text: t("tool_jak_service_medicines") },
                  { icon: Users, text: t("tool_jak_service_family") },
                  { icon: Clock, text: t("tool_jak_service_lab") },
                  { icon: Phone, text: t("tool_jak_service_teleconsult") },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
                  >
                    <item.icon className="w-4 h-4 text-teal-600" />
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Section */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-600" />
                {t("tool_jak_search_title")}
              </CardTitle>
              <CardDescription>
                {t("tool_jak_search_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("tool_jak_select_district")}</Label>
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("tool_jak_choose_district")} />
                  </SelectTrigger>
                  <SelectContent>
                    {KERALA_DISTRICTS.map((d) => (
                      <SelectItem key={d} value={d.toLowerCase()}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">{t("tool_jak_search_by_name")}</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder={t("tool_jak_search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSearch}
                className="w-full bg-teal-600 hover:bg-teal-700 gap-2"
              >
                <Search className="w-4 h-4" />
                {t("common_search")}
              </Button>
            </CardContent>
          </Card>

          {/* Search Results Placeholder */}
          {hasSearched && (
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-semibold">
                {t("tool_jak_coming_soon_title")}
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                {t("tool_jak_coming_soon_description")}
              </AlertDescription>
            </Alert>
          )}

          {/* Alternative Options */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                {t("tool_jak_other_ways_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t("tool_jak_helpline_title")}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t("tool_jak_helpline_description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t("tool_jak_asha_title")}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t("tool_jak_asha_description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t("tool_jak_phc_title")}
                  </p>
                  <p className="text-sm text-slate-600">
                    {t("tool_jak_phc_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                {t("tool_jak_hours_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">
                    {t("tool_jak_hours_weekday")}
                  </span>
                  <span className="font-medium text-slate-900">
                    {t("tool_jak_hours_weekday_time")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600">
                    {t("tool_jak_hours_emergency")}
                  </span>
                  <span className="font-medium text-slate-900">
                    {t("tool_jak_hours_emergency_time")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">
                    {t("tool_jak_hours_sunday")}
                  </span>
                  <span className="font-medium text-slate-500">
                    {t("tool_jak_hours_sunday_time")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {t("tool_jak_hours_note")}
              </p>
            </CardContent>
          </Card>

          {/* What to Bring */}
          <Card className="bg-teal-50 border-teal-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-teal-900">
                {t("tool_jak_bring_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  t("tool_jak_bring_1"),
                  t("tool_jak_bring_2"),
                  t("tool_jak_bring_3"),
                  t("tool_jak_bring_4"),
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-teal-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Full Assessment CTA */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 text-white">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  {t("tool_jak_cta_title")}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {t("tool_jak_cta_description")}
                </p>
                <Link href="/assessment/step-1">
                  <Button
                    variant="secondary"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 gap-2"
                  >
                    {t("tool_jak_cta_button")}
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
