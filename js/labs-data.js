/* =========================================================
   Labs — data model (seed / fallback)
   Auto-generated from labs.json. The live site fetches labs.json
   as the source of truth; this seed is only used for file:// preview
   and as an offline fallback. Edit labs.json (or the admin CMS), then
   regenerate this file to keep them in sync.
   ========================================================= */
window.LABS_SEED = {
  "meta": {
    "owner": "Sai Kiran Biswal",
    "role": "Enterprise · AI Product",
    "glyph": "SK",
    "eyebrow": "Product Portfolio · Two flagship case studies, then six labs",
    "title": "Two products, end to end. Six labs of how I work.",
    "intro": "Start with the two flagship case studies — each one taken from a painful workflow all the way to a working prototype, with the PRD, journey, metrics, and architecture in between. Then step into any of the six discipline labs to see how each layer gets built.",
    "statLabs": "6",
    "statLabsLabel": "Labs",
    "statProducts": "27",
    "statProductsLabel": "Products",
    "statYears": "7",
    "statYearsLabel": "Years"
  },
  "labs": [
    {
      "id": "ai-collections",
      "name": "AI Collections Cloud",
      "flagship": true,
      "desc": "An AI-native collections workspace — prioritize accounts, predict risk, recommend the next best action, and drive down DSO.",
      "blurb": "A complete PM case study, end to end. AI Collections Cloud turns fragmented AR data into next-best-action workflows — built from the painful workflow through the PRD, the journey, the metrics, the architecture, the tradeoffs, and a working prototype.",
      "products": [
        {
          "id": "collections-cloud",
          "name": "AI Collections Cloud",
          "stage": "Working prototype",
          "tags": [
            "AI",
            "Fintech",
            "Collections"
          ],
          "tagline": "An AI-powered collections workspace that prioritizes accounts, predicts risk, recommends the next best action, and drives down DSO.",
          "what": "Collections teams burn their day on decisions, not collecting. Who to call first, what to say, which account is about to slip, which dispute is silently blocking a payment, and what should happen next — every one of those is a judgment call made across a fragmented stack of ERP screens, spreadsheets, email threads, and call notes.\n\nThe bet: turn that fragmented AR data into next-best-action workflows. AI Collections Cloud reads the full account picture, scores risk with reasons, and tells the collector exactly what to do next — then drafts the email and logs the outcome.",
          "why": "Every extra day an invoice sits unpaid is working capital frozen. Slow, inconsistent collector decisions inflate DSO and let recoverable money age into bad debt. For the collector, the pain is decision fatigue — too many accounts, too little context, and no clear signal on where the next hour should go.",
          "users": [
            "Collections analyst",
            "AR manager",
            "Dispute analyst",
            "Finance ops leader"
          ],
          "mvp": [
            "Risk scoring",
            "Account summary",
            "Next-best-action",
            "Email draft",
            "Command-center dashboard"
          ],
          "features": [
            [
              "Account risk score",
              "Predicts delayed-payment risk per account and shows the reason codes behind every score."
            ],
            [
              "Next best action",
              "Recommends the single highest-leverage move — call, email, escalate, dispute follow-up, or promise-to-pay reminder."
            ],
            [
              "AI collector copilot",
              "Summarizes account history, drafts the outreach email, and suggests a negotiation tone."
            ],
            [
              "Dispute intelligence",
              "Detects root cause, groups similar disputes, and routes each to the right team."
            ],
            [
              "Collections command center",
              "Tracks DSO, aging, collector productivity, and recovery rate in one live view."
            ]
          ],
          "testing": "That a ranked queue plus an explicit next-best-action — not another dashboard — is what actually shortens collector decision time and lifts recovery rate.",
          "next": "Close the loop: let the copilot auto-log call outcomes, learn which recommendations convert to payment, and re-rank the queue from real results.",
          "role": "Product Lead",
          "year": "2025",
          "stage2": "Prototype · In testing",
          "stack": [
            "AI",
            "Fintech",
            "Collections"
          ],
          "url": "./apps/collections-cloud/",
          "artifacts": [
            {
              "kind": "prd",
              "label": "PRD",
              "tags": [
                "Product",
                "Founder"
              ],
              "goal": "Reduce collector decision time and improve recovery rate.",
              "users": [
                "Collections analyst",
                "AR manager",
                "Dispute analyst",
                "Finance ops leader"
              ],
              "mvp": [
                "Risk scoring",
                "Account summary",
                "Next-best-action",
                "Email draft",
                "Dashboard"
              ],
              "nongoals": [
                "Full ERP replacement",
                "Autonomous payment negotiation",
                "Custom workflows for every client"
              ]
            },
            {
              "kind": "flow",
              "label": "User Flow",
              "tags": [
                "Product"
              ],
              "steps": [
                "Collector logs in",
                "Sees the prioritized account list",
                "Opens a risky account",
                "AI summarizes the history",
                "AI recommends the next action",
                "Collector sends email / logs the call",
                "Promise-to-pay or dispute is created",
                "Manager sees the impact dashboard"
              ]
            },
            {
              "kind": "metrics",
              "label": "Metrics Tree",
              "tags": [
                "Analytics"
              ],
              "business": "Reduce DSO",
              "drivers": [
                "Faster collector action",
                "Better prioritization",
                "Fewer unresolved disputes",
                "Higher promise-to-pay conversion"
              ],
              "product": [
                "% of accounts where the AI recommendation was used",
                "Time to first action",
                "Email acceptance rate",
                "Dispute resolution time",
                "Recovery rate"
              ]
            },
            {
              "kind": "workflow",
              "label": "Workflow Diagram",
              "tags": [
                "Architecture"
              ],
              "steps": [
                "Invoice aging",
                "Risk scoring",
                "Account prioritization",
                "AI recommendation",
                "Collector action",
                "Payment / dispute / escalation",
                "Dashboard feedback loop"
              ]
            },
            {
              "kind": "beforeafter",
              "label": "Before / After",
              "tags": [
                "Product",
                "Data"
              ],
              "before": "Collectors manually stitch together ERP screens, email threads, call notes, and dispute logs to decide who to chase and how.",
              "after": "AI surfaces risk, history, the recommended action, and the draft outreach in one workspace — the collector just acts."
            },
            {
              "kind": "screens",
              "label": "Prototype / Screens",
              "tags": [
                "Product",
                "AI"
              ],
              "items": [
                {
                  "name": "Collections command center"
                },
                {
                  "name": "Prioritized account queue"
                },
                {
                  "name": "Account risk detail"
                },
                {
                  "name": "AI recommendation panel"
                },
                {
                  "name": "Dispute intelligence view"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "los",
      "name": "LOS — Loan Origination System",
      "flagship": true,
      "desc": "A guided, state-based loan-origination platform — lift completion, speed up KYC and decisioning, and shorten approval turnaround.",
      "blurb": "A complete PM case study, end to end. LOS moves a borrower from application to approval with fewer handoffs — built from the painful workflow through the PRD, the journey, the metrics, the state machine, the tradeoffs, and a working prototype.",
      "products": [
        {
          "id": "lending-os",
          "name": "LOS — Loan Origination System",
          "stage": "Working prototype",
          "tags": [
            "Fintech",
            "Lending",
            "SaaS"
          ],
          "tagline": "A digital loan-origination platform that lifts application completion, speeds up KYC and credit decisioning, and shortens approval turnaround.",
          "what": "Loan journeys are slow for the same reasons everywhere: long forms, the same documents uploaded twice, manual KYC, no visibility into status, and credit decisions that disappear into a queue.\n\nThe bet: a guided, state-based LOS that moves a borrower from application to approval with fewer handoffs. Every applicant always knows their current state and the single next step; every bank team works from one shared workflow instead of chasing paper.",
          "why": "Drop-off is the silent killer of loan volume — borrowers abandon long, opaque journeys, and approved-but-slow applications lose to faster competitors. Internally, manual KYC and document chasing eat the team's capacity and stretch approval TAT.",
          "users": [
            "Borrower",
            "Loan officer",
            "Credit analyst",
            "Operations team"
          ],
          "mvp": [
            "Application form",
            "Document upload",
            "KYC state",
            "Credit decision state",
            "Application tracker"
          ],
          "features": [
            [
              "Smart application form",
              "Dynamic fields that save progress and cut repeated data entry."
            ],
            [
              "KYC / document upload",
              "Upload, validate, and retry — with missing documents always shown."
            ],
            [
              "Eligibility engine",
              "Basic product-fit rules with a soft decline and a next-best offer."
            ],
            [
              "Credit decision workflow",
              "Clear state transitions — pending, approved, referred, rejected."
            ],
            [
              "Application tracker",
              "The borrower always sees the current status and the next step."
            ]
          ],
          "testing": "That making state and the next step explicit at every stage is what reduces drop-off and shortens approval TAT — more than any single faster step.",
          "next": "Layer in lightweight decisioning assists — document auto-extraction and rule-based pre-checks — to cut KYC retries and analyst back-and-forth.",
          "role": "Product Lead",
          "year": "2025",
          "stage2": "Prototype · In testing",
          "stack": [
            "Fintech",
            "Lending",
            "SaaS"
          ],
          "url": "./apps/lending-cloud/",
          "artifacts": [
            {
              "kind": "prd",
              "label": "PRD",
              "tags": [
                "Product",
                "Founder"
              ],
              "goal": "Increase completed loan applications and reduce approval turnaround time.",
              "users": [
                "Borrower",
                "Loan officer",
                "Credit analyst",
                "Operations team"
              ],
              "mvp": [
                "Application form",
                "Document upload",
                "KYC state",
                "Credit decision state",
                "Application tracker"
              ],
              "nongoals": [
                "Full core-banking replacement",
                "Complex AI underwriting",
                "Multi-country compliance engine"
              ]
            },
            {
              "kind": "flow",
              "label": "User Flow",
              "tags": [
                "Product"
              ],
              "steps": [
                "User starts the application",
                "Selects a loan product",
                "Fills the smart form",
                "Uploads documents",
                "KYC check starts",
                "Eligibility check runs",
                "Credit analyst reviews",
                "Approved / referred / rejected",
                "Disbursement handoff begins"
              ]
            },
            {
              "kind": "metrics",
              "label": "Metrics Tree",
              "tags": [
                "Analytics"
              ],
              "business": "Increase approved loan volume",
              "drivers": [
                "Higher application completion",
                "Faster KYC",
                "Faster credit decision",
                "Lower drop-off"
              ],
              "product": [
                "Application completion rate",
                "Time to submit",
                "KYC retry rate",
                "Approval TAT",
                "Drop-off by step"
              ]
            },
            {
              "kind": "workflow",
              "label": "Workflow Diagram",
              "tags": [
                "Architecture"
              ],
              "steps": [
                "Lead created",
                "Application started",
                "Docs submitted",
                "KYC pending",
                "KYC passed",
                "Credit review",
                "Approved / rejected / referred",
                "Offer accepted",
                "Disbursement"
              ]
            },
            {
              "kind": "beforeafter",
              "label": "Before / After",
              "tags": [
                "Product",
                "Data"
              ],
              "before": "The borrower submits forms and waits blindly while bank teams chase documents and KYC by hand.",
              "after": "The borrower sees status, missing items, and the next step; bank teams work one shared workflow end to end."
            },
            {
              "kind": "screens",
              "label": "Prototype / Screens",
              "tags": [
                "Product",
                "Architecture"
              ],
              "items": [
                {
                  "name": "Loan product selection"
                },
                {
                  "name": "Smart application form"
                },
                {
                  "name": "Document upload / KYC"
                },
                {
                  "name": "Application status tracker"
                },
                {
                  "name": "Credit analyst review queue"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "founder",
      "name": "Founder Lab",
      "desc": "Zero-to-one bets — the ventures, pitches, and operating systems built before there was a product to manage.",
      "blurb": "Where ideas become companies. Founder Lab holds the early-stage ventures, the napkin-to-narrative pitches, and the operating frameworks used to take a bet from conviction to a fundable, buildable plan.",
      "products": [
        {
          "id": "northwind",
          "name": "Northwind",
          "stage": "Seed venture",
          "tags": [
            "Venture",
            "Fintech"
          ],
          "tagline": "An operating system for lenders who want to launch a credit product in weeks, not quarters.",
          "what": "Northwind started as a thesis: most lenders don't have a technology problem, they have a launch problem. The product packages origination, decisioning, and servicing into a single configurable rail so a new credit product can go from board approval to first disbursal in under 60 days.\n\nFounder Lab is where the bet was framed — the market sizing, the wedge, the first ten design partners, and the narrative that turned a deck into a seed round.",
          "features": [
            [
              "Market wedge",
              "Underserved mid-market lenders ignored by core-banking incumbents."
            ],
            [
              "First-customer motion",
              "Ten hand-picked design partners co-building the v1."
            ],
            [
              "The narrative",
              "A single story that ran from cold intro to term sheet."
            ]
          ],
          "role": "Founder & Product",
          "year": "2024",
          "stage2": "Seed · Raising",
          "stack": [
            "Strategy",
            "GTM",
            "Fundraising"
          ],
          "url": "https://example.com/northwind"
        },
        {
          "id": "atlas",
          "name": "Atlas Collective",
          "stage": "Operating co",
          "tags": [
            "Studio",
            "B2B"
          ],
          "tagline": "A venture studio model for spinning enterprise tools out of repeatable internal playbooks.",
          "what": "Atlas Collective is the framework for turning hard-won internal playbooks into standalone products. Rather than one big bet, it's a portfolio motion: identify a repeatable operational pain, productize the fix, and spin it out with its own P&L.\n\nThis lab captures the operating cadence — how bets are sourced, staffed, killed, or doubled-down on.",
          "features": [
            [
              "Sourcing engine",
              "A scored pipeline of operational pains worth productizing."
            ],
            [
              "Stage gates",
              "Clear kill/continue criteria at each funding step."
            ],
            [
              "Shared spine",
              "Common identity, billing, and data layer across spin-outs."
            ]
          ],
          "role": "Founding Operator",
          "year": "2023",
          "stage2": "Operating",
          "stack": [
            "Portfolio",
            "Ops",
            "Finance"
          ],
          "url": "https://example.com/atlas"
        },
        {
          "id": "ironwood",
          "name": "Ironwood",
          "stage": "Prototype",
          "tags": [
            "Concept",
            "Climate"
          ],
          "tagline": "A carbon-accounting layer for supply chains that treats emissions as a first-class ledger.",
          "what": "Ironwood is an early concept exploring what supply-chain carbon accounting looks like if you build it like a financial ledger — double-entry, auditable, and reconciled, rather than a once-a-year spreadsheet estimate.\n\nFounder Lab holds the problem framing, the regulatory read, and the prototype used to test appetite with three enterprise buyers.",
          "features": [
            [
              "Ledger model",
              "Every emission is a posted, reconcilable entry."
            ],
            [
              "Audit trail",
              "Defensible numbers for regulators and buyers alike."
            ],
            [
              "Buyer signal",
              "Three enterprise interviews validating willingness to pay."
            ]
          ],
          "role": "Founder & Product",
          "year": "2025",
          "stage2": "Concept",
          "stack": [
            "Discovery",
            "Prototype",
            "Policy"
          ],
          "url": "https://example.com/ironwood"
        }
      ]
    },
    {
      "id": "analytics",
      "name": "Analytics Lab",
      "desc": "Decisions made legible — metric trees, dashboards, and the measurement systems that tell a business the truth.",
      "blurb": "Numbers that earn trust. Analytics Lab is where raw events become metric trees, experiments, and dashboards a leadership team can actually steer with — measurement designed to change decisions, not just decorate slides.",
      "products": [
        {
          "id": "pulse",
          "name": "Pulse",
          "stage": "Shipped",
          "tags": [
            "Dashboard",
            "SaaS"
          ],
          "tagline": "An executive cockpit that turns a sprawl of product events into three numbers that matter.",
          "what": "Pulse is a decision dashboard, not a data dump. It collapses hundreds of tracked events into a tight metric tree, surfaces the two or three movements that actually changed the business this week, and explains why.\n\nAnalytics Lab is where the metric model was designed — the north star, its inputs, and the guardrails that stop teams from gaming a single number.",
          "features": [
            [
              "Metric tree",
              "A north star decomposed into inputs teams can own."
            ],
            [
              "Weekly movers",
              "Automatic surfacing of what changed and why."
            ],
            [
              "Guardrails",
              "Counter-metrics that keep optimization honest."
            ]
          ],
          "role": "Lead PM",
          "year": "2023",
          "stage2": "Live · v3",
          "stack": [
            "Metrics",
            "BI",
            "Looker"
          ],
          "url": "https://example.com/pulse"
        },
        {
          "id": "cohort",
          "name": "Cohort",
          "stage": "Shipped",
          "tags": [
            "Retention",
            "Growth"
          ],
          "tagline": "Retention analysis that finally answers 'which users come back, and what made them.'",
          "what": "Cohort makes retention investigable. Instead of a flat curve, it lets a team slice survival by acquisition source, first-week behavior, and feature adoption — then quantifies which early actions actually predict long-term return.\n\nThis lab covers the analytical framing and the experiment design behind every claim.",
          "features": [
            [
              "Behavioral cohorts",
              "Group users by what they did, not just when they joined."
            ],
            [
              "Activation signals",
              "The early actions that predict retention."
            ],
            [
              "Experiment-ready",
              "Every insight ships with a testable hypothesis."
            ]
          ],
          "role": "Lead PM",
          "year": "2022",
          "stage2": "Live",
          "stack": [
            "SQL",
            "Stats",
            "dbt"
          ],
          "url": "https://example.com/cohort"
        },
        {
          "id": "signal",
          "name": "Signal",
          "stage": "Beta",
          "tags": [
            "Alerting",
            "Ops"
          ],
          "tagline": "Anomaly detection for business metrics that pages a human only when it's worth it.",
          "what": "Signal watches the metric tree and learns each line's normal rhythm, so it can tell a genuine anomaly from ordinary noise. When something real breaks, it routes a concise, contextual alert to the right owner — and stays quiet otherwise.\n\nAnalytics Lab holds the detection model and the false-positive tuning that makes the alerts trusted.",
          "features": [
            [
              "Seasonality-aware",
              "Knows the difference between a dip and a Tuesday."
            ],
            [
              "Owner routing",
              "The right person, with context, not a firehose."
            ],
            [
              "Trust tuning",
              "Aggressive false-positive suppression by design."
            ]
          ],
          "role": "Lead PM",
          "year": "2025",
          "stage2": "Private beta",
          "stack": [
            "ML",
            "Time-series",
            "Slack"
          ],
          "url": "https://example.com/signal"
        },
        {
          "id": "dashboard-studio",
          "name": "Dashboard Studio",
          "stage": "Working app",
          "tags": [
            "Data",
            "Visualization"
          ],
          "tagline": "A drag-and-drop dashboard builder — KPI cards, charts, data profiling, theming, and export, with data that never leaves the browser.",
          "what": "A drag-and-drop dashboard builder — KPI cards, charts, data profiling, theming, and export, with data that never leaves the browser.",
          "features": [
            [
              "Drag-and-drop",
              "KPI cards and charts assembled visually."
            ],
            [
              "Data profiling",
              "Understand a dataset before you chart it."
            ],
            [
              "Private by default",
              "Data never leaves the browser."
            ]
          ],
          "role": "Product Manager",
          "year": "2025",
          "stage2": "Working app",
          "stack": [
            "Data",
            "Visualization",
            "Tools"
          ],
          "url": "./apps/dashboard-studio/"
        }
      ]
    },
    {
      "id": "ai",
      "name": "AI Lab",
      "desc": "AI-native products done honestly — copilots, RAG, evals, and guardrails with a cost model that survives contact.",
      "blurb": "AI that ships and holds up. AI Lab is where use-cases get framed, retrieval gets designed, and outputs get evaluated — copilots and agents built with guardrails, eval harnesses, and an honest unit-economics model from day one.",
      "products": [
        {
          "id": "mirror",
          "name": "Mirror",
          "stage": "Shipped",
          "tags": [
            "Copilot",
            "Enterprise"
          ],
          "tagline": "A collector copilot that drafts the next conversation and explains exactly why.",
          "what": "Mirror sits beside a recovery agent and proposes the next-best action — what to say, which offer to extend, when to call — grounded in the account's real history. Crucially, every suggestion carries its reasoning, so a human stays accountable.\n\nAI Lab covers the retrieval design, the eval harness that scores suggestions, and the guardrails that keep it inside policy.",
          "features": [
            [
              "Grounded suggestions",
              "Every recommendation cites the account facts behind it."
            ],
            [
              "Eval harness",
              "Suggestions scored against expert-labeled outcomes."
            ],
            [
              "Policy guardrails",
              "Hard limits the model cannot talk its way around."
            ]
          ],
          "role": "Lead AI PM",
          "year": "2024",
          "stage2": "Live · Enterprise",
          "stack": [
            "RAG",
            "LLM",
            "Evals"
          ],
          "url": "https://example.com/mirror"
        },
        {
          "id": "synthesis",
          "name": "Synthesis",
          "stage": "Shipped",
          "tags": [
            "Docs",
            "RAG"
          ],
          "tagline": "Document understanding that reads a 200-page contract and answers like an analyst.",
          "what": "Synthesis ingests dense enterprise documents — contracts, policies, filings — and lets a user interrogate them in plain language, with answers anchored to the exact clause. It's built to refuse confidently when the document doesn't say.\n\nThis lab holds the chunking strategy, the citation model, and the abstention behavior that makes it trustworthy.",
          "features": [
            [
              "Clause-level citations",
              "Answers point back to the source paragraph."
            ],
            [
              "Confident refusal",
              "Says 'not in the document' instead of hallucinating."
            ],
            [
              "Long-context retrieval",
              "Handles 200-page documents without losing the thread."
            ]
          ],
          "role": "Lead AI PM",
          "year": "2023",
          "stage2": "Live",
          "stack": [
            "RAG",
            "Embeddings",
            "Eval"
          ],
          "url": "https://example.com/synthesis"
        },
        {
          "id": "oracle",
          "name": "Oracle",
          "stage": "Research",
          "tags": [
            "Agents",
            "Workflow"
          ],
          "tagline": "An agentic workflow runner for back-office operations that asks before it acts.",
          "what": "Oracle is an exploration into safe agentic automation for operational workflows — reconciliations, exception handling, data fixes. The design principle is human-in-the-loop by default: the agent plans, shows its work, and asks for approval at each consequential step.\n\nAI Lab holds the planning model, the approval UX, and the rollback design.",
          "features": [
            [
              "Plan-then-act",
              "The agent proposes a full plan before touching anything."
            ],
            [
              "Approval gates",
              "Humans sign off on every consequential step."
            ],
            [
              "Reversible",
              "Every action has a defined, tested rollback."
            ]
          ],
          "role": "AI PM",
          "year": "2025",
          "stage2": "Research",
          "stack": [
            "Agents",
            "Tools",
            "HITL"
          ],
          "url": "https://example.com/oracle"
        },
        {
          "id": "collections-cloud",
          "name": "AI Collections Cloud",
          "stage": "Flagship",
          "tags": [
            "AI",
            "Fintech"
          ],
          "tagline": "An AI-native recovery platform for lenders — collector copilot, recovery prediction, and next-best-action over a clean domain, data, and event architecture.",
          "what": "An AI-native recovery platform for lenders — collector copilot, recovery prediction, and next-best-action over a clean domain, data, and event architecture.",
          "features": [
            [
              "Collector copilot",
              "Drafts the next-best action with the reasoning behind it."
            ],
            [
              "Recovery prediction",
              "Scores accounts so effort lands where it pays."
            ],
            [
              "Clean event spine",
              "Domain, data, and events designed to build on."
            ]
          ],
          "role": "Product Manager",
          "year": "2024–2025",
          "stage2": "Flagship · Live",
          "stack": [
            "AI",
            "Fintech",
            "Collections"
          ],
          "url": "./apps/collections-cloud/"
        },
        {
          "id": "synthesis",
          "name": "Synthesis — Strategic Framework Engine",
          "stage": "Working app",
          "tags": [
            "Strategy",
            "Tools"
          ],
          "tagline": "An offline strategic-framework builder: import data, configure the analysis, and export to PDF, Markdown, CSV, or JSON — entirely in-browser.",
          "what": "An offline strategic-framework builder: import data, configure the analysis, and export to PDF, Markdown, CSV, or JSON — entirely in-browser.",
          "features": [
            [
              "Framework engine",
              "Configure an analysis, not just a template."
            ],
            [
              "Offline by design",
              "Data never leaves the browser."
            ],
            [
              "Multi-format export",
              "PDF, Markdown, CSV, or JSON in one click."
            ]
          ],
          "role": "Product Manager",
          "year": "2025",
          "stage2": "Working app",
          "stack": [
            "Strategy",
            "Tools",
            "AI"
          ],
          "url": "./apps/synthesis/"
        },
        {
          "id": "neuralpath",
          "name": "NeuralPath — AI Concepts Game",
          "stage": "Working app",
          "tags": [
            "AI",
            "Education"
          ],
          "tagline": "A gamified AI-learning app — concepts, quizzes, XP, streaks, and orchestration flows that teach AI one level at a time.",
          "what": "A gamified AI-learning app — concepts, quizzes, XP, streaks, and orchestration flows that teach AI one level at a time.",
          "features": [
            [
              "Gamified learning",
              "Concepts, quizzes, XP, and streaks."
            ],
            [
              "Orchestration flows",
              "Teaches how AI systems fit together."
            ],
            [
              "Level-by-level",
              "AI mastery one concept at a time."
            ]
          ],
          "role": "Product Manager",
          "year": "2025",
          "stage2": "Working app",
          "stack": [
            "AI",
            "Education",
            "Interactive"
          ],
          "url": "./apps/neuralpath/"
        }
      ]
    },
    {
      "id": "architecture",
      "name": "Architecture Lab",
      "desc": "The structure under the surface — context maps, event flows, APIs, and the diagrams engineers can build from.",
      "blurb": "Spoken fluently with engineering. Architecture Lab is where products get their skeleton — context diagrams, component boundaries, event flows, and API contracts designed alongside engineers, not thrown over a wall to them.",
      "products": [
        {
          "id": "blueprint",
          "name": "Blueprint",
          "stage": "Shipped",
          "tags": [
            "Platform",
            "Design"
          ],
          "tagline": "The reference architecture behind an AI-native lending platform, drawn to be built.",
          "what": "Blueprint is the end-to-end system design for a lending platform — context, components, the events that flow between them, and the integration seams to cores and bureaus. It's deliberately drawn at a fidelity engineering can implement against.\n\nArchitecture Lab holds the diagrams, the trade-off log, and the sequencing that turned a whiteboard into a buildable roadmap.",
          "features": [
            [
              "Context-first",
              "Boundaries and actors before any box-and-line detail."
            ],
            [
              "Event flows",
              "How money, decisions, and data actually move."
            ],
            [
              "Trade-off log",
              "Every significant call, written down with its why."
            ]
          ],
          "role": "Product Architect",
          "year": "2024",
          "stage2": "In production",
          "stack": [
            "C4",
            "Events",
            "APIs"
          ],
          "url": "https://example.com/blueprint"
        },
        {
          "id": "keystone",
          "name": "Keystone",
          "stage": "Shipped",
          "tags": [
            "Integration",
            "API"
          ],
          "tagline": "An integration spine that lets a platform speak to any core banking system once.",
          "what": "Keystone is the anti-corruption layer between a modern product and the messy reality of legacy cores. Integrate once against Keystone's canonical model, and every downstream feature is insulated from the quirks of the underlying system.\n\nThis lab covers the canonical model, the adapter pattern, and the contract tests that keep integrations from rotting.",
          "features": [
            [
              "Canonical model",
              "One clean internal language for many dialects."
            ],
            [
              "Adapter pattern",
              "New cores plug in without touching product code."
            ],
            [
              "Contract tests",
              "Integrations that fail loudly before customers do."
            ]
          ],
          "role": "Product Architect",
          "year": "2023",
          "stage2": "In production",
          "stack": [
            "DDD",
            "REST",
            "Kafka"
          ],
          "url": "https://example.com/keystone"
        },
        {
          "id": "lattice",
          "name": "Lattice",
          "stage": "Concept",
          "tags": [
            "Multi-tenant",
            "Scale"
          ],
          "tagline": "A multi-tenancy model that keeps a hundred lenders isolated without a hundred deployments.",
          "what": "Lattice explores how to serve many regulated tenants from shared infrastructure without compromising isolation, residency, or per-tenant configurability. It's the structural answer to 'can we scale to a hundred customers without the ops team drowning.'\n\nArchitecture Lab holds the isolation model, the configuration strategy, and the residency design.",
          "features": [
            [
              "Isolation model",
              "Hard tenant boundaries on shared infrastructure."
            ],
            [
              "Config not fork",
              "Per-tenant behavior without per-tenant codebases."
            ],
            [
              "Data residency",
              "Region pinning that satisfies regulators."
            ]
          ],
          "role": "Product Architect",
          "year": "2025",
          "stage2": "Concept",
          "stack": [
            "Multi-tenant",
            "IaC",
            "Cloud"
          ],
          "url": "https://example.com/lattice"
        },
        {
          "id": "lending-cloud",
          "name": "LOS — Loan Origination System",
          "stage": "Working app",
          "tags": [
            "Fintech",
            "Lending"
          ],
          "tagline": "A unified LOS + LMS + collections + analytics engine — workflow state machines, EMI math, and deterministic demo data, all client-side.",
          "what": "A unified LOS + LMS + collections + analytics engine — workflow state machines, EMI math, and deterministic demo data, all client-side.",
          "features": [
            [
              "Unified platform",
              "LOS + LMS + collections + analytics in one."
            ],
            [
              "Workflow state machines",
              "Lifecycle modeled, not hard-coded."
            ],
            [
              "Deterministic demo data",
              "Reproducible EMI math, fully client-side."
            ]
          ],
          "role": "Product Manager",
          "year": "2024",
          "stage2": "Working app",
          "stack": [
            "Fintech",
            "Lending",
            "SaaS"
          ],
          "url": "./apps/lending-cloud/"
        }
      ]
    },
    {
      "id": "data",
      "name": "Data & Entity Lab",
      "desc": "The semantic spine — entity models, master data, and the schemas that make a business legible to software and AI.",
      "blurb": "A shared language for the business. Data & Entity Lab is where the domain gets modeled — entities, relationships, master data, and the semantic layer that lets analytics, products, and AI all mean the same thing by the same word.",
      "products": [
        {
          "id": "graphmind",
          "name": "Graphmind",
          "stage": "Shipped",
          "tags": [
            "Entity model",
            "Semantic"
          ],
          "tagline": "A knowledge graph of the lending domain that every product and model reads from.",
          "what": "Graphmind is the canonical entity model for the lending domain — borrowers, accounts, obligations, events — expressed as a graph that products, analytics, and AI all share. One definition of 'delinquency,' used everywhere.\n\nData & Entity Lab holds the ontology, the governance, and the migration that consolidated five conflicting schemas into one.",
          "features": [
            [
              "One ontology",
              "Shared definitions across every team and system."
            ],
            [
              "Governed change",
              "Schema evolution with review, not surprise."
            ],
            [
              "Five-into-one",
              "Consolidated conflicting legacy models into a spine."
            ]
          ],
          "role": "Data Product Lead",
          "year": "2024",
          "stage2": "In production",
          "stack": [
            "Ontology",
            "Graph",
            "MDM"
          ],
          "url": "https://example.com/graphmind"
        },
        {
          "id": "registry",
          "name": "Registry",
          "stage": "Shipped",
          "tags": [
            "Master data",
            "Governance"
          ],
          "tagline": "Master data management that gives every customer exactly one trusted golden record.",
          "what": "Registry resolves the same customer appearing five times across five systems into a single golden record — matched, merged, and survivorship-ruled — so downstream products stop arguing about who the customer is.\n\nThis lab covers the matching logic, the survivorship rules, and the stewardship workflow for the hard cases.",
          "features": [
            [
              "Entity resolution",
              "Probabilistic matching across messy sources."
            ],
            [
              "Survivorship",
              "Rules that pick the truest value field by field."
            ],
            [
              "Stewardship",
              "A human workflow for the ambiguous matches."
            ]
          ],
          "role": "Data Product Lead",
          "year": "2022",
          "stage2": "In production",
          "stack": [
            "MDM",
            "Matching",
            "Quality"
          ],
          "url": "https://example.com/registry"
        },
        {
          "id": "conduit",
          "name": "Conduit",
          "stage": "Beta",
          "tags": [
            "Pipeline",
            "Streaming"
          ],
          "tagline": "A streaming data layer that keeps the semantic model fresh in seconds, not nightly.",
          "what": "Conduit is the real-time pipeline feeding the entity model — capturing change events from source systems and reconciling them into the graph continuously, so analytics and AI act on minutes-old truth instead of last night's batch.\n\nData & Entity Lab holds the CDC design, the reconciliation logic, and the freshness SLAs.",
          "features": [
            [
              "Change data capture",
              "Source events streamed, not polled."
            ],
            [
              "Continuous reconcile",
              "The graph stays consistent in near-real-time."
            ],
            [
              "Freshness SLAs",
              "Defined, monitored latency budgets."
            ]
          ],
          "role": "Data Product Lead",
          "year": "2025",
          "stage2": "Private beta",
          "stack": [
            "CDC",
            "Kafka",
            "Flink"
          ],
          "url": "https://example.com/conduit"
        },
        {
          "id": "excel-transformer",
          "name": "Excel Transformer",
          "stage": "Working app",
          "tags": [
            "Tools",
            "Data"
          ],
          "tagline": "A client-side spreadsheet tool to drop, rename, filter, and re-export Excel/CSV files — no data leaves the page.",
          "what": "A client-side spreadsheet tool to drop, rename, filter, and re-export Excel/CSV files — no data leaves the page.",
          "features": [
            [
              "Drop & reshape",
              "Rename, filter, and re-export columns."
            ],
            [
              "Excel & CSV",
              "Handles both formats in-browser."
            ],
            [
              "No data leaves",
              "Everything runs on the page."
            ]
          ],
          "role": "Product Manager",
          "year": "2025",
          "stage2": "Working app",
          "stack": [
            "Tools",
            "Data",
            "Productivity"
          ],
          "url": "./apps/excel-transformer/"
        },
        {
          "id": "excel-merger",
          "name": "Excel Merger",
          "stage": "Working app",
          "tags": [
            "Tools",
            "Data"
          ],
          "tagline": "An in-browser tool to merge multiple Excel/CSV files — column strategies, header normalization, and gap-fill — fully offline.",
          "what": "An in-browser tool to merge multiple Excel/CSV files — column strategies, header normalization, and gap-fill — fully offline.",
          "features": [
            [
              "Multi-file merge",
              "Combine many Excel/CSV files at once."
            ],
            [
              "Header normalization",
              "Reconcile mismatched columns and gaps."
            ],
            [
              "Fully offline",
              "Merge without uploading anything."
            ]
          ],
          "role": "Product Manager",
          "year": "2025",
          "stage2": "Working app",
          "stack": [
            "Tools",
            "Data",
            "Productivity"
          ],
          "url": "./apps/excel-merger/"
        }
      ]
    },
    {
      "id": "product",
      "name": "Product Lab",
      "desc": "Where it all becomes usable — journeys, flows, hi-fi design, and shipped experiences an engineering team can build.",
      "blurb": "The part people actually touch. Product Lab is where strategy, data, and architecture resolve into something usable — journeys, flows, information architecture, and hi-fi design crafted to be both delightful and shippable.",
      "products": [
        {
          "id": "loop",
          "name": "Loop",
          "stage": "Shipped",
          "tags": [
            "Mobile",
            "Banking"
          ],
          "tagline": "A mobile banking experience designed around moments, not menus.",
          "what": "Loop reimagines mobile banking around the handful of moments that actually matter — getting paid, paying someone, knowing you're okay — and ruthlessly demotes everything else. The result is an app that feels calm instead of crowded.\n\nProduct Lab holds the journey maps, the IA, and the hi-fi flows that shipped to several hundred thousand users.",
          "features": [
            [
              "Moment-first IA",
              "Organized by intent, not by org chart."
            ],
            [
              "Calm by default",
              "The 90% case is one tap; the rest is one more."
            ],
            [
              "Shipped at scale",
              "Live to hundreds of thousands of users."
            ]
          ],
          "role": "Lead Product Designer",
          "year": "2023",
          "stage2": "Live",
          "stack": [
            "UX",
            "Figma",
            "Mobile"
          ],
          "url": "https://example.com/loop"
        },
        {
          "id": "canvas",
          "name": "Canvas",
          "stage": "Shipped",
          "tags": [
            "Design system",
            "Web"
          ],
          "tagline": "A design system that let eight squads ship one coherent product.",
          "what": "Canvas is the design system and component library that gave a fast-growing org a shared visual language — tokens, components, and patterns documented well enough that eight squads could ship independently and still look like one product.\n\nThis lab covers the token architecture, the contribution model, and the adoption playbook.",
          "features": [
            [
              "Token architecture",
              "Themeable foundations, not hard-coded values."
            ],
            [
              "Contribution model",
              "Squads extend the system without forking it."
            ],
            [
              "Adoption playbook",
              "How a system actually gets used, not shelved."
            ]
          ],
          "role": "Design Systems Lead",
          "year": "2022",
          "stage2": "Live",
          "stack": [
            "Tokens",
            "React",
            "Docs"
          ],
          "url": "https://example.com/canvas"
        },
        {
          "id": "field",
          "name": "Field",
          "stage": "Beta",
          "tags": [
            "Workflow",
            "Internal"
          ],
          "tagline": "An internal operations console that turns chaotic back-office work into clear queues.",
          "what": "Field is the console operations teams live in all day — turning sprawling, ambiguous back-office work into prioritized queues, clear next actions, and visible SLAs. Designed with the people who use it, iterated weekly.\n\nProduct Lab holds the workflow design, the prioritization logic, and the usability work behind it.",
          "features": [
            [
              "Queue-based UX",
              "Always a clear next thing to do."
            ],
            [
              "Visible SLAs",
              "Everyone sees what's at risk, in real time."
            ],
            [
              "Built with users",
              "Co-designed with the ops team, shipped weekly."
            ]
          ],
          "role": "Lead Product Designer",
          "year": "2025",
          "stage2": "Private beta",
          "stack": [
            "UX",
            "Ops",
            "Design"
          ],
          "url": "https://example.com/field"
        }
      ]
    }
  ]
};
