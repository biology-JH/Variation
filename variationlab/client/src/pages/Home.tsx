import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { ArrowUpRight, Download, FlaskConical, Leaf, LockKeyhole, Plus, Radio, RotateCcw, Send, ShieldCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Histogram = {
  values: number[];
  bins: { label: string; start: number; end: number; frequency: number }[];
  min: number | null;
  max: number | null;
  unit: string;
};
type Snapshot = {
  totalSampleSize: number;
  updatedAt: string;
  histograms: Record<"bodyMass" | "height" | "handSpan" | "leafLength" | "seedMass", Histogram>;
  categories: Record<"tongueRolling" | "eyeColour" | "bloodGroup", { label: string; frequency: number }[]>;
};

const emptySnapshot: Snapshot = {
  totalSampleSize: 0,
  updatedAt: "",
  histograms: {
    bodyMass: { values: [], bins: [], min: null, max: null, unit: "kg" },
    height: { values: [], bins: [], min: null, max: null, unit: "cm" },
    handSpan: { values: [], bins: [], min: null, max: null, unit: "cm" },
    leafLength: { values: [], bins: [], min: null, max: null, unit: "cm" },
    seedMass: { values: [], bins: [], min: null, max: null, unit: "g" },
  },
  categories: {
    tongueRolling: [{ label: "can", frequency: 0 }, { label: "cannot", frequency: 0 }],
    eyeColour: ["brown", "blue", "green", "hazel"].map((label) => ({ label, frequency: 0 })),
    bloodGroup: ["A", "B", "AB", "O"].map((label) => ({ label, frequency: 0 })),
  },
};

const categoryLabels: Record<string, string> = { can: "Can", cannot: "Cannot", brown: "Brown", blue: "Blue", green: "Green", hazel: "Hazel" };
function Field({ label, unit, hint, value, onChange, type = "number", min, max, step = "any" }: { label: string; unit?: string; hint?: string; value: string; onChange: (value: string) => void; type?: string; min?: string; max?: string; step?: string }) {
  return (
    <label className="lab-field">
      <span className="lab-field-label"><span>{label}</span>{unit && <em>{unit}</em>}</span>
      <input type={type} inputMode={type === "number" ? "decimal" : undefined} min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} placeholder="—" />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function ChoiceGroup({ label, options, value, onChange, note }: { label: string; options: { value: string; label: string; accent?: string }[]; value: string; onChange: (value: string) => void; note?: string }) {
  return (
    <fieldset className="choice-field">
      <legend>{label}</legend>
      <div className="choice-grid">
        {options.map((option) => (
          <button type="button" key={option.value} className={`choice-chip ${value === option.value ? "selected" : ""}`} data-accent={option.accent} onClick={() => onChange(value === option.value ? "" : option.value)}>
            <span className="choice-dot" />{option.label}
          </button>
        ))}
      </div>
      {note && <small>{note}</small>}
    </fieldset>
  );
}

function ChartFrame({ number, title, tag, image, children, emptyLabel }: { number: string; title: string; tag: string; image: string; children: React.ReactNode; emptyLabel: string }) {
  return (
    <article className="chart-card">
      <div className="chart-card-top"><span className="chart-number">{number}</span><span className="evidence-tag">{tag}</span></div>
      <div className="chart-activity-image"><img src={image} alt="" /></div><div className="chart-title-row"><h3>{title}</h3><ArrowUpRight size={17} strokeWidth={1.8} /></div>
      <div className="chart-wrap">{children}</div>
      <div className="chart-footnote"><span className="axis-rule" />{emptyLabel}</div>
    </article>
  );
}

function HistogramChart({ histogram }: { histogram: Histogram }) {
  const data = histogram.bins.map((bin) => ({ label: bin.label, frequency: bin.frequency }));
  if (!data.length) return <div className="chart-empty"><span>Waiting for the first observation</span><span className="empty-line" /></div>;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 8, left: -22, bottom: 2 }} barCategoryGap={0} barGap={0}>
        <CartesianGrid vertical={false} stroke="#dfe4ef" strokeDasharray="2 4" />
        <XAxis dataKey="label" tick={{ fill: "#63708a", fontSize: 10 }} axisLine={{ stroke: "#cbd3e2" }} tickLine={false} interval={data.length > 7 ? 1 : 0} />
        <YAxis allowDecimals={false} tick={{ fill: "#63708a", fontSize: 10 }} axisLine={false} tickLine={false} width={34} />
        <Tooltip cursor={{ fill: "rgba(91,124,255,.08)" }} contentStyle={{ borderRadius: 10, border: "1px solid #dfe4ef", boxShadow: "0 10px 30px rgba(35,47,79,.12)" }} formatter={(value) => [`${value} observations`, "Frequency"]} />
        <Bar dataKey="frequency" fill="#5b7cff" radius={[3, 3, 0, 0]} animationDuration={500} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryChart({ data, color }: { data: { label: string; frequency: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.map((item) => ({ ...item, label: categoryLabels[item.label] ?? item.label }))} margin={{ top: 10, right: 8, left: -22, bottom: 2 }} barCategoryGap="24%">
        <CartesianGrid vertical={false} stroke="#dfe4ef" strokeDasharray="2 4" />
        <XAxis dataKey="label" tick={{ fill: "#63708a", fontSize: 10 }} axisLine={{ stroke: "#cbd3e2" }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: "#63708a", fontSize: 10 }} axisLine={false} tickLine={false} width={34} />
        <Tooltip cursor={{ fill: "rgba(234,111,93,.08)" }} contentStyle={{ borderRadius: 10, border: "1px solid #dfe4ef", boxShadow: "0 10px 30px rgba(35,47,79,.12)" }} formatter={(value) => [`${value} observations`, "Frequency"]} />
        <Bar dataKey="frequency" fill={color} radius={[4, 4, 0, 0]} animationDuration={500} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Home() {
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [form, setForm] = useState({ bodyMass: "", height: "", handSpan: "", tongueRolling: "", eyeColour: "", bloodGroup: "" });
  const [leafLengths, setLeafLengths] = useState<string[]>([""]);
  const [seedMasses, setSeedMasses] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [teacherKey, setTeacherKey] = useState("");
  const [live, setLive] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const loadSnapshot = useCallback(async () => {
    try {
      const response = await fetch("/api/class-data", { cache: "no-store" });
      if (!response.ok) throw new Error("Snapshot unavailable");
      setSnapshot(await response.json());
    } catch {
      setLive(false);
    }
  }, []);

  useEffect(() => {
    void loadSnapshot();
    const source = new EventSource("/api/class-data/stream");
    const handleSnapshot = (event: MessageEvent<string>) => {
      setSnapshot(JSON.parse(event.data));
      setLive(true);
    };
    source.addEventListener("snapshot", handleSnapshot);
    source.onerror = () => setLive(false);
    const poll = window.setInterval(() => void loadSnapshot(), 5000);
    return () => { source.close(); window.clearInterval(poll); };
  }, [loadSnapshot]);

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const hasAnyValue = useMemo(() => Object.values(form).some(Boolean) || leafLengths.some(Boolean) || seedMasses.some(Boolean), [form, leafLengths, seedMasses]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      leafLengths: leafLengths.filter(Boolean).map(Number),
      seedMasses: seedMasses.filter(Boolean).map(Number),
    };
    if (!payload.leafLengths.length) delete (payload as { leafLengths?: number[] }).leafLengths;
    if (!payload.seedMasses.length) delete (payload as { seedMasses?: number[] }).seedMasses;
    try {
      const response = await fetch("/api/class-data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save this submission.");
      toast.success("Evidence added to the class pattern.");
      setForm({ bodyMass: "", height: "", handSpan: "", tongueRolling: "", eyeColour: "", bloodGroup: "" });
      setLeafLengths([""]);
      setSeedMasses([""]);
      setConsentGiven(false);
      void loadSnapshot();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save this submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const exportCsv = async () => {
    if (!teacherKey) return toast.error("Enter the teacher key first.");
    const response = await fetch(`/api/export.csv?key=${encodeURIComponent(teacherKey)}`);
    if (!response.ok) return toast.error("Teacher key not accepted.");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `variation-lab-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded.");
  };

  const clearDatabase = async () => {
    if (!teacherKey) return toast.error("Enter the teacher key first.");
    if (!window.confirm("Clear every anonymous class submission? This cannot be undone.")) return;
    const response = await fetch("/api/class-data", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: teacherKey }) });
    if (!response.ok) return toast.error("Teacher key not accepted.");
    toast.success("Class dataset cleared for the next period.");
    void loadSnapshot();
  };

  return (
    <main className="app-shell">
      <aside className="entry-rail">
        <div className="brand-lockup"><div className="brand-mark"><span>V</span><span>L</span></div><div><p className="eyebrow">BIOLOGY / 18.1</p><h1>Variation Lab<span>Live</span></h1></div></div>
        <div className="rail-rule" />
        <div className="rail-intro"><span className="section-kicker">01 / Add evidence</span><h2>One class.<br /><i>Many patterns.</i></h2><p>Enter only the result you want to share. No names. No codes. Just the evidence.</p></div>
        <form className="entry-form" onSubmit={submit}>
          <div className="form-section"><div className="form-section-heading"><span className="section-kicker">Measurements</span><span className="muted-label">Enter what you measured</span></div>
            <Field label="Body mass" unit="kg" hint="20–300 kg" value={form.bodyMass} onChange={(v) => update("bodyMass", v)} min="20" max="300" />
            <Field label="Height" unit="cm" hint="80–230 cm" value={form.height} onChange={(v) => update("height", v)} min="80" max="230" />
            <Field label="Hand span" unit="cm" hint="5–35 cm" value={form.handSpan} onChange={(v) => update("handSpan", v)} min="5" max="35" />
            <div className="leaf-input"><div className="leaf-head"><span>Leaf lengths <em>cm</em></span><button type="button" onClick={() => setLeafLengths((rows) => [...rows, ""])}><Plus size={14} /> add row</button></div>{leafLengths.map((value, index) => <div className="leaf-row" key={index}><span>{String(index + 1).padStart(2, "0")}</span><input type="number" min="0.5" max="60" step="0.1" value={value} onChange={(event) => setLeafLengths((rows) => rows.map((row, rowIndex) => rowIndex === index ? event.target.value : row))} placeholder="leaf length" />{leafLengths.length > 1 && <button type="button" aria-label="Remove leaf row" onClick={() => setLeafLengths((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}><X size={14} /></button>}</div>)}</div>
            <div className="leaf-input seed-mass-input"><div className="leaf-head"><span>Seed mass <em>g</em></span><button type="button" onClick={() => setSeedMasses((rows) => [...rows, ""])}><Plus size={14} /> add row</button></div>{seedMasses.map((value, index) => <div className="leaf-row" key={index}><span>{String(index + 1).padStart(2, "0")}</span><input type="number" min="0.001" max="10" step="0.001" value={value} onChange={(event) => setSeedMasses((rows) => rows.map((row, rowIndex) => rowIndex === index ? event.target.value : row))} placeholder="seed mass" />{seedMasses.length > 1 && <button type="button" aria-label="Remove seed mass row" onClick={() => setSeedMasses((rows) => rows.filter((_, rowIndex) => rowIndex !== index))}><X size={14} /></button>}</div>)}<small>0.001–10 g per row</small></div>
          </div>
          <div className="form-section categorical-section"><div className="form-section-heading"><span className="section-kicker coral-kicker">Categories</span><span className="muted-label">Choose one if you wish</span></div>
            <ChoiceGroup label="Tongue rolling" options={[{ value: "can", label: "Can" }, { value: "cannot", label: "Cannot" }]} value={form.tongueRolling} onChange={(v) => update("tongueRolling", v)} note="Opt in only — skip if you prefer." />
            <ChoiceGroup label="Eye colour" options={[{ value: "brown", label: "Brown", accent: "brown" }, { value: "blue", label: "Blue", accent: "blue" }, { value: "green", label: "Green", accent: "green" }, { value: "hazel", label: "Hazel", accent: "hazel" }]} value={form.eyeColour} onChange={(v) => update("eyeColour", v)} />
            <ChoiceGroup label="Blood group (simulated)" options={[{ value: "A", label: "A" }, { value: "B", label: "B" }, { value: "AB", label: "AB" }, { value: "O", label: "O" }]} value={form.bloodGroup} onChange={(v) => update("bloodGroup", v)} note="Use simulated data only." />
          </div>
          <div className="consent-box">
            <label className="consent-check"><input type="checkbox" checked={consentGiven} onChange={(event) => setConsentGiven(event.target.checked)} /><span>Give consent to share this result anonymously with the class.</span></label>
            <p>Participation is optional. You can skip any measurement, and the dashboard shows grouped totals only.</p>
          </div>
          <button className="submit-button" type="submit" disabled={submitting || !hasAnyValue || !consentGiven}><span>{submitting ? "Saving evidence…" : "Submit my evidence"}</span><Send size={17} /></button>
        </form>
        <div className="privacy-note"><ShieldCheck size={16} /><p><strong>Anonymous by design.</strong><br />The class sees grouped totals, never individual records.</p></div>
        <button className="teacher-trigger" type="button" onClick={() => setTeacherOpen((open) => !open)}><LockKeyhole size={14} /> Teacher controls</button>
        {teacherOpen && <div className="teacher-panel"><div className="teacher-panel-head"><span><LockKeyhole size={14} /> Teacher utility</span><button type="button" onClick={() => setTeacherOpen(false)}><X size={14} /></button></div><p>Enter the server teacher key to export raw rows or prepare a new class.</p><input type="password" value={teacherKey} onChange={(event) => setTeacherKey(event.target.value)} placeholder="Teacher key" /><div className="teacher-actions"><Button type="button" variant="outline" onClick={() => void exportCsv()}><Download size={14} /> Export CSV</Button><Button type="button" variant="outline" className="danger-button" onClick={() => void clearDatabase()}><Trash2 size={14} /> Clear database</Button></div><small>First-run default: variationlab. Set <code>TEACHER_KEY</code> to replace it.</small></div>}
      </aside>

      <section className="dashboard-stage">
        <header className="stage-header"><img className="pdf-header-image" src="/assets/pdf/header-collage.png" alt="Collage of people, measurements, leaves, seeds, and eyes from the lesson PDF" /><div className="pdf-title-overlay"><span>Biology / 18.1</span><h2>Continuous <i>and</i><br />Discontinuous <em>Variation</em></h2></div><div className="header-live-status"><span className={`live-dot ${live ? "is-live" : ""}`} />{live ? "Live class signal" : "Connecting to class signal"}</div></header>

        <div className="dashboard-content">
          <div className="dashboard-toolbar"><div><span className="section-kicker">02 / Class display</span><h2>Shared evidence board</h2></div><div className="sample-counter"><span className="counter-label"><Radio size={14} /> total sample size</span><strong>N = {snapshot.totalSampleSize}</strong><span className="counter-caption">anonymous submissions</span></div></div>
          <div className="lesson-strip"><div className="lesson-icon"><FlaskConical size={18} /></div><p><strong>Read the shape, not the person.</strong> The board gathers anonymous class observations and shows the pattern as it grows.</p><span className="updated-stamp">{snapshot.updatedAt ? `Updated ${new Date(snapshot.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Waiting for data"}</span></div>

          <div className="chart-section-heading"><span className="section-kicker">Investigations 1–8</span><span>Intervals and tallies update as the class grows</span></div>
          <div className="chart-grid chronological-grid">
            <ChartFrame number="01" title="Body mass" tag="HISTOGRAM / kg" image="/assets/pdf/investigations/investigation-6.png" emptyLabel={snapshot.histograms.bodyMass.values.length ? `${snapshot.histograms.bodyMass.values.length} measured values · bars touch` : "Enter body mass to start the interval"}><HistogramChart histogram={snapshot.histograms.bodyMass} /></ChartFrame>
            <ChartFrame number="02" title="Height" tag="HISTOGRAM / cm" image="/assets/pdf/investigations/investigation-1.png" emptyLabel={snapshot.histograms.height.values.length ? `${snapshot.histograms.height.values.length} measured values · bars touch` : "Enter height to start the interval"}><HistogramChart histogram={snapshot.histograms.height} /></ChartFrame>
            <ChartFrame number="03" title="Hand span" tag="HISTOGRAM / cm" image="/assets/pdf/investigations/investigation-4.png" emptyLabel={snapshot.histograms.handSpan.values.length ? `${snapshot.histograms.handSpan.values.length} measured values · bars touch` : "Enter hand span to start the interval"}><HistogramChart histogram={snapshot.histograms.handSpan} /></ChartFrame>
            <ChartFrame number="04" title="Tongue rolling" tag="BAR CHART / tally" image="/assets/pdf/investigations/investigation-5.png" emptyLabel="Separated bars keep categories distinct"><CategoryChart data={snapshot.categories.tongueRolling} color="#ea6f5d" /></ChartFrame>
            <ChartFrame number="05" title="Eye colour" tag="BAR CHART / tally" image="/assets/pdf/investigations/investigation-9.png" emptyLabel="Separated bars keep categories distinct"><CategoryChart data={snapshot.categories.eyeColour} color="#eaa35d" /></ChartFrame>
            <ChartFrame number="06" title="Blood group" tag="BAR CHART / simulated" image="/assets/pdf/investigations/investigation-2.png" emptyLabel="Simulated data only · separated bars"><CategoryChart data={snapshot.categories.bloodGroup} color="#b276d7" /></ChartFrame>
            <ChartFrame number="07" title="Leaf length" tag="HISTOGRAM / cm" image="/assets/pdf/investigations/investigation-7.png" emptyLabel={snapshot.histograms.leafLength.values.length ? `${snapshot.histograms.leafLength.values.length} leaves · bars touch` : "Add leaf rows to start the interval"}><HistogramChart histogram={snapshot.histograms.leafLength} /></ChartFrame>
            <ChartFrame number="08" title="Seed mass" tag="HISTOGRAM / g" image="/assets/pdf/investigations/investigation-8.png" emptyLabel={snapshot.histograms.seedMass.values.length ? `${snapshot.histograms.seedMass.values.length} measured values · bars touch` : "Enter seed mass to start the interval"}><HistogramChart histogram={snapshot.histograms.seedMass} /></ChartFrame>
          </div>
          <footer className="stage-footer"><div><Leaf size={15} /> Investigation 7 accepts multiple leaves per submission.</div><div>Consent first · body mass stays private · blood group is simulated.</div><div className="footer-mark">VL / 18.1</div></footer>
        </div>
      </section>
    </main>
  );
}
