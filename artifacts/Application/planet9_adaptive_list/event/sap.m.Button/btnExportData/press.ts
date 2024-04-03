const { valuesIndex, csvDelimiterIndex } = modelformExportImport.getData();
const exportFormatted = radioGroupValues.getButtons()[valuesIndex]?.getText() === "Formatted values";
const csvDelimiter = radioGroupDelimiter.getButtons()[csvDelimiterIndex]?.getText() === "Comma" ? "," : ";";

report.export(csvDelimiter, exportFormatted);
diaExportImportData.close();
