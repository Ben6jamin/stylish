diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..172b427e7b4b3662abd3af3e13b42604ed2c0a50
--- /dev/null
+++ b/README.md
@@ -0,0 +1,136 @@
+# Stylish — AI-Powered Social Style Commerce
+
+Stylish is a planned e-commerce platform that helps shoppers discover clothing that matches the style of creators/celebrities they follow, then finds the best available deal across supported stores.
+
+> Current status: **Planning phase** (pre-code).
+
+---
+
+## What We Are Building
+
+The product combines three capabilities:
+
+1. **Style understanding from social signals** (with user consent)
+2. **Personalized product recommendations**
+3. **Cross-store deal comparison** (price + shipping + stock)
+
+The goal is to provide users with:
+- Better style matches
+- Better prices
+- Clear explanations for why items were recommended
+
+---
+
+## Project Status
+
+This repository currently contains planning artifacts and no production code yet.
+
+- ✅ Vision and architecture drafted
+- ✅ MVP phases defined
+- ✅ Core AI-agent responsibilities defined
+- ⏳ Implementation scaffolding (frontend/backend) not started
+
+Detailed plan: [`docs/ai_ecommerce_social_stylist_plan.md`](docs/ai_ecommerce_social_stylist_plan.md)
+
+---
+
+## MVP Scope (First Build)
+
+### User-facing features
+- Account creation and profile setup
+- Preference onboarding (budget, sizes, favorite styles)
+- Personalized recommendation feed
+- Product detail page with “Why this match?” explanation
+- Best-deal panel showing comparable offers
+
+### Platform features
+- Product catalog ingestion
+- Offer ingestion/normalization from selected merchants
+- Recommendation API endpoint
+- Price history snapshots + alerts (basic)
+
+---
+
+## Proposed Architecture
+
+- **Frontend**: Next.js + TypeScript + Tailwind CSS
+- **Backend**: FastAPI (Python) or Node.js (TypeScript)
+- **Database**: PostgreSQL (+ `pgvector` for embeddings)
+- **Cache**: Redis
+- **Async jobs**: Celery/RQ or BullMQ
+- **AI services**:
+  - Embeddings for style similarity
+  - Vision/text analysis for style tags
+  - LLM-generated recommendation rationale
+
+---
+
+## AI Agents (Planned)
+
+### 1) Social Style Profiler
+Builds a per-user style profile from authorized social activity and/or user-provided inspiration images.
+
+### 2) Recommendation Agent
+Ranks products by style-match score plus practical constraints (size, budget, availability, seasonality).
+
+### 3) Deal Finder Agent
+Compares total landed cost (item + shipping + discounts), stock, and merchant trust indicators to suggest best-value options.
+
+---
+
+## Compliance and Privacy Principles
+
+Before coding integrations, we will enforce the following:
+
+- Explicit user consent for any social data usage
+- Only platform-approved API usage and scopes
+- Data minimization and secure token handling
+- Data deletion/export paths for users
+- Audit logs and access controls
+
+---
+
+## Suggested Repository Layout (When Coding Starts)
+
+```text
+.
+├── README.md
+├── docs/
+│   └── ai_ecommerce_social_stylist_plan.md
+├── apps/
+│   ├── web/                 # Next.js frontend
+│   └── api/                 # Backend service (FastAPI or Node)
+├── packages/
+│   ├── ui/                  # Shared UI components
+│   ├── config/              # Shared lint/tsconfig/etc.
+│   └── types/               # Shared types/contracts
+├── infra/                   # IaC / deployment templates
+└── scripts/                 # Data import, local automation
+```
+
+---
+
+## Milestones Before Production Coding
+
+1. **Finalize social platform legal feasibility** (by region + use case)
+2. **Choose implementation stack** (FastAPI vs Node backend)
+3. **Define API contract v0** for recommendations and offers
+4. **Create seed dataset** for product/style experimentation
+5. **Set quality metrics** (CTR, conversion, savings-per-order)
+
+---
+
+## How to Contribute at This Stage
+
+Since the codebase is pre-implementation, useful contributions now are:
+
+- Improving architecture/design docs
+- Proposing API contracts and schemas
+- Defining acceptance criteria for MVP features
+- Risk and compliance checklists
+
+---
+
+## Next Step
+
+After README approval, we can scaffold the initial monorepo structure and start Phase 1 implementation.
