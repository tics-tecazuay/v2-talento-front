import * as ExcelJS from "exceljs";
import saveAs from "file-saver";
import { IExcelReportParams } from "../../interfaces/Secondary/IExcelReportParams";

export const excelExport = async (params: IExcelReportParams) => {
  // create a workbook
  const workbook = new ExcelJS.Workbook();

  // add a worksheet
  const worksheet = workbook.addWorksheet(params.reportName, {
    properties: { tabColor: { argb: "177B487B" } },
  });

  // columns
  const columns = params.headerItems;

  worksheet.mergeCells("A2:I2");
  worksheet.getRow(2).height = 70;
  worksheet.getRow(2).alignment = { vertical: "middle", horizontal: "center" };

  const customCell = worksheet.getCell("A2");
  customCell.font = {
    name: "Franklin Gothic Book",
    family: 4,
    size: 20,
    underline: true,
    bold: true,
  };

  customCell.value = params.reportName;

  // insert logo
  const base64LogoContent =
    "data:image/png;base64,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";
  const logo = workbook.addImage({
    base64: base64LogoContent,
    extension: "png",
  });

  /* worksheet.addImage(logo, {
        tl: { col: 6, row: 2 }, // top-left cell
        ext: { width: 200, height: 100 }, // image dimensions
    });*/

  worksheet.addImage(logo, "G2:I2");

  const headerRow = worksheet.getRow(4);
  headerRow.height = 20;
  headerRow.font = {
    name: "Franklin Gothic Book",
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0C3255" },
  };
  headerRow.border = {
    top: { style: "thin", color: { argb: "FFFCBF64" } },
    left: { style: "thin", color: { argb: "FFFCBF64" } },
    bottom: { style: "thin", color: { argb: "FFFCBF64" } },
    right: { style: "thin", color: { argb: "FFFCBF64" } },
  };

  for (let i = 0; i < columns.length; i++) {
    const currentColumnWidth = columns[i].width;
    worksheet.getColumn(i + 1).width =
      currentColumnWidth !== undefined ? currentColumnWidth : 20;
    const cell = headerRow.getCell(i + 1);
    cell.value = columns[i].header;
  }

  // set auto filer
  worksheet.autoFilter = {
    from: "A4",
    to: {
      row: 4,
      column: columns.length,
    },
  };

  worksheet.views = [{ state: "frozen", ySplit: 4 }];

  // insert data
  for (let i = 0; i < params.rowData.length; i++) {
    const currentCount = i + 1;
    const dataRow = worksheet.getRow(4 + currentCount);
    dataRow.outlineLevel = 1;

    dataRow.values = Object.values(params.rowData[i]);
    dataRow.font = {
      name: "Franklin Gothic Book",
    };
    dataRow.border = {
      top: { style: "thin", color: { argb: "FFFCBF64" } },
      left: { style: "thin", color: { argb: "FFFCBF64" } },
      bottom: { style: "thin", color: { argb: "FFFCBF64" } },
      right: { style: "thin", color: { argb: "FFFCBF64" } },
    };
  }

  workbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Reporte - ${params.reportName}`
    );
  });
};
