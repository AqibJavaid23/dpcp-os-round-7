/** Tiny text PDF so the monthly report can be downloaded without a server. */

export function pdfBlob(title: string, lines: string[]) {
  const pages: string[][] = [];
  let page: string[] = [];
  lines.forEach((line) => {
    page.push(line);
    if (page.length >= 42) {
      pages.push(page);
      page = [];
    }
  });
  if (page.length) pages.push(page);
  if (pages.length === 0) pages.push([title]);

  const objects: string[] = [];
  const add = (body: string) => {
    objects.push(body);
    return objects.length;
  };
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];
  pages.forEach((rows, index) => {
    const text = [`BT /F1 11 Tf 48 780 Td`, `(${escapePdf(index === 0 ? title : title + " (continued)")}) Tj`, `0 -22 Td`];
    rows.forEach((row) => {
      text.push(`(${escapePdf(row.slice(0, 110))}) Tj`);
      text.push(`0 -16 Td`);
    });
    text.push("ET");
    const content = add(`<< /Length ${text.join("\n").length} >>\nstream\n${text.join("\n")}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Contents ${content} 0 R /Resources << /Font << /F1 ${font} 0 R >> >> >>`));
  });
  const kids = pageIds.map((id) => `${id} 0 R`).join(" ");
  const pagesId = add(`<< /Type /Pages /Count ${pageIds.length} /Kids [${kids}] >>`);
  objects[pagesId - 1] = objects[pagesId - 1];
  objects.forEach((body, index) => {
    pageIds.forEach((id) => {
      if (index + 1 === id) objects[index] = body.replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
    });
  });
  const catalog = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  let out = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(out.length);
    out += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    out += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  out += `trailer << /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([out], { type: "application/pdf" });
}

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
