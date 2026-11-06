import { Download } from "lucide-react";

const englishWorksheetPath = "/downloads/variation-lab-student-worksheet.pdf";
const bilingualWorksheetPath = "/downloads/variation-lab-student-worksheet-bilingual.pdf";

export default function WorksheetDownload() {
  return (
    <section className="worksheet-download-card" aria-labelledby="worksheet-download-title">
      <div className="worksheet-download-copy">
        <p className="worksheet-download-kicker">Offline field workbooks · 18-page A4 PDFs</p>
        <h3 id="worksheet-download-title">Take all eight investigations offline</h3>
        <p className="worksheet-download-description">
          Learning goals, safe methods, risk checks, blank data tables, graph pages, and investigation images.
          The bilingual edition keeps English instructions and adds Traditional Chinese keywords.
        </p>
        <p className="worksheet-download-note">
          Both are blank templates; neither includes live class submissions or student data.
        </p>
      </div>
      <div className="worksheet-download-actions" aria-label="Student workbook PDF editions">
        <a
          className="worksheet-download-link"
          href={englishWorksheetPath}
          download="Variation-Lab-Student-Field-Workbook.pdf"
          aria-label="Download the 18-page English student field workbook PDF"
        >
          <Download size={24} aria-hidden="true" />
          <span className="worksheet-download-link-copy">
            <strong>English PDF</strong>
            <small>18 pages · English instructions</small>
          </span>
        </a>
        <a
          className="worksheet-download-link worksheet-download-link--bilingual"
          href={bilingualWorksheetPath}
          download="Variation-Lab-Student-Field-Workbook-Traditional-Chinese-Keywords.pdf"
          aria-label="Download the 18-page bilingual workbook PDF with Traditional Chinese keyword translations"
        >
          <Download size={24} aria-hidden="true" />
          <span className="worksheet-download-link-copy">
            <strong>Bilingual PDF</strong>
            <small>Traditional Chinese keywords</small>
          </span>
        </a>
      </div>
    </section>
  );
}
