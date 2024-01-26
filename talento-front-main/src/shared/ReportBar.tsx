import { Button } from "primereact/button";
import React from "react";
import { excelExport } from "../services/functions/excelExport";
import { IExcelReportParams } from "../interfaces/Secondary/IExcelReportParams";
import swal from "sweetalert"; // Asegúrate de importar la biblioteca SweetAlert

export function ReportBar(props: IExcelReportParams) {
  const handleExportExcel = () => {
    excelExport(props)
      .then(() => {
        console.log("Generated report");
        swal({
          title: "Reporte Generado",
          text: "El archivo se ha descargado con éxito.",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex align-items-center justify-content-end pt-5">
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        data-pr-tooltip="XLS"
        onClick={handleExportExcel}
      />
    </div>
  );
}
