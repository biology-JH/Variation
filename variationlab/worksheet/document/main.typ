// Student-facing print workbook for Variation Lab Live.
// Images are local, web-sourced assets; the PDF has no runtime/network dependency.
#import "report-theme.typ": report-accent, report-theme

#show: report-theme.with(
  title: "Variation Lab Live — Student Field Workbook",
  author: "Variation Lab Live",
  rhythm: "report",
  body-size: 9.5pt,
  running-header: true,
)
#set heading(numbering: none)
#set par(justify: false, leading: 1.04em, spacing: 0.45em)

#let navy = rgb("#081026")
#let cobalt = rgb("#435fe1")
#let coral = rgb("#dc6859")
#let mint = rgb("#328f7f")
#let muted = rgb("#5b6680")
#let rule-color = rgb("#d5dcea")
#let pale-blue = rgb("#eef2ff")
#let pale-coral = rgb("#fff2ef")
#let pale-mint = rgb("#eaf6f2")

// ---------- Front matter ----------
#page(margin: (top: 27%, x: 1.8cm), numbering: none, header: none)[
  #set par(first-line-indent: 0em)
  #align(center)[
    #rect(width: 62mm, height: 1.4mm, fill: cobalt)
    #v(1.5cm)
    #text(size: 10pt, weight: "bold", fill: muted)[BIOLOGY / 18.1 · STUDENT FIELD NOTES]
    #v(1.1em)
    #text(size: 32pt, weight: "bold", fill: navy)[Variation Lab]
    #text(size: 21pt, weight: "regular", fill: cobalt)[Continuous and discontinuous variation]
    #v(1em)
    #text(size: 12pt, fill: muted)[Eight investigations for measuring, recording, plotting, and thinking carefully]
    #v(1.8cm)
    #grid(
      columns: (1fr, 1fr, 1fr, 1fr),
      column-gutter: 5pt,
      align(center)[#text(size: 9pt, weight: "bold", fill: cobalt)[01 · MEASURE]],
      align(center)[#text(size: 9pt, weight: "bold", fill: coral)[02 · NOTICE]],
      align(center)[#text(size: 9pt, weight: "bold", fill: cobalt)[03 · PLOT]],
      align(center)[#text(size: 9pt, weight: "bold", fill: mint)[04 · REFLECT]],
    )
    #v(1.3cm)
    #line(length: 56%, stroke: 0.7pt + rule-color)
    #v(1em)
    #text(size: 10pt, fill: muted)[A blank, print-ready workbook for offline classroom use.]
    #text(size: 9pt, fill: muted)[No name, student ID, class code, or online submission is needed in this booklet.]
  ]
]

#pagebreak()
#page(numbering: none, header: none)[
  #set par(first-line-indent: 0em)
  #text(size: 8pt, weight: "bold", fill: cobalt)[BEFORE YOU BEGIN]
  #v(3pt)
  #text(size: 22pt, weight: "bold", fill: navy)[One class. Many patterns.]
  #v(5pt)
  #block(width: 100%, inset: 8pt, fill: pale-blue, stroke: (left: 2.5pt + cobalt), radius: 3pt)[
    #text(size: 8pt, weight: "bold", fill: cobalt)[OVERALL LEARNING OBJECTIVE] \
    By the end, I can measure or classify variation safely, record anonymous evidence, choose a suitable graph, plot group frequencies, and explain what the sample can and cannot show.
  ]
  #v(7pt)
  #grid(columns: (1fr, 1fr), column-gutter: 9pt,
    [
      #text(size: 11pt, weight: "bold", fill: navy)[Keep participation safe and optional]
      #v(3pt)
      #text(size: 8.8pt)[You may pass on any body measurement or category without giving a reason. A teacher-provided practice dataset is a complete alternative. Do not write names, student IDs, diagnoses, or other identifying details. Keep individual body measurements private; show only pooled class totals.]
      #v(4pt)
      #block(width: 100%, inset: 6pt, fill: pale-coral, stroke: (left: 2pt + coral), radius: 3pt)[
        #text(size: 8.5pt, weight: "bold", fill: coral)[INVESTIGATION 6 IS A SIMULATION ONLY] \
        No real blood, needles, lancets, or bodily fluids. Never ask anyone to disclose a real blood group.
      ]
    ],
    [
      #text(size: 11pt, weight: "bold", fill: navy)[Choose the graph that matches]
      #v(3pt)
      #text(size: 8.8pt)[*Continuous measurements* sit on a numerical scale: use a histogram, choose equal-width intervals, and make the bars touch. *Categories* are separate groups: use a bar chart with gaps between bars. Label both axes and start the frequency scale at zero. #link("https://openstax.org/books/introductory-statistics-2e/pages/2-2-histograms-frequency-polygons-and-time-series-graphs")[Graphing reference [2].]]
      #v(4pt)
      #text(size: 8.8pt)[For leaves and seeds, use only teacher-approved materials, check school allergy rules, do not eat seeds, and wash hands after handling plant material.]
    ],
  )
  #v(7pt)
  #text(size: 11pt, weight: "bold", fill: navy)[Inside this workbook]
  #v(3pt)
  #table(
    columns: (11mm, 1fr, 24mm),
    inset: (x: 5pt, y: 3pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header([*No.*], [*Investigation*], [*Workbook pages*]),
    [01], [Body mass · kg], [01–02],
    [02], [Height · cm], [03–04],
    [03], [Hand span · cm], [05–06],
    [04], [Tongue rolling · Can/Cannot], [07–08],
    [05], [Eye colour · Brown/Blue/Green/Hazel], [09–10],
    [06], [Simulated blood group · A/B/AB/O], [11–12],
    [07], [Leaf length · cm], [13–14],
    [08], [Seed mass · g], [15–16],
  )
  #v(5pt)
  #text(size: 8pt, fill: muted)[The booklet is a blank template. It is not connected to the live dashboard and contains no class submissions.]
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
  #text(size: 7.4pt, weight: "bold", fill: cobalt)[LEARNING OBJECTIVE] \
  #text(size: 8.8pt)[#objective]
]

#let image-box(inv) = {
  let background = if inv.number == "06" { navy } else { white }
  block(width: 46mm, inset: 3pt, fill: background, stroke: 0.5pt + rule-color, radius: 3pt)[
    #align(center)[#image(inv.image, width: 40mm, fit: "contain")]
    #v(2pt)
    #text(size: 6.8pt, fill: if inv.number == "06" { white } else { muted })[#inv.image_caption]
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
    [#text(size: 7.2pt, weight: "bold", fill: coral)[#hazard]],
    [#text(size: 7.5pt)[#control]],
  )
]

#let numbered-table(start, count, first-head, second-head) = {
  let rows = range(start, start + count).map(i => (
    [#text(size: 7.2pt, fill: muted)[#i]],
    box(width: 100%, height: 3.5mm)[ ]
  ))
  table(
    columns: (11mm, 1fr),
    inset: (x: 3pt, y: 1pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header(
      [#text(size: 7.1pt, weight: "bold")[#first-head]],
      [#text(size: 7.1pt, weight: "bold")[#second-head]],
    ),
    ..rows.flatten(),
  )
}

#let tally-table(labels) = {
  let rows = labels.map(label => (
    [#text(size: 8.2pt, weight: "bold")[#label]],
    box(width: 100%, height: 7mm)[ ],
    box(width: 100%, height: 7mm)[ ],
  ))
  table(
    columns: (1.2fr, 1.2fr, 20mm),
    inset: (x: 4pt, y: 2pt),
    stroke: 0.4pt + rule-color,
    fill: (x, y) => if y == 0 { pale-coral } else { white },
    table.header([*Category*], [*Tally marks*], [*Count*]),
    ..rows.flatten(),
  )
}

#let blood-card-table() = {
  let rows = range(1, 13).map(i => (
    [#text(size: 7.5pt, weight: "bold")[F-#text(fill: muted)[#i]]],
    box(width: 100%, height: 4.3mm)[ ],
    box(width: 100%, height: 4.3mm)[ ],
    box(width: 100%, height: 4.3mm)[ ],
  ))
  table(
    columns: (18mm, 1fr, 1fr, 1fr),
    inset: (x: 3pt, y: 1pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-coral } else { white },
    table.header([*Fictional card*], [*Anti-A*], [*Anti-B*], [*ABO class*]),
    ..rows.flatten(),
  )
}

#let frequency-table(rows, x-label) = {
  let cells = rows.map(row => (
    [#text(size: 7.8pt)[#row]],
    box(width: 100%, height: 5.5mm)[ ],
    box(width: 100%, height: 5.5mm)[ ],
  ))
  table(
    columns: (1.35fr, 1.1fr, 18mm),
    inset: (x: 3pt, y: 1.3pt),
    stroke: 0.35pt + rule-color,
    fill: (x, y) => if y == 0 { pale-blue } else { white },
    table.header([#text(size: 7pt, weight: "bold")[#x-label]], [*Tally*], [*n*]),
    ..cells.flatten(),
  )
}

#let method-page(inv) = [
  #grid(columns: (1fr, 46mm), column-gutter: 8pt,
    [
      #text(size: 7.5pt, weight: "bold", fill: cobalt)[INVESTIGATION #inv.number / METHOD + RECORD]
      #v(2pt)
      #text(size: 19pt, weight: "bold", fill: navy)[#inv.title]
      #v(4pt)
      #objective-box(inv.objective)
    ],
    [#image-box(inv)],
  )
  #v(5pt)
  #grid(columns: (1.08fr, 0.92fr), column-gutter: 8pt,
    [
      #text(size: 10.5pt, weight: "bold", fill: navy)[Method]
      #v(2pt)
      #enum(numbering: "1.", ..inv.steps.map(step => [#text(size: 8.3pt)[#step]]))
    ],
    [
      #text(size: 10.5pt, weight: "bold", fill: navy)[Risk assessment]
      #text(size: 7.1pt, fill: muted)[Hazard → safe action]
      #v(2pt)
      #for risk in inv.risks {
        risk-row(risk.hazard, risk.control)
        v(2pt)
      }
      #text(size: 6.9pt, fill: muted)[Sources: #inv.reference_numbers]
    ],
  )
  #v(4pt)
  #text(size: 10.5pt, weight: "bold", fill: navy)[Record your data]
  #text(size: 7.6pt, fill: muted)[#inv.data_note]
  #v(2pt)
  #if inv.record_type == "numeric" {
    grid(columns: (1fr, 1fr), column-gutter: 7pt,
      numbered-table(1, 20, inv.row_head, inv.unit),
      numbered-table(21, 20, inv.row_head, inv.unit),
    )
  } else if inv.record_type == "tally" {
    tally-table(inv.categories)
  } else {
    text(size: 7.4pt, fill: muted)[Simulation key: A = anti-A only · B = anti-B only · AB = both · O = neither. Write “clumps” or “no clumps” in the two reaction columns.]
    blood-card-table()
    v(2pt)
    tally-table(("A", "B", "AB", "O"))
  }
]

#let graph-page(inv) = [
  #text(size: 7.5pt, weight: "bold", fill: if inv.kind == "continuous" { cobalt } else { coral })[INVESTIGATION #inv.number / GRAPH + INTERPRET]
  #v(2pt)
  #text(size: 18pt, weight: "bold", fill: navy)[#inv.title: plot the group pattern]
  #v(3pt)
  #grid(columns: (1fr, 1fr), column-gutter: 8pt,
    [#text(size: 8.4pt)[*Graph type:* #inv.graph_type \ #inv.graph_hint]],
    [#text(size: 8.2pt)[*Title:* Distribution of] #line(length: 24mm, stroke: 0.45pt + rule-color)],
  )
  #text(size: 7.5pt, fill: muted)[Vertical axis: #inv.y_axis]
  #v(1pt)
  #align(center)[#image("images/plot-grid.svg", width: 170mm)]
  #grid(columns: (1fr, 1fr), column-gutter: 8pt,
    [#text(size: 7.5pt, weight: "bold", fill: navy)[Horizontal axis: #inv.x_axis]],
    [#text(size: 7.3pt, fill: muted)[Use equal steps; begin the count scale at zero.]],
  )
  #v(4pt)
  #grid(columns: (1fr, 1fr), column-gutter: 9pt,
    [
      #text(size: 9.8pt, weight: "bold", fill: navy)[Frequency table]
      #v(2pt)
      #frequency-table(inv.graph_rows, inv.short_x_label)
    ],
    [
      #text(size: 9.8pt, weight: "bold", fill: navy)[Think about the evidence]
      #v(2pt)
      #enum(numbering: "1.", ..inv.questions.map(question => [#text(size: 7.8pt)[#question]]))
      #v(2pt)
      #block(width: 100%, inset: 4pt, fill: pale-mint, stroke: (left: 1.5pt + mint), radius: 2pt)[
        #text(size: 7.5pt)[*Check:* Are the axes named and scaled? Do the bars touch for continuous values and have gaps for categories? Did you plot only anonymous group counts?]
      ]
    ],
  )
]

// ---------- Investigation content ----------
#let investigations = (
  (
    number: "01", title: "Body mass", kind: "continuous", record_type: "numeric",
    row_head: "Reading no.*", unit: "Mass (kg)",
    image: "images/investigation-01-body-mass.jpg",
    image_caption: "Scale example · Pexels image credit at end.",
    objective: "Measure body mass in kilograms (kg) and use anonymous, voluntary class data to describe its distribution with a histogram. [1, 2]",
    steps: (
      "Taking part is optional. A teacher-provided practice dataset is a complete alternative; you do not need to explain a pass.",
      "The teacher places an approved scale on a firm, level, non-slip floor in a private place, out of sight and hearing of other students.",
      "If you choose to participate, measure only yourself, follow the scale instructions, and step on and off carefully.",
      "Read the displayed value in kg. Record only the number on an anonymous slip; do not say it aloud, show it, or write a name or ID.",
      "Use the anonymous readings to make equal-width intervals and pooled class totals. Never rank or identify contributors.",
      "The activity range is 20–300 kg. If a value falls outside it, do not change it to fit; use the practice data or ask the teacher privately.",
    ),
    risks: (
      (hazard: "Privacy or pressure", control: "Body mass can feel personal. Make participation optional, measure privately, and discuss pooled totals only."),
      (hazard: "Slip or trip", control: "Keep the scale on a level, non-slip surface; clear the area and step carefully."),
    ),
    reference_numbers: "[1], [2]",
    data_note: "Up to 40 anonymous readings · permitted range 20–300 kg. *A row number is not a person code; show pooled intervals only.",
    graph_type: "Histogram · continuous measurement; bars touch.",
    graph_hint: "Choose equal-width mass intervals that cover the readings; show the pooled frequency, not individual people.",
    x_axis: "Mass interval (kg)", short_x_label: "Mass interval (kg)",
    y_axis: "Frequency (anonymous readings)",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which mass interval has the greatest frequency?",
      "What does the shape or spread show about this voluntary sample?",
      "What can a class histogram not tell us about any one person?",
    ),
  ),
  (
    number: "02", title: "Height", kind: "continuous", record_type: "numeric",
    row_head: "Reading no.*", unit: "Height (cm)",
    image: "images/investigation-02-height.jpg",
    image_caption: "Stadiometer example · Wikimedia Commons.",
    objective: "Measure height in centimetres using a consistent, respectful method, then describe the distribution of volunteer measurements with a histogram. [3, 4]",
    steps: (
      "Taking part is optional. You may pass or stop at any time; measure privately and do not comment on or compare anyone’s body.",
      "Use a stable, securely fixed height measure on a level floor. Keep the area clear; never climb on furniture or equipment.",
      "If you choose to be measured, stand upright with feet flat and eyes forward. Follow the class footwear method only if comfortable; otherwise use the practice dataset so readings stay comparable.",
      "Ask permission before positioning a headpiece. The participant may position it themselves; do not touch anyone. Skip the measure if uncomfortable.",
      "Read at eye level and record centimetres only, without names or IDs. The activity range is 80–230 cm; check an unexpected value privately rather than changing it.",
    ),
    risks: (
      (hazard: "Pressure or unwanted contact", control: "Participation is optional; ask permission, let the participant position the headpiece, and do not touch."),
      (hazard: "Unstable equipment", control: "Secure the measure on a level floor; keep the area clear and never climb."),
    ),
    reference_numbers: "[3], [4], [2]",
    data_note: "Up to 40 anonymous readings · permitted range 80–230 cm. *A row number is not a person code; keep individual readings private.",
    graph_type: "Histogram · continuous measurement; bars touch.",
    graph_hint: "Choose equal-width height intervals and use one boundary rule consistently so every reading is counted once.",
    x_axis: "Height interval (cm)", short_x_label: "Height interval (cm)",
    y_axis: "Frequency (number of readings)",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which interval contains the most readings?",
      "What could make height measurements less consistent?",
      "How might voluntary participation limit this sample?",
    ),
  ),
  (
    number: "03", title: "Hand span", kind: "continuous", record_type: "numeric",
    row_head: "Reading no.*", unit: "Hand span (cm)",
    image: "images/investigation-03-hand-span.png",
    image_caption: "Span endpoints are thumb tip to little-finger tip · public domain.",
    objective: "Measure hand span safely in centimetres and use anonymous class data to describe its distribution with a histogram. [5, 2]",
    steps: (
      "Taking part is optional; you may skip measuring or sharing a value without giving a reason.",
      "Use your own hand. Rest it comfortably on a flat surface and spread the fingers only as far as feels comfortable.",
      "Measure from the tip of your thumb to the tip of your little finger in centimetres. Do not mark your skin or force a joint.",
      "Record one anonymous reading. The activity range is 5–35 cm; recheck an unexpected value rather than changing it to fit.",
      "Group the pooled readings into equal-width 5 cm intervals: 5–<10, 10–<15, 15–<20, 20–<25, 25–<30, and 30–35 cm (include 35 in the last group).",
    ),
    risks: (
      (hazard: "Finger discomfort", control: "Spread only as far as comfortable; stop if it hurts and skip if preferred."),
      (hazard: "Shared ruler", control: "Use a clean ruler, do not put it near the face or mouth, and clean it between users."),
    ),
    reference_numbers: "[5], [2]",
    data_note: "Up to 40 anonymous readings · permitted range 5–35 cm. *A row number is not a person code; use only pooled totals.",
    graph_type: "Histogram · continuous measurement; bars touch.",
    graph_hint: "Use the same-width 5 cm intervals shown in the frequency table; start the frequency scale at zero.",
    x_axis: "Hand span interval (cm)", short_x_label: "Hand span (cm)",
    y_axis: "Frequency (anonymous measurements)",
    graph_rows: ("5–<10", "10–<15", "15–<20", "20–<25", "25–<30", "30–35"),
    questions: (
      "Which hand-span interval has the greatest frequency?",
      "Does the pattern look even, clustered, or spread out?",
      "What could affect accuracy or limit how representative this group is?",
    ),
  ),
  (
    number: "04", title: "Tongue rolling", kind: "category", record_type: "tally",
    image: "images/investigation-04-tongue-rolling.jpg",
    image_caption: "Voluntary self-report only · Wikimedia Commons image credit at end.",
    objective: "Record voluntary, anonymous self-reports of tongue-rolling ability and explain why a class pattern cannot establish genetic cause or destiny. [6]",
    steps: (
      "Choose Can, Cannot, or pass. Participation is optional; no explanation is needed.",
      "Use your own self-report only. No one should inspect, test, or touch another person, and no objects are shared.",
      "Tally Can and Cannot responses as pooled class totals. A pass is not counted; do not record individual names or responses.",
      "Graph the two categories with separate bars. This classroom pattern is not a one-gene test and does not predict anyone’s genes or future.",
    ),
    risks: (
      (hazard: "Pressure or teasing", control: "Allow a quiet pass; use voluntary self-report only and never rank or single out a person."),
      (hazard: "Unwanted contact", control: "Do not touch, inspect, or share items. Count anonymous category totals only."),
    ),
    reference_numbers: "[6]",
    data_note: "Record anonymous class totals only. A pass is not included; never write who chose which category.",
    categories: ("Can", "Cannot"),
    graph_type: "Separated bar chart · categorical data; leave gaps.",
    graph_hint: "Draw one separate bar for Can and one for Cannot. A gap shows that the labels are distinct categories.",
    x_axis: "Self-reported category", short_x_label: "Category",
    y_axis: "Number of voluntary responses",
    graph_rows: ("Can", "Cannot"),
    questions: (
      "Which category has the larger pooled count, or are they equal?",
      "Why can these totals not identify anyone’s genes?",
      "What limits how far this class pattern can be generalised?",
    ),
  ),
  (
    number: "05", title: "Eye colour", kind: "category", record_type: "tally",
    image: "images/investigation-05-eye-colour.jpg",
    image_caption: "Human iris-colour range · public domain image credit at end.",
    objective: "Classify voluntary eye-colour observations into the workbook’s categories and graph anonymous totals without making genetic or health conclusions. [7]",
    steps: (
      "Choose to self-report or briefly observe your own eye colour; you may also pass without explanation.",
      "Use ordinary room light only. Never shine a phone flash or other bright light into anyone’s eyes; skip or self-report if observation is uncomfortable.",
      "Choose Brown, Blue, Green, or Hazel. If you are unsure, ask the teacher how to classify or leave it out; do not force a category.",
      "Tally anonymous group totals only. Do not take or collect eye photographs, names, student IDs, or individual comparisons.",
      "Use the four labels as categories. They describe this voluntary group; they are not a health test or a simple deterministic genetic result.",
    ),
    risks: (
      (hazard: "Bright light or eye strain", control: "Use ordinary room light; no flash or directed light. Keep observation brief and optional."),
      (hazard: "Disclosure or comparison", control: "Use self-report if preferred; collect only anonymous pooled category totals."),
    ),
    reference_numbers: "[7]",
    data_note: "Use only Brown, Blue, Green, and Hazel. Record voluntary anonymous totals; no photos or identifiers.",
    categories: ("Brown", "Blue", "Green", "Hazel"),
    graph_type: "Separated bar chart · categorical data; leave gaps.",
    graph_hint: "Use four distinct bars, one per category, with gaps. Start the count axis at zero and use equal steps.",
    x_axis: "Eye-colour category", short_x_label: "Category",
    y_axis: "Number of anonymous responses",
    graph_rows: ("Brown", "Blue", "Green", "Hazel"),
    questions: (
      "Which eye-colour category has the largest pooled count?",
      "Why should the chart not be used as a health test?",
      "Why does a category tally not prove a simple genetic cause?",
    ),
  ),
  (
    number: "06", title: "Simulated blood group", kind: "category", record_type: "blood",
    image: "images/investigation-06-abo-groups.png",
    image_caption: "ABO diagram · image on a dark ground for legibility; public domain.",
    objective: "Use fictional anti-A and anti-B reaction patterns to classify simulated cards as A, B, AB, or O, then graph the category counts. [8, 9]",
    steps: (
      "Use only teacher-provided fictional simulation cards or data. No blood, needles, lancets, bodily fluids, or real medical testing.",
      "For each fictional card, record the simulated anti-A and anti-B reaction as “clumps” or “no clumps.”",
      "Use the key: A = anti-A only; B = anti-B only; AB = both; O = neither. Classify the card, then tally each category.",
      "Plot the four pooled fictional-card totals as a separated bar chart. Label it SIMULATED and do not infer anyone’s real blood group or health.",
    ),
    risks: (
      (hazard: "Real blood or sharps", control: "Simulation only. Prohibit real blood, needles, lancets, and bodily fluids; follow the teacher’s card instructions."),
      (hazard: "Personal medical disclosure", control: "Use fictional card codes only. Never ask for, record, or compare anyone’s real blood group."),
    ),
    reference_numbers: "[8], [9]",
    data_note: "Fictional cards only · no people, names, diagnoses, or real blood-group results.",
    graph_type: "Separated bar chart · simulated categories; leave gaps.",
    graph_hint: "Use one separate bar for A, B, AB, and O, including a zero-count category. Mark the title as SIMULATED.",
    x_axis: "Simulated ABO category", short_x_label: "Simulated type",
    y_axis: "Number of fictional cards",
    graph_rows: ("A", "B", "AB", "O"),
    questions: (
      "Which simulated category has the greatest count?",
      "Do the four frequencies add to the number of fictional cards?",
      "Why can this classroom activity not diagnose or identify a real person?",
    ),
  ),
  (
    number: "07", title: "Leaf length", kind: "continuous", record_type: "numeric",
    row_head: "Leaf no.", unit: "Length (cm)",
    image: "images/investigation-07-leaf-morphology.png",
    image_caption: "Leaf-shape variation diagram · Wikimedia Commons image credit at end.",
    objective: "Measure leaf lengths consistently and use a histogram to describe how a set of continuous measurements varies. [10, 11, 2]",
    steps: (
      "Use only a teacher-approved, known non-toxic plant. If the species is uncertain or you prefer not to handle it, use an approved alternative dataset.",
      "Measure one leaf at a time along the blade’s longest central line, from the blade base to the tip; exclude the leaf stalk. Use centimetres consistently.",
      "Measure leaves in place. Do not pick, cut, or uproot plants; use the same method and, where possible, one species.",
      "Record up to 40 leaf lengths. The activity range is 0.5–60 cm; if a value seems outside it, recheck the method rather than altering the measurement.",
      "Avoid touching your face while working and wash hands with soap and water afterwards.",
    ),
    risks: (
      (hazard: "Irritant, poisonous, or allergenic plant", control: "Handle only a teacher-approved known species; do not touch an uncertain plant and use an alternative if needed."),
      (hazard: "Plant damage or residue", control: "Measure in place; do not remove leaves. Avoid the face and wash hands after the activity."),
    ),
    reference_numbers: "[10], [11], [2]",
    data_note: "Up to 40 leaves · each length 0.5–60 cm. Measure the same feature in the same unit; never add a student identifier.",
    graph_type: "Histogram · continuous measurement; bars touch.",
    graph_hint: "Choose equal-width length intervals that cover the leaves. Count each leaf once and make adjacent bars touch.",
    x_axis: "Leaf-length interval (cm)", short_x_label: "Leaf length (cm)",
    y_axis: "Number of leaves (frequency)",
    graph_rows: ("____________", "____________", "____________", "____________", "____________", "____________"),
    questions: (
      "Which interval contains the most leaves?",
      "What variation do you notice within the measured set?",
      "How could plant species, growth conditions, or measurement method affect the pattern?",
    ),
  ),
  (
    number: "08", title: "Seed mass", kind: "continuous", record_type: "numeric",
    row_head: "Seed no.", unit: "Mass (g)",
    image: "images/investigation-08-seed-mass.jpg",
    image_caption: "Seed-and-scale example · Pexels image depicts peanuts; check allergies.",
    objective: "Measure individual seed mass in grams and use a frequency histogram to describe variation in the sample. [12, 13, 14, 2]",
    steps: (
      "Use only teacher-provided, known seeds approved under school allergy procedures. Do not handle a seed if you prefer not to; use an alternative dataset.",
      "Use clean, dry, untreated seeds. Tare a weighing boat if directed; weigh one seed at a time and record the balance reading in grams to the displayed precision.",
      "Record up to 40 seeds. The activity range is 0.001–10 g; if a reading seems outside it, check the balance and ask the teacher—do not change it to fit.",
      "Keep seeds at the work area, do not eat them, avoid making dust, and follow the teacher’s clean-up directions.",
    ),
    risks: (
      (hazard: "Allergy or treated seed", control: "Check school allergy rules; use only teacher-approved known, untreated seeds. Do not handle or eat unknown seeds."),
      (hazard: "Dust or choking", control: "Avoid dust, keep seeds away from mouths, never eat them, and clean up promptly as directed."),
    ),
    reference_numbers: "[12], [13], [14], [2]",
    data_note: "Up to 40 seeds · each mass 0.001–10 g. Record one seed per row and keep precision consistent; do not add student details.",
    graph_type: "Histogram · continuous measurement; bars touch.",
    graph_hint: "Choose equal-width mass intervals that cover the seed readings. Count each seed once; adjacent bars touch.",
    x_axis: "Seed-mass interval (g)", short_x_label: "Seed mass (g)",
    y_axis: "Number of seeds (frequency)",
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

#pagebreak()
= References for safe and accurate work
#text(size: 8.5pt)[Method, safety, and graphing sources. Select each linked title for the full source page.]
#v(5pt)
#columns(2, gutter: 11pt)[
  #block(width: 100%)[*1 · School measurement privacy* \ #link("https://archive.cdc.gov/www_cdc_gov/healthyschools/obesity/bmi/bmi_measurement_schools.htm")[CDC, Body Mass Index (BMI) Measurement in Schools] \ #text(size: 7.2pt, fill: muted)[archive.cdc.gov · voluntary participation, privacy, pooled school data.]]
  #v(5pt)
  #block(width: 100%)[*2 · Histograms* \ #link("https://openstax.org/books/introductory-statistics-2e/pages/2-2-histograms-frequency-polygons-and-time-series-graphs")[OpenStax, Introductory Statistics 2e, §2.2] \ #text(size: 7.2pt, fill: muted)[openstax.org · continuous intervals, adjacent bars, frequency axes.]]
  #v(5pt)
  #block(width: 100%)[*3 · Height assessment* \ #link("https://www.ncbi.nlm.nih.gov/books/NBK551524/")[StatPearls, NCBI Bookshelf (NIH)] \ #text(size: 7.2pt, fill: muted)[ncbi.nlm.nih.gov · consistent standing height measurement.]]
  #v(5pt)
  #block(width: 100%)[*4 · Height procedure* \ #link("https://www.uhs.nhs.uk/Media/Southampton-Clinical-Research/Procedures/BRCProcedures/Procedure-for-adult-height.pdf")[NIHR Southampton Biomedical Research Centre, Procedure for Measuring Adult Height] \ #text(size: 7.2pt, fill: muted)[uhs.nhs.uk · posture and positioning.]]
  #v(5pt)
  #block(width: 100%)[*5 · Hand span* \ #link("https://tasks.illustrativemathematics.org/content-standards/tasks/1097")[Illustrative Mathematics, Hand span and height] \ #text(size: 7.2pt, fill: muted)[tasks.illustrativemathematics.org · thumb-tip to little-finger-tip endpoints.]]
  #v(5pt)
  #block(width: 100%)[*6 · Tongue-rolling myth* \ #link("https://udel.edu/~mcdonald/mythtongueroll.html")[John H. McDonald, University of Delaware, Tongue-rolling: the myth] \ #text(size: 7.2pt, fill: muted)[udel.edu · avoid simple one-gene conclusions.]]
  #v(5pt)
  #block(width: 100%)[*7 · Eye colour* \ #link("https://medlineplus.gov/genetics/understanding/traits/eyecolor/")[MedlinePlus Genetics, Is eye color determined by genetics?] \ #text(size: 7.2pt, fill: muted)[medlineplus.gov · complex trait; no health inference.]]
  #colbreak()
  #block(width: 100%)[*8 · Simulated blood-group activity* \ #link("https://educationalgames.nobelprize.org/educational/medicine/bloodtypinggame/")[Nobel Prize Outreach, The Blood Typing Game] \ #text(size: 7.2pt, fill: muted)[educationalgames.nobelprize.org · fictional anti-A/anti-B simulation.]]
  #v(5pt)
  #block(width: 100%)[*9 · ABO system* \ #link("https://www.ncbi.nlm.nih.gov/books/NBK2267/")[NCBI Bookshelf, Blood Groups and Red Cell Antigens, The ABO blood group] \ #text(size: 7.2pt, fill: muted)[ncbi.nlm.nih.gov · reaction-pattern key.]]
  #v(5pt)
  #block(width: 100%)[*10 · Leaves* \ #link("https://www.nwresd.org/services/outdoor-science-school/classroom-resources/leaves")[Northwest Regional Education Service District, Outdoor Science School] \ #text(size: 7.2pt, fill: muted)[nwresd.org · classroom leaf observation.]]
  #v(5pt)
  #block(width: 100%)[*11 · Plant safety* \ #link("https://www.cdc.gov/niosh/bulletin/2022/poisonous-plants.html")[CDC/NIOSH, Outdoor Workers and Poisonous Plant Exposures] \ #text(size: 7.2pt, fill: muted)[cdc.gov · avoid unknown or irritant plants.]]
  #v(5pt)
  #block(width: 100%)[*12 · Weighing materials* \ #link("https://serc.carleton.edu/sp/mnstep/activities/19334.html")[MnSTEP, Measuring and Comparing Matter] \ #text(size: 7.2pt, fill: muted)[serc.carleton.edu · weighing and recording mass.]]
  #v(5pt)
  #block(width: 100%)[*13 · Treated seed safety* \ #link("https://blog-crop-news.extension.umn.edu/2019/04/safe-handling-of-treated-seed.html")[University of Minnesota Extension, Safe Handling of Treated Seed] \ #text(size: 7.2pt, fill: muted)[umn.edu · avoid treated or dusty seed.]]
  #v(5pt)
  #block(width: 100%)[*14 · Small-object safety* \ #link("https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html")[CDC, Choking Hazards] \ #text(size: 7.2pt, fill: muted)[cdc.gov · keep small seeds away from mouths; never eat them.]]
]

#pagebreak()
= Web image credits and reuse notes
#text(size: 8.5pt)[Eight web-sourced pictures are bundled locally in the PDF. Images are illustrative only; they do not identify students, prove a medical result, or replace the safe method.]
#v(5pt)
#columns(2, gutter: 11pt)[
  #block(width: 100%)[*01 · Investigation 1 — Body mass* \ Pavel Danilyuk, “A Person Standing on a Weighing Scale,” Pexels. \ #link("https://www.pexels.com/photo/a-person-standing-on-a-weighing-scale-7801341/")[pexels.com/photo/a-person-standing-on-a-weighing-scale-7801341/] \ Pexels licence: free use; credit appreciated. #link("https://www.pexels.com/license/")[Licence.]]
  #v(5pt)
  #block(width: 100%)[*02 · Investigation 2 — Height* \ DrDK1967, “QuickMedical digital stadiometer.jpg,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:QuickMedical_digital_stadiometer.jpg")[commons.wikimedia.org/wiki/File:QuickMedical_digital_stadiometer.jpg] \ CC BY 3.0 Unported: credit creator, link licence, note scaling. #link("https://creativecommons.org/licenses/by/3.0/")[Licence.]]
  #v(5pt)
  #block(width: 100%)[*03 · Investigation 3 — Hand span* \ Unitfreak, “Hand Units of Measurement.PNG,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:Hand_Units_of_Measurement.PNG")[commons.wikimedia.org/wiki/File:Hand_Units_of_Measurement.PNG] \ Public-domain dedication; used as a complete image, scaled to fit.]
  #v(5pt)
  #block(width: 100%)[*04 · Investigation 4 — Tongue rolling* \ BigH22, “4x curling tongue.jpg,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:4x_curling_tongue.jpg")[commons.wikimedia.org/wiki/File:4x_curling_tongue.jpg] \ CC BY-SA 3.0 (also GFDL): credit creator, link licence; scaled, not cropped. #link("https://creativecommons.org/licenses/by-sa/3.0/")[Licence.]]
  #colbreak()
  #block(width: 100%)[*05 · Investigation 5 — Eye colour* \ LeuschteLampe, “Farbverlauf Augenfarben.jpg,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:Farbverlauf_Augenfarben.jpg")[commons.wikimedia.org/wiki/File:Farbverlauf_Augenfarben.jpg] \ Worldwide public-domain dedication; used as a complete image.]
  #v(5pt)
  #block(width: 100%)[*06 · Investigation 6 — Simulated blood group* \ InvictaHOG, “ABO blood type.svg,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:ABO_blood_type.svg")[commons.wikimedia.org/wiki/File:ABO_blood_type.svg] \ Worldwide public-domain dedication; rendered from transparent source art onto a dark panel.]
  #v(5pt)
  #block(width: 100%)[*07 · Investigation 7 — Leaf length* \ McSush, derivative of Debivort, “Leaf morphology.svg,” Wikimedia Commons. \ #link("https://commons.wikimedia.org/wiki/File:Leaf_morphology.svg")[commons.wikimedia.org/wiki/File:Leaf_morphology.svg] \ CC BY-SA 3.0 (also GFDL): credit both creators, link licence; scaled to fit. #link("https://creativecommons.org/licenses/by-sa/3.0/")[Licence.]]
  #v(5pt)
  #block(width: 100%)[*08 · Investigation 8 — Seed mass* \ vitalina, “Nuts near Old Weight Scale,” Pexels. \ #link("https://www.pexels.com/photo/nuts-near-old-weight-scale-12572535/")[pexels.com/photo/nuts-near-old-weight-scale-12572535/] \ Pexels licence: free use; credit appreciated. #link("https://www.pexels.com/license/")[Licence.] The image shows peanuts; the method requires teacher-approved seeds and allergy checks.]
]
#v(5pt)
#text(size: 7.5pt, fill: muted)[The plotting grid is an original vector made for this workbook. It is included with the locally bundled images and has no external runtime dependency.]
