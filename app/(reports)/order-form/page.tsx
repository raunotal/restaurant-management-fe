"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import MultiCombobox from "@/components/ui/multi-combox";
import { ComboboxElement } from "@/components/ui/combobox";
import services from "@/service/services";
import { Ingredient } from "@/types/ingredient";
import { useState } from "react";
import {
  exportToExcel,
  exportToPdf,
  buildFilename,
  buildDateLabel,
} from "@/utils/export-order-form";

function filterAndGroupIngredients(
  ingredients: Ingredient[],
  warehouseIds: string[],
  supplierIds: string[],
  categoryIds: string[]
): Map<string, Ingredient[]> {
  const filtered = ingredients.filter((ing) => {
    if (!ing.isActive) return false;
    const matchesWarehouse =
      warehouseIds.length === 0 ||
      (ing.warehouse && warehouseIds.includes(ing.warehouse.id));
    const matchesSupplier =
      supplierIds.length === 0 || supplierIds.includes(ing.supplier.id);
    const matchesCategory =
      categoryIds.length === 0 || categoryIds.includes(ing.category.id);
    return matchesWarehouse && matchesSupplier && matchesCategory;
  });

  const grouped = new Map<string, Ingredient[]>();
  for (const ing of filtered) {
    const key = ing.category.name;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(ing);
  }
  for (const rows of grouped.values()) {
    rows.sort((a, b) => a.name.localeCompare(b.name, "et"));
  }

  return new Map([...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "et")));
}

export default function TellimislehtPage() {
  const ingredients = services.ingredientService.useGetAll().data;
  const warehouses = services.ingredientWarehouseService.useGetAll().data;
  const suppliers = services.supplierService.useGetAll().data;
  const categories = services.ingredientCategoryService.useGetAll().data;

  const [selectedWarehouses, setSelectedWarehouses] = useState<ComboboxElement[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<ComboboxElement[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ComboboxElement[]>([]);
  const [reportRows, setReportRows] = useState<Map<string, Ingredient[]> | null>(null);

  const warehouseOptions: ComboboxElement[] = warehouses.map((w) => ({
    key: w.id,
    value: w.name,
  }));
  const supplierOptions: ComboboxElement[] = suppliers.map((s) => ({
    key: s.id,
    value: s.name,
  }));
  const categoryOptions: ComboboxElement[] = categories.map((c) => ({
    key: c.id,
    value: c.name,
  }));

  const handleExcelExport = async () => {
    if (!reportRows) return;
    await exportToExcel(reportRows, buildFilename(), buildDateLabel());
  };

  const handlePdfExport = () => {
    if (!reportRows) return;
    exportToPdf(reportRows, buildFilename(), buildDateLabel());
  };

  const handleGenerate = () => {
    const rows = filterAndGroupIngredients(
      ingredients,
      selectedWarehouses.map((w) => w.key),
      selectedSuppliers.map((s) => s.key),
      selectedCategories.map((c) => c.key)
    );
    setReportRows(rows);
  };

  return (
    <>
      <PageHeader
        title="Tellimisleht"
        description="Vali filtrid ja koosta tellimisleht."
      />
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <MultiCombobox
            label="Tooraine ladu"
            placeholder="Kõik laod"
            data={warehouseOptions}
            selected={selectedWarehouses}
            onChange={setSelectedWarehouses}
            isField={false}
          />
          <MultiCombobox
            label="Tarnija"
            placeholder="Kõik tarnijad"
            data={supplierOptions}
            selected={selectedSuppliers}
            onChange={setSelectedSuppliers}
            isField={false}
          />
          <MultiCombobox
            label="Tooraine kategooria"
            placeholder="Kõik kategooriad"
            data={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            isField={false}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            className="text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm px-5 h-[40px]"
          >
            Koosta aruanne
          </button>
          <button
            onClick={handleExcelExport}
            disabled={!reportRows}
            className="text-white bg-green-600 font-semibold p-2.5 rounded-md text-sm px-5 h-[40px] disabled:bg-gray-300"
          >
            Excel
          </button>
          <button
            onClick={handlePdfExport}
            disabled={!reportRows}
            className="text-white bg-red-600 font-semibold p-2.5 rounded-md text-sm px-5 h-[40px] disabled:bg-gray-300"
          >
            PDF
          </button>
        </div>
      </div>

      {reportRows !== null && (
        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          {reportRows.size === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              Valitud filtritele vastavaid tooraineid ei leitud.
            </p>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Tooraine
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Kood
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Ostuhind
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Pakend
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">
                    Lao miinimum
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...reportRows.entries()].map(([category, rows]) => (
                  <React.Fragment key={`cat-${category}`}>
                    <tr className="bg-indigo-50">
                      <td
                        colSpan={5}
                        className="py-2 px-4 font-semibold text-indigo-700 text-xs uppercase tracking-wide"
                      >
                        {category}
                      </td>
                    </tr>
                    {rows.map((ing, index) => (
                      <tr
                        key={ing.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-3 px-4 text-gray-900">{ing.name}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {ing.productCode ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {ing.purchasePrice != null ? ing.purchasePrice : "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {ing.bulkPackage ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {ing.warehouseMinQuantity ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
}
