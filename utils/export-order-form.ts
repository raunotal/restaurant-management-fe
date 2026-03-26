import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Ingredient } from "@/types/ingredient";

const TOTAL_COLS = 12; // 5 data + 7 empty
const COLUMN_HEADERS = [
  "Tooraine",
  "Kood",
  "Ostuhind",
  "Pakend",
  "Lao miinimum",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const THIN_BORDER: Partial<ExcelJS.Border> = { style: "thin" };
const CELL_BORDER = {
  top: THIN_BORDER,
  left: THIN_BORDER,
  bottom: THIN_BORDER,
  right: THIN_BORDER,
};
const INDIGO_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9DFF5" },
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function buildFilename(): string {
  const now = new Date();
  return `Tellimisleht_${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
}

export function buildDateLabel(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} - ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function applyBorderToRow(row: ExcelJS.Row): void {
  for (let col = 1; col <= TOTAL_COLS; col++) {
    row.getCell(col).border = CELL_BORDER;
  }
}

export async function exportToExcel(
  reportRows: Map<string, Ingredient[]>,
  filename: string,
  dateLabel: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Tellimisleht");

  worksheet.columns = [
    { key: "c1", width: 30 },
    { key: "c2", width: 15 },
    { key: "c3", width: 12 },
    { key: "c4", width: 15 },
    { key: "c5", width: 15 },
    { key: "c6", width: 12 },
    { key: "c7", width: 12 },
    { key: "c8", width: 12 },
    { key: "c9", width: 12 },
    { key: "c10", width: 12 },
    { key: "c11", width: 12 },
    { key: "c12", width: 12 },
  ];

  // Header row
  const headerRow = worksheet.addRow(COLUMN_HEADERS);
  headerRow.font = { bold: true };
  headerRow.fill = INDIGO_FILL;
  applyBorderToRow(headerRow);

  // Data rows grouped by category
  for (const [category, ingredients] of reportRows.entries()) {
    const catRow = worksheet.addRow([
      category,
      ...Array(TOTAL_COLS - 1).fill(""),
    ]);
    worksheet.mergeCells(catRow.number, 1, catRow.number, TOTAL_COLS);
    catRow.getCell(1).font = { bold: true };
    catRow.getCell(1).fill = INDIGO_FILL;
    catRow.getCell(1).border = CELL_BORDER;

    for (const ing of ingredients) {
      const dataRow = worksheet.addRow([
        ing.name,
        ing.productCode ?? "",
        ing.purchasePrice ?? "",
        ing.bulkPackage ?? "",
        ing.warehouseMinQuantity ?? "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
      applyBorderToRow(dataRow);
      if (ing.purchasePrice != null) {
        dataRow.getCell(3).numFmt = "#,##0.00";
      }
    }
  }

  worksheet.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };
  worksheet.headerFooter = {
    oddHeader: `&L&"Arial,Bold"Tellimisleht - ${dateLabel}&R&P/&N`,
    evenHeader: `&L&"Arial,Bold"Tellimisleht - ${dateLabel}&R&P/&N`,
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToPdf(
  reportRows: Map<string, Ingredient[]>,
  filename: string,
  dateLabel: string
): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any[] = [];
  for (const [category, ingredients] of reportRows.entries()) {
    body.push([
      {
        content: category,
        colSpan: TOTAL_COLS,
        styles: {
          fontStyle: "bold",
          fillColor: [217, 223, 245],
          textColor: [79, 70, 229],
        },
      },
    ]);
    for (const ing of ingredients) {
      body.push([
        ing.name,
        ing.productCode ?? "",
        ing.purchasePrice != null ? ing.purchasePrice : "",
        ing.bulkPackage ?? "",
        ing.warehouseMinQuantity ?? "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]);
    }
  }

  autoTable(doc, {
    theme: "grid",
    startY: 12,
    head: [COLUMN_HEADERS],
    body,
    headStyles: {
      fillColor: [217, 223, 245],
      textColor: [55, 48, 163],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 22 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
      9: { cellWidth: 18 },
      10: { cellWidth: 18 },
      11: { cellWidth: 18 },
    },
    margin: { left: margin, right: margin },
  });

  // Add per-page headers after table is fully rendered
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`Tellimisleht - ${dateLabel}`, margin, 8);
    doc.text(`${i}/${totalPages}`, pageWidth - margin, 8, { align: "right" });
  }

  doc.save(`${filename}.pdf`);
}
