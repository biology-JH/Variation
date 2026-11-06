// Student-facing print workbook for Variation Lab Live.
// Images are local copies of the website header and card pictures; no external images are fetched at runtime.
#import "report-theme.typ": report-accent, report-theme
#import "@preview/glossarium:0.5.10": make-glossary, register-glossary, print-glossary, gls
#show: make-glossary

#show: report-theme.with(
  title: "Variation Lab Live — Student Field Workbook (Traditional Chinese keywords)",
  author: "Variation Lab Live",
  rhythm: "report",
  body-size: 12pt,
  running-header: false,
)
#set heading(numbering: none)
#set par(justify: false, leading: 1.05em, spacing: 0.30em)

#let navy = rgb("#081026")
#let cobalt = rgb("#435fe1")
#let coral = rgb("#dc6859")
#let mint = rgb("#328f7f")
#let muted = rgb("#5b6680")
#let rule-color = rgb("#d5dcea")
#let pale-blue = rgb("#eef2ff")
#let pale-coral = rgb("#fff2ef")
#let pale-mint = rgb("#eaf6f2")
#let zh(term) = text(font: "Noto Sans CJK TC", size: 11.5pt, lang: "zh", region: "TW")[#term]
#let bilingual-terms = (
  (key: "variation", short: zh("變異"), long: "variation"),
  (key: "continuous-variation", short: zh("連續變異"), long: "continuous variation"),
  (key: "discontinuous-variation", short: zh("不連續變異"), long: "discontinuous variation"),
  (key: "measurement", short: zh("測量"), long: "measurement"),
  (key: "sample", short: zh("樣本"), long: "sample"),
  (key: "sample-size", short: zh("樣本數"), long: "sample size"),
  (key: "risk-assessment", short: zh("風險評估"), long: "risk assessment"),
  (key: "hazard", short: zh("危害"), long: "hazard"),
  (key: "control-measure", short: zh("控制措施"), long: "control measure"),
  (key: "safety", short: zh("安全"), long: "safety"),
  (key: "privacy", short: zh("隱私"), long: "privacy"),
  (key: "voluntary-participation", short: zh("自願參與"), long: "voluntary participation"),
  (key: "category", short: zh("類別"), long: "category"),
  (key: "tally", short: zh("劃記"), long: "tally"),
  (key: "frequency", short: zh("次數／頻數"), long: "frequency"),
  (key: "frequency-table", short: zh("次數表"), long: "frequency table"),
  (key: "histogram", short: zh("直方圖"), long: "histogram"),
  (key: "bar-chart", short: zh("長條圖"), long: "bar chart"),
  (key: "class-interval", short: zh("組距"), long: "class interval"),
  (key: "axes", short: zh("橫軸／縱軸"), long: "axes (horizontal and vertical)"),
)
#register-glossary(bilingual-terms)

// ---------- Front matter ----------
#page(numbering: none, header: none)[
  #set par(first-line-indent: 0em, justify: false)
  #align(center)[
    #text(size: 11.5pt, weight: "bold", fill: cobalt)[BIOLOGY / 18.1 · ENGLISH + TRADITIONAL CHINESE KEYWORDS]
    #v(3mm)
    #text(size: 30pt, weight: "bold", fill: navy)[Variation Lab]
    #linebreak()
    #text(size: 20pt, weight: "regular", fill: cobalt)[Continuous and discontinuous variation / 連續變異與不連續變異]
    #linebreak()
    #v(2mm)
    #text(size: 12pt, fill: muted)[Eight investigations for measuring, recording, plotting, and thinking carefully]
    #v(3mm)
    #image("images/website-header.png", width: 170mm)
    #v(2mm)
    #text(size: 11.5pt, weight: "bold", fill: muted)[Cover image / 封面圖片: Variation Lab Live website header / 網站頁首圖片.]
    #v(2mm)
    #text(size: 12pt, fill: navy)[A blank, print-ready workbook for offline classroom use.]
    #text(size: 11.5pt, fill: muted)[No name, student ID, or class code is needed. Participation is optional.]
  ]
]

#pagebreak()
#page(numbering: none, header: none)[
  #set par(first-line-indent: 0em)
  #text(size: 11.5pt, weight: "bold", fill: cobalt)[BEFORE YOU BEGIN / 開始之前]
  #v(3pt)
  #text(size: 22pt, weight: "bold", fill: navy)[One class. Many patterns. / 同一個班級，多種變異。]
  #v(5pt)
  #block(width: 100%, inset: 8pt, fill: pale-blue, stroke: (left: 2.5pt + cobalt), radius: 3pt)[
    #text(size: 11.5pt, weight: "bold", fill: cobalt)[OVERALL LEARNING OBJECTIVE / 整體學習目標] \
    By the end, I can measure or classify variation safely, record anonymous evidence, choose a suitable graph, plot group frequencies, and explain what the sample can and cannot show.
  ]
  #v(7pt)
  #grid(columns: (1fr, 1fr), column-gutter: 9pt,
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Keep participation safe and optional / 安全且自願參與]
      #v(3pt)
      #text(size: 11.5pt)[You may pass on any body measurement or category without giving a reason. A teacher-provided practice dataset is a complete alternative. Do not write names, student IDs, diagnoses, or other identifying details. Keep individual body measurements private; show only pooled class totals.]
      #v(4pt)
      #block(width: 100%, inset: 6pt, fill: pale-coral, stroke: (left: 2pt + coral), radius: 3pt)[
        #text(size: 11.5pt, weight: "bold", fill: coral)[INVESTIGATION 6 IS A SIMULATION ONLY / 調查 6 僅供模擬] \
        No real blood, needles, lancets, or bodily fluids. Never ask anyone to disclose a real blood group.
      ]
    ],
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Choose the graph that matches / 選擇合適的圖表]
      #v(3pt)
      #text(size: 11.5pt)[*Continuous measurements* sit on a numerical scale: use a histogram, choose equal-width intervals, and make the bars touch. *Categories* are separate groups: use a bar chart with gaps between bars. Label both axes and start the frequency scale at zero.]
      #v(4pt)
      #text(size: 11.5pt)[For leaves and seeds, use only teacher-approved materials, check school allergy rules, do not eat seeds, and wash hands after handling plant material.]
    ],
  )
  #v(7pt)
  #text(size: 11.5pt, weight: "bold", fill: navy)[Inside this workbook / 本冊內容]
  #v(3pt)
  #table(
    columns: (12mm, 1fr, 12mm, 1fr),
    inset: (x: 4pt, y: 2.2pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header([*No.*], [*Investigation / 調查*], [*No.*], [*Investigation / 調查*]),
    [01], [Body mass · kg / 體重 · 公斤], [02], [Height · cm / 身高 · 公分],
    [03], [Hand span · cm / 手掌跨度 · 公分], [04], [Tongue rolling / 舌頭捲曲],
    [05], [Eye colour / 眼睛顏色], [06], [Simulated blood group / 模擬血型],
    [07], [Leaf length · cm / 葉片長度 · 公分], [08], [Seed mass · g / 種子質量 · 公克],
  )
  #v(3pt)
  #print-glossary(bilingual-terms, show-all: true, invisible: true, disable-back-references: true)
  #text(size: 11.5pt, weight: "bold", fill: navy)[Keyword key / 關鍵詞表]
  #v(1pt)
  #grid(columns: (1fr, 1fr), column-gutter: 9pt,
    [
      #gls("variation") \
      #gls("continuous-variation") \
      #gls("discontinuous-variation") \
      #gls("measurement") \
      #gls("sample-size") \
      #gls("voluntary-participation") \
      #gls("privacy") \
      #gls("risk-assessment")
    ],
    [
      #gls("histogram") \
      #gls("bar-chart") \
      #gls("frequency") \
      #gls("class-interval") \
      #gls("hazard") \
      #gls("control-measure") \
      #gls("category") \
      #gls("axes")
    ],
  )
  #v(3pt)
  #text(size: 11.5pt, fill: muted)[The booklet is a blank template / 本冊為空白範本. It is not connected to the live dashboard and contains no class submissions.]
]

#counter(page).update(1)

// ---------- Reusable worksheet components ----------
#let objective-box(objective) = block(
  width: 100%,
  inset: 6pt,
  fill: pale-blue,
  stroke: (left: 2pt + cobalt),
  radius: 3pt,
)[
  #text(size: 11.5pt, weight: "bold", fill: cobalt)[LEARNING OBJECTIVE / 學習目標] \
  #text(size: 11.5pt)[#objective]
]

#let image-box(inv) = {
  block(width: 54mm, inset: 4pt, fill: white, stroke: 0.5pt + rule-color, radius: 3pt)[
    #align(center)[#image(inv.image, width: 46mm, height: 34mm, fit: "contain")]
    #v(3pt)
    #align(center)[#text(size: 11.5pt, weight: "bold", fill: muted)[#inv.image_caption]]
  ]
}

#let risk-row(hazard, control) = block(
  width: 100%,
  inset: (x: 4pt, y: 3pt),
  fill: pale-coral,
  stroke: (left: 1.5pt + coral),
  radius: 2pt,
)[
  #grid(columns: (26mm, 1fr), column-gutter: 4pt,
    [#text(size: 11.5pt, weight: "bold", fill: coral)[#hazard]],
    [#text(size: 11.5pt)[#control]],
  )
]

#let numbered-table(start, count, first-head, second-head) = {
  let rows = range(start, start + count).map(i => (
    [#text(size: 11.5pt, fill: muted)[#i]],
    box(width: 100%, height: 4.1mm)[ ]
  ))
  table(
    columns: (14mm, 1fr),
    inset: (x: 3pt, y: 0pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header(
      [#text(size: 11.5pt, weight: "bold")[#first-head]],
      [#text(size: 11.5pt, weight: "bold")[#second-head]],
    ),
    ..rows.flatten(),
  )
}

#let tally-table(labels) = {
  let rows = labels.map(label => (
    [#text(size: 11.5pt, weight: "bold")[#label]],
    box(width: 100%, height: 7.4mm)[ ],
    box(width: 100%, height: 7.4mm)[ ],
  ))
  table(
    columns: (1.2fr, 1.2fr, 20mm),
    inset: (x: 4pt, y: 2pt),
    stroke: 0.4pt + rule-color,
    fill: (x, y) => if y == 0 { pale-coral } else { white },
    table.header([*Category / 類別*], [*Tally marks / 劃記*], [*Count / 次數*]),
    ..rows.flatten(),
  )
}

#let blood-card-table() = {
  let rows = range(1, 13).map(i => (
    [#text(size: 11.5pt, weight: "bold")[F-#text(fill: muted)[#i]]],
    box(width: 100%, height: 5mm)[ ],
    box(width: 100%, height: 5mm)[ ],
    box(width: 100%, height: 5mm)[ ],
  ))
  table(
    columns: (18mm, 1fr, 1fr, 1fr),
    inset: (x: 3pt, y: 1pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-coral } else { white },
    table.header([*Card / 卡片*], [*Anti-A / 抗A*], [*Anti-B / 抗B*], [*ABO / 血型*]),
    ..rows.flatten(),
  )
}

#let frequency-table(rows, x-label) = {
  let cells = rows.map(row => (
    [#text(size: 11.5pt)[#row]],
    box(width: 100%, height: 6.3mm)[ ],
    box(width: 100%, height: 6.3mm)[ ],
  ))
  table(
    columns: (1.35fr, 1.1fr, 18mm),
    inset: (x: 3pt, y: 1.3pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header([#text(size: 11.5pt, weight: "bold")[#x-label]], [*Tally / 劃記*], [*n / 次數*]),
    ..cells.flatten(),
  )
}

#let method-page(inv) = [
  #grid(columns: (1fr, 54mm), column-gutter: 8pt,
    [
      #text(size: 11.5pt, weight: "bold", fill: cobalt)[INVESTIGATION #inv.number / METHOD + RECORD]
      #v(2pt)
      #text(size: 21pt, weight: "bold", fill: navy)[#inv.title]
      #text(size: 11.5pt, fill: muted)[#zh(inv.title_zh)]
      #v(4pt)
      #objective-box(inv.objective)
    ],
    [#image-box(inv)],
  )
  #v(5pt)
  #grid(columns: (1.08fr, 0.92fr), column-gutter: 8pt,
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Method / 方法]
      #v(2pt)
      #enum(numbering: "1.", ..inv.steps.map(step => [#text(size: 11.5pt)[#step]]))
    ],
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Risk assessment / 風險評估]
      #linebreak()
      #text(size: 11.5pt, fill: muted)[Hazard / 危害 → safe action / 安全措施]
      #v(2pt)
      #for risk in inv.risks {
        risk-row(risk.hazard, risk.control)
        v(2pt)
      }
    ],
  )
  #v(4pt)
  #text(size: 11.5pt, weight: "bold", fill: navy)[Record your data / 記錄資料]
  #linebreak()
  #text(size: 11.5pt, fill: muted)[#inv.data_note]
  #v(2pt)
  #if inv.record_type == "numeric" {
    grid(columns: (1fr, 1fr), column-gutter: 7pt,
      numbered-table(1, 20, inv.row_head, inv.unit),
      numbered-table(21, 20, inv.row_head, inv.unit),
    )
  } else if inv.record_type == "tally" {
    tally-table(inv.categories)
  } else {
    text(size: 11.5pt, fill: muted)[Simulation key / 模擬判讀: A = anti-A only · B = anti-B only · AB = both · O = neither. Write “clumps” or “no clumps” in the two reaction columns.]
    blood-card-table()
    v(2pt)
    tally-table(("A 型", "B 型", "AB 型", "O 型"))
  }
]

#let graph-page(inv) = [
  #text(size: 11.5pt, weight: "bold", fill: if inv.kind == "continuous" { cobalt } else { coral })[INVESTIGATION #inv.number / GRAPH + INTERPRETATION / 圖表與解讀]
  #v(2pt)
  #text(size: 20pt, weight: "bold", fill: navy)[#inv.title / #zh(inv.title_zh): plot the group pattern / 繪製群體分布]
  #v(3pt)
  #grid(columns: (1fr, 1fr), column-gutter: 8pt,
    [#text(size: 11.5pt)[*Graph type / 圖表類型:* #inv.graph_type #zh(inv.graph_type_zh) \ #inv.graph_hint]],
    [#text(size: 11.5pt)[*Title / 標題:* Distribution of] #line(length: 24mm, stroke: 0.45pt + rule-color)],
  )
  #text(size: 11.5pt, fill: muted)[Vertical axis / 縱軸: #inv.y_axis]
  #v(1pt)
  #align(center)[#image("images/plot-grid.svg", width: 170mm)]
  #text(size: 11.5pt, weight: "bold", fill: navy)[Horizontal axis / 橫軸: #inv.x_axis]
  #linebreak()
  #text(size: 11.5pt, fill: muted)[Use equal steps; begin the count scale at zero.]
  #v(4pt)
  #grid(columns: (1fr, 1fr), column-gutter: 9pt,
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Frequency table / 次數表]
      #v(2pt)
      #frequency-table(inv.graph_rows, inv.short_x_label)
    ],
    [
      #text(size: 11.5pt, weight: "bold", fill: navy)[Think about the evidence / 思考證據]
      #v(2pt)
      #enum(numbering: "1.", ..inv.questions.map(question => [#text(size: 11.5pt)[#question]]))
      #v(2pt)
      #block(width: 100%, inset: 4pt, fill: pale-mint, stroke: (left: 1.5pt + mint), radius: 2pt)[
        #text(size: 11.5pt)[*Check / 檢查:* Are the axes named and scaled? Do the bars touch for continuous values and have gaps for categories? Did you plot only anonymous group counts?]
      ]
    ],
  )
]

// ---------- Investigation content ----------
#let investigations = (
  (
    number: "01", title: "Body mass", title_zh: "體重", kind: "continuous", record_type: "numeric",
    row_head: "No.", unit: "Body mass / 體重 (kg / 公斤)",
    image: "images/site-investigation-01.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Measure body mass in kilograms (kg) and use anonymous, voluntary class data to describe its distribution with a histogram.",
    steps: (
      "Participation is optional; use a teacher dataset instead if you prefer.",
      "Set an approved scale on a level, non-slip floor in a private area.",
      "If you choose, measure only yourself and step on/off as directed.",
      "Record anonymous kilograms (20–300 kg); keep the value private. Never rank, name, or change a result.",

    ),
    risks: (
      (hazard: "Sensitive measure", control: "Make it optional and private; discuss pooled totals only."),
      (hazard: "Slip or trip", control: "Use a level, non-slip surface; clear the area and step carefully."),

    ),
    data_note: "Up to 40 anonymous readings · 20–300 kg. Row numbers are not people; report pooled intervals only.",
    graph_type: "Histogram · continuous measurement; bars touch.", graph_type_zh: "直方圖；連續測量，長條相接",
    graph_hint: "Choose equal-width mass intervals that cover the readings; show the pooled frequency, not individual people.",
    x_axis: "Body mass interval (kg) / 體重組距（公斤）", short_x_label: "Interval / 組距",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which mass interval has the greatest frequency?",
      "What does the shape or spread show about this voluntary sample?",
      "What can a class histogram not tell us about any one person?",
    ),
  ),
  (
    number: "02", title: "Height", title_zh: "身高", kind: "continuous", record_type: "numeric",
    row_head: "No.", unit: "Height / 身高 (cm / 公分)",
    image: "images/site-investigation-02.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Measure height in centimetres using a consistent, respectful method, then describe the distribution of volunteer measurements with a histogram.",
    steps: (
      "Taking part is optional. Do not comment on or compare anyone’s body.",
      "Secure a height measure on a level floor; keep the area clear. Never climb.",
      "Stand comfortably upright. Follow footwear directions only if comfortable; the participant may position the headpiece. Ask first; never touch.",
      "Read at eye level; record anonymous centimetres only (80–230 cm). Use the practice dataset if uncomfortable.",

    ),
    risks: (
      (hazard: "Unwanted contact", control: "Ask permission; let the participant position the headpiece; allow a pass."),
      (hazard: "Unstable equipment", control: "Secure it on level flooring; keep the area clear; never climb."),

    ),
    data_note: "Up to 40 anonymous readings · 80–230 cm. Row numbers are not people; keep values private.",
    graph_type: "Histogram · continuous measurement; bars touch.", graph_type_zh: "直方圖；連續測量，長條相接",
    graph_hint: "Choose equal-width height intervals and use one boundary rule consistently so every reading is counted once.",
    x_axis: "Height interval (cm) / 身高組距（公分）", short_x_label: "Interval / 組距",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which interval contains the most readings?",
      "What could make height measurements less consistent?",
      "How might voluntary participation limit this sample?",
    ),
  ),
  (
    number: "03", title: "Hand span", title_zh: "手掌跨度", kind: "continuous", record_type: "numeric",
    row_head: "No.", unit: "Hand span / 手掌跨度 (cm / 公分)",
    image: "images/site-investigation-03.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Measure hand span safely in centimetres and use anonymous class data to describe its distribution with a histogram.",
    steps: (
      "Participation is optional; use your own hand only.",
      "Rest it on a flat surface and spread your fingers comfortably.",
      "Measure thumb tip to little-finger tip in centimetres; do not force joints.",
      "Record anonymous 5–35 cm. Use 5 cm classes; include 35 in the final class.",

    ),
    risks: (
      (hazard: "Finger discomfort", control: "Stop if it hurts; spread only as far as comfortable."),
      (hazard: "Shared ruler", control: "Clean it between users; keep it away from the mouth."),

    ),
    data_note: "Up to 40 anonymous readings · 5–35 cm; use pooled totals only.",
    graph_type: "Histogram · continuous measurement; bars touch.", graph_type_zh: "直方圖；連續測量，長條相接",
    graph_hint: "Use the same-width 5 cm intervals shown in the frequency table; start the frequency scale at zero.",
    x_axis: "Hand span interval (cm) / 手掌跨度組距（公分）", short_x_label: "Interval / 組距",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("5–<10", "10–<15", "15–<20", "20–<25", "25–<30", "30–35"),
    questions: (
      "Which hand-span interval has the greatest frequency?",
      "Does the pattern look even, clustered, or spread out?",
      "What could affect accuracy or limit how representative this group is?",
    ),
  ),
  (
    number: "04", title: "Tongue rolling", title_zh: "舌頭捲曲", kind: "category", record_type: "tally",
    image: "images/site-investigation-04.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Record voluntary, anonymous self-reports of tongue-rolling ability and explain why a class pattern cannot establish genetic cause or destiny.",
    steps: (
      "Choose Can, Cannot, or pass; no explanation is needed.",
      "Self-report only; do not test, touch, or inspect anyone else.",
      "Tally anonymous Can/Cannot totals; a pass is not counted.",
      "Use separate bars. This is not a one-gene test and predicts no one’s genes.",

    ),
    risks: (
      (hazard: "Pressure or teasing", control: "Allow a quiet pass; never rank or single anyone out."),
      (hazard: "Unwanted contact", control: "No touching or shared objects; count anonymous totals only."),

    ),
    data_note: "Anonymous totals only; a pass is not counted.",
    categories: ("Can / 可以", "Cannot / 不可以"),
    graph_type: "Separated bar chart · categorical data; leave gaps.", graph_type_zh: "長條圖；類別資料，長條分開",
    graph_hint: "Draw one separate bar for Can and one for Cannot. A gap shows that the labels are distinct categories.",
    x_axis: "Self-reported category / 自我回報類別", short_x_label: "Category / 類別",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("Can / 可以", "Cannot / 不可以"),
    questions: (
      "Which category has the larger pooled count, or are they equal?",
      "Why can these totals not identify anyone’s genes?",
      "What limits how far this class pattern can be generalised?",
    ),
  ),
  (
    number: "05", title: "Eye colour", title_zh: "眼睛顏色", kind: "category", record_type: "tally",
    image: "images/site-investigation-05.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Classify voluntary eye-colour observations into the workbook’s categories and graph anonymous totals without making genetic or health conclusions.",
    steps: (
      "Choose self-report, brief self-observation, or pass.",
      "Use room light only; no flash. Skip if unsure or uncomfortable.",
      "Select Brown, Blue, Green, or Hazel; do not force a category.",
      "Tally anonymous totals only. Do not take photos or make health claims.",

    ),
    risks: (
      (hazard: "Bright light", control: "Use room light only; no flash or directed beam."),
      (hazard: "Privacy", control: "Self-report is fine; show pooled category totals only."),

    ),
    data_note: "Use Brown, Blue, Green, or Hazel; no photos or identifiers.",
    categories: ("Brown / 棕色", "Blue / 藍色", "Green / 綠色", "Hazel / 榛色"),
    graph_type: "Separated bar chart · categorical data; leave gaps.", graph_type_zh: "長條圖；類別資料，長條分開",
    graph_hint: "Use four distinct bars, one per category, with gaps. Start the count axis at zero and use equal steps.",
    x_axis: "Eye-colour category / 眼睛顏色類別", short_x_label: "Category / 類別",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("Brown / 棕色", "Blue / 藍色", "Green / 綠色", "Hazel / 榛色"),
    questions: (
      "Which eye-colour category has the largest pooled count?",
      "Why should the chart not be used as a health test?",
      "Why does a category tally not prove a simple genetic cause?",
    ),
  ),
  (
    number: "06", title: "Simulated blood group", title_zh: "模擬血型", kind: "category", record_type: "blood",
    image: "images/site-investigation-06.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Use fictional anti-A and anti-B reaction patterns to classify simulated cards as A, B, AB, or O, then graph the category counts.",
    steps: (
      "Use teacher-provided fictional cards only; no blood or sharps.",
      "For each card, record anti-A and anti-B as clumps/no clumps.",
      "Classify: A = anti-A only; B = anti-B only; AB = both; O = neither.",
      "Tally four groups. Label the chart SIMULATED; it is not a medical test.",

    ),
    risks: (
      (hazard: "Blood or sharps", control: "Simulation only; no real blood, lancets, or bodily fluids."),
      (hazard: "Medical disclosure", control: "Use fictional card codes; never request real results."),

    ),
    data_note: "Fictional cards only. No people, names, diagnoses, or real results.",
    graph_type: "Separated bar chart · simulated categories; leave gaps.", graph_type_zh: "長條圖；模擬類別，長條分開",
    graph_hint: "Use one separate bar for A, B, AB, and O, including a zero-count category. Mark the title as SIMULATED.",
    x_axis: "Simulated ABO category / 模擬 ABO 血型", short_x_label: "Category / 類別",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("A 型", "B 型", "AB 型", "O 型"),
    questions: (
      "Which simulated category has the greatest count?",
      "Do the four frequencies add to the number of fictional cards?",
      "Why can this classroom activity not diagnose or identify a real person?",
    ),
  ),
  (
    number: "07", title: "Leaf length", title_zh: "葉片長度", kind: "continuous", record_type: "numeric",
    row_head: "No.", unit: "Leaf length / 葉片長度 (cm / 公分)",
    image: "images/site-investigation-07.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Measure leaf lengths consistently and use a histogram to describe how a set of continuous measurements varies.",
    steps: (
      "Use a teacher-approved, known non-toxic species; otherwise use practice data.",
      "Measure along the blade’s longest central line from base to tip; exclude the stalk.",
      "Measure in place using one method and, if possible, one species. Do not pick plants.",
      "Record up to 40 leaves (0.5–60 cm); avoid your face and wash hands.",

    ),
    risks: (
      (hazard: "Plant irritants", control: "Use a known approved plant; do not touch uncertain species."),
      (hazard: "Plant damage/residue", control: "Measure in place; avoid the face and wash hands."),

    ),
    data_note: "Up to 40 leaves · 0.5–60 cm; same species/method; no identifiers.",
    graph_type: "Histogram · continuous measurement; bars touch.", graph_type_zh: "直方圖；連續測量，長條相接",
    graph_hint: "Choose equal-width length intervals that cover the leaves. Count each leaf once and make adjacent bars touch.",
    x_axis: "Leaf-length interval (cm) / 葉片長度組距（公分）", short_x_label: "Interval / 組距",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which interval contains the most leaves?",
      "What variation do you notice within the measured set?",
      "How could plant species, growth conditions, or measurement method affect the pattern?",
    ),
  ),
  (
    number: "08", title: "Seed mass", title_zh: "種子質量", kind: "continuous", record_type: "numeric",
    row_head: "No.", unit: "Seed mass / 種子質量 (g / 公克)",
    image: "images/site-investigation-08.png",
    image_caption: "Website image / 網站圖片: Variation Lab Live",
    objective: "Measure individual seed mass in grams and use a frequency histogram to describe variation in the sample.",
    steps: (
      "Use teacher-approved, untreated seeds under school allergy rules; otherwise use practice data.",
      "Tare a clean, dry boat if directed; weigh one seed at a time in grams.",
      "Record up to 40 values (0.001–10 g); check outliers, never alter them.",
      "Do not eat seeds or make dust; clean up as directed.",

    ),
    risks: (
      (hazard: "Allergy or treated seed", control: "Check school rules; use known approved untreated seeds only."),
      (hazard: "Dust or choking", control: "Do not eat; keep away from mouths; avoid dust and tidy."),

    ),
    data_note: "Up to 40 seeds · 0.001–10 g; consistent precision; no student details.",
    graph_type: "Histogram · continuous measurement; bars touch.", graph_type_zh: "直方圖；連續測量，長條相接",
    graph_hint: "Choose equal-width mass intervals that cover the seed readings. Count each seed once; adjacent bars touch.",
    x_axis: "Seed-mass interval (g) / 種子質量組距（公克）", short_x_label: "Interval / 組距",
    y_axis: "Frequency / 次數（頻數）",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which mass interval contains the most seeds?",
      "What does the histogram show about the spread of this sample?",
      "How could balance precision or seed choice affect the results?",
    ),
  ),
)

#for inv in investigations {
  pagebreak()
  method-page(inv)
  pagebreak()
  graph-page(inv)
}
