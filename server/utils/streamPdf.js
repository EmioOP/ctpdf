export const streamPdf = (res, pdfBuffer, fileName = "code") => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-length", pdfBuffer.length);
  res.end(pdfBuffer);
};
