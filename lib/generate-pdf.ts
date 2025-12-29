import { jsPDF } from "jspdf";
import {
  AssessmentData,
  getBPStatus,
  getSugarStatus,
} from "./assessment-context";

interface PDFData {
  data: AssessmentData;
  bmi: number | null;
  bmiCategory: { label: string; color: string } | null;
  cbacScore: number;
  keyAdvice: string[];
  dietTips: string[];
  sugarTips: string[];
  activityTips: string[];
}

export function generateHealthPDF({
  data,
  bmi,
  bmiCategory,
  cbacScore,
  keyAdvice,
  dietTips,
  sugarTips,
  activityTips,
}: PDFData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;
  let currentPage = 1;

  const bpStatus = getBPStatus(data.systolic, data.diastolic);
  const sugarStatus = getSugarStatus(data.sugarType, data.sugarValue);

  // Colors
  const emerald600 = [5, 150, 105] as const;
  const emerald800 = [6, 95, 70] as const;
  const emerald100 = [209, 250, 229] as const;
  const slate900 = [15, 23, 42] as const;
  const slate700 = [51, 65, 85] as const;
  const slate600 = [71, 85, 105] as const;
  const slate400 = [148, 163, 184] as const;
  const slate100 = [241, 245, 249] as const;
  const amber100 = [254, 243, 199] as const;
  const amber400 = [251, 191, 36] as const;
  const amber800 = [146, 64, 14] as const;
  const amber900 = [120, 53, 15] as const;
  const rose100 = [255, 228, 230] as const;
  const rose800 = [159, 18, 57] as const;
  const white = [255, 255, 255] as const;

  // Helper: check if we need a new page
  const checkNewPage = (requiredSpace: number = 30) => {
    if (y + requiredSpace > pageHeight - 30) {
      addFooter();
      doc.addPage();
      currentPage++;
      y = 25;
      return true;
    }
    return false;
  };

  // Helper: add footer to current page
  const addFooter = () => {
    const footerY = pageHeight - 12;
    doc.setDrawColor(slate400[0], slate400[1], slate400[2]);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(slate400[0], slate400[1], slate400[2]);
    doc.text(
      `© ${new Date().getFullYear()} Healthy Life Campaign`,
      margin,
      footerY
    );

    const pageText = `Page ${currentPage}`;
    doc.text(pageText, pageWidth / 2 - doc.getTextWidth(pageText) / 2, footerY);

    doc.text(
      "www.healthylife.campaign",
      pageWidth - margin - doc.getTextWidth("www.healthylife.campaign"),
      footerY
    );
  };

  // Helper: Draw heart shape (emerald heart)
  // const drawHeart = (cx: number, cy: number, size: number) => {
  //   // Set fill color to emerald for the heart
  //   doc.setFillColor(emerald600[0], emerald600[1], emerald600[2]);

  //   // Heart proportions
  //   const w = size * 0.5; // half width
  //   const h = size * 0.55; // height

  //   // Top bumps (two circles)
  //   const bumpRadius = w * 0.52;
  //   const bumpY = cy - h * 0.25;

  //   // Left bump
  //   doc.circle(cx - w * 0.5, bumpY, bumpRadius, "F");
  //   // Right bump
  //   doc.circle(cx + w * 0.5, bumpY, bumpRadius, "F");

  //   // Center rectangle to fill gap
  //   doc.rect(cx - w * 0.4, bumpY - bumpRadius * 0.2, w, bumpRadius * 1.2, "F");

  //   // Bottom triangle
  //   doc.triangle(
  //     cx - w - bumpRadius * 0.10,
  //     bumpY + bumpRadius * 0.4,
  //     cx + w + bumpRadius * 0.10,
  //     bumpY + bumpRadius * 0.4,
  //     cx,
  //     cy + h * 0.7,
  //     "F"
  //   );
  // };

  const drawHeart = (cx: number, cy: number, size: number) => {
    // Set fill color
    doc.setFillColor(emerald600[0], emerald600[1], emerald600[2]);
  };

  // Header
  const addHeader = () => {
    // Green header bar
    doc.setFillColor(emerald600[0], emerald600[1], emerald600[2]);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Logo: white circle background - bigger size
    doc.setFillColor(white[0], white[1], white[2]);
    doc.circle(margin + 14, 20, 14, "F");

    // Draw emerald heart inside the white circle - bigger size
    drawHeart(margin + 14, 19, 16);

    // Title
    doc.setTextColor(white[0], white[1], white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Healthy Life Campaign", margin + 32, 16);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Health Risk Assessment Summary", margin + 32, 24);

    // Date
    const date = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.setFontSize(10);
    doc.text(date, pageWidth - margin - doc.getTextWidth(date), 26);

    y = 52;
  };

  // Section title with colored left border
  const addSectionTitle = (title: string) => {
    checkNewPage(40);

    // Background
    doc.setFillColor(slate100[0], slate100[1], slate100[2]);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");

    // Left accent bar
    doc.setFillColor(emerald600[0], emerald600[1], emerald600[2]);
    doc.rect(margin, y, 4, 12, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(title, margin + 10, y + 8);
    y += 18;
  };

  // Metric row with badge
  const addMetricRow = (
    label: string,
    value: string,
    status: string,
    statusColor: string
  ) => {
    checkNewPage(15);

    // Background stripe
    doc.setFillColor(white[0], white[1], white[2]);
    doc.rect(margin, y - 5, contentWidth, 14, "F");

    // Bottom border
    doc.setDrawColor(slate100[0], slate100[1], slate100[2]);
    doc.line(margin, y + 9, pageWidth - margin, y + 9);

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(slate700[0], slate700[1], slate700[2]);
    doc.text(label, margin + 4, y + 3);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(value, margin + 80, y + 3);

    // Status badge
    const badgeWidth = 38;
    const badgeX = pageWidth - margin - badgeWidth - 4;
    let badgeColor: readonly number[];
    let textColor: readonly number[];

    switch (statusColor) {
      case "emerald":
        badgeColor = emerald100;
        textColor = emerald800;
        break;
      case "amber":
        badgeColor = amber100;
        textColor = amber800;
        break;
      case "rose":
        badgeColor = rose100;
        textColor = rose800;
        break;
      default:
        badgeColor = slate100;
        textColor = slate600;
    }

    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(badgeX, y - 3, badgeWidth, 10, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    const statusWidth = doc.getTextWidth(status);
    doc.text(status, badgeX + badgeWidth / 2 - statusWidth / 2, y + 3);

    y += 16;
  };

  // Bullet list
  const addBulletList = (items: string[]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(slate700[0], slate700[1], slate700[2]);

    items.forEach((item) => {
      checkNewPage(12);

      // Bullet point (circle)
      doc.setFillColor(emerald600[0], emerald600[1], emerald600[2]);
      doc.circle(margin + 6, y - 1.5, 1.5, "F");

      // Text with wrapping
      const lines = doc.splitTextToSize(item, contentWidth - 16);
      doc.text(lines, margin + 12, y);
      y += lines.length * 5 + 4;
    });
  };

  // Sub-heading
  const addSubHeading = (text: string) => {
    checkNewPage(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    doc.text(text, margin + 4, y);
    y += 8;
  };

  // Disclaimer box
  const addDisclaimer = () => {
    checkNewPage(45);

    y += 6;

    // Box background
    doc.setFillColor(amber100[0], amber100[1], amber100[2]);
    doc.roundedRect(margin, y, contentWidth, 32, 3, 3, "F");
    doc.setDrawColor(amber400[0], amber400[1], amber400[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 32, 3, 3, "S");

    // Warning icon (triangle with !)
    doc.setFillColor(amber800[0], amber800[1], amber800[2]);
    const iconX = margin + 8;
    const iconY = y + 8;
    // Draw triangle
    doc.triangle(iconX, iconY + 6, iconX + 6, iconY + 6, iconX + 3, iconY, "F");
    doc.setFillColor(amber100[0], amber100[1], amber100[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("!", iconX + 2, iconY + 5);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(amber800[0], amber800[1], amber800[2]);
    doc.text("Important Disclaimer", margin + 16, y + 9);

    // Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(amber900[0], amber900[1], amber900[2]);
    const disclaimer =
      "This tool provides general health risk information and is NOT a medical diagnosis. It does NOT provide treatment advice. If you have symptoms or concerns, please consult a doctor or visit your nearest health facility for proper evaluation.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 12);
    doc.text(disclaimerLines, margin + 6, y + 17);

    y += 40;
  };

  // Privacy note
  const addPrivacyNote = () => {
    checkNewPage(25);

    doc.setFillColor(emerald100[0], emerald100[1], emerald100[2]);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");

    // Lock icon (simple rectangle with circle)
    doc.setFillColor(emerald800[0], emerald800[1], emerald800[2]);
    doc.roundedRect(margin + 6, y + 6, 6, 6, 1, 1, "F");
    doc.setFillColor(emerald100[0], emerald100[1], emerald100[2]);
    doc.circle(margin + 9, y + 9, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(emerald800[0], emerald800[1], emerald800[2]);
    doc.text("Privacy Protected", margin + 16, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "No personal identifiers were collected. All calculations were performed on your device.",
      margin + 16,
      y + 14
    );

    y += 24;
  };

  // ========== Generate PDF Content ==========

  addHeader();

  // === PAGE 1: Measurements & Risk Assessment ===

  // Measurements Section
  addSectionTitle("Your Measurements");

  if (bmi && bmiCategory) {
    addMetricRow(
      "Body Mass Index (BMI)",
      bmi.toFixed(1),
      bmiCategory.label,
      bmiCategory.color
    );
  }

  if (data.bpEntered) {
    addMetricRow(
      "Blood Pressure",
      `${data.systolic}/${data.diastolic} mmHg`,
      bpStatus.label,
      bpStatus.color
    );
  } else {
    addMetricRow("Blood Pressure", "Not entered", "N/A", "slate");
  }

  if (data.sugarEntered) {
    const unit = data.sugarType === "hba1c" ? "%" : "mg/dL";
    addMetricRow(
      `Blood Sugar (${data.sugarType?.toUpperCase() || "N/A"})`,
      `${data.sugarValue} ${unit}`,
      sugarStatus.label,
      sugarStatus.color
    );
  } else {
    addMetricRow("Blood Sugar", "Not entered", "N/A", "slate");
  }

  y += 6;

  // Risk Assessment Section
  addSectionTitle("Risk Assessment");

  const cbacRisk = cbacScore > 4 ? "Higher risk" : "Lower risk";
  const cbacColor = cbacScore > 4 ? "amber" : "emerald";
  addMetricRow("CBAC Score", cbacScore.toString(), cbacRisk, cbacColor);

  y += 6;

  // Key Recommendations Section
  if (keyAdvice.length > 0) {
    addSectionTitle("Key Recommendations");
    addBulletList(keyAdvice);
    y += 4;
  }

  // === PAGE 2 (if needed): Guidance ===

  // Diet Guidance Section
  if (dietTips.length > 0 || sugarTips.length > 0) {
    addSectionTitle("Diet Guidance");

    if (dietTips.length > 0) {
      addBulletList(dietTips);
    }

    if (sugarTips.length > 0) {
      y += 2;
      addSubHeading("For blood sugar management:");
      addBulletList(sugarTips);
    }
    y += 4;
  }

  // Activity Guidance Section
  if (activityTips.length > 0) {
    addSectionTitle("Activity Guidance");
    addBulletList(activityTips);
    y += 4;
  }

  // Disclaimer
  addDisclaimer();

  // Privacy Note
  addPrivacyNote();

  // Add footer to last page
  addFooter();

  // Save PDF
  const filename = `health-assessment-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);

  return filename;
}
