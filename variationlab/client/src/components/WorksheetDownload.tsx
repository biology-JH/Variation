import { Download } from "lucide-react";

const worksheetPath = "/downloads/variation-lab-student-worksheet.pdf";

export default function WorksheetDownload() {
  return (
    <section className="worksheet-download-card" aria-labelledby="worksheet-download-title">
      <div className="worksheet-download-copy">
        <p className="worksheet-download-kicker">Offline field workbook · 20-page A4 PDF</p>
        <h3 id="worksheet-download-title">Take all eight investigations offline</h3>
        <p className="worksheet-download-description">
          Learning goals, safe methods, risk checks, blank data tables, graph pages, and image credits.
        </p>
        <p className="worksheet-download-note">Blank template · contains no live class or student data</p>
      </div>
      <a
        className="worksheet-download-link"
        href={worksheetPath}
        download="Variation-Lab-Student-Field-Workbook.pdf"
        aria-label="Download the Variation Lab student field workbook as a PDF"
      >
        <Download size={22} aria-hidden="true" />
        <span>Download PDF</span>
      </a>
    </section>
  );
}
