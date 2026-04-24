

# Stylish — AI-Powered Social Style Commerce

Stylish is a planned e-commerce platform that helps shoppers discover clothing that matches the style of creators/celebrities they follow, then finds the best available deal across supported stores.

> Current status: **Planning phase** (pre-code).

---

## What We Are Building

The product combines three capabilities:

1. **Style understanding from social signals** (with user consent)
2. **Personalized product recommendations**
3. **Cross-store deal comparison** (price + shipping + stock)

The goal is to provide users with:
- Better style matches
- Better prices
- Clear explanations for why items were recommended

---

## Project Status

This repository currently contains planning artifacts and no production code yet.

- ✅ Vision and architecture drafted
- ✅ MVP phases defined
- ✅ Core AI-agent responsibilities defined
- ⏳ Implementation scaffolding (frontend/backend) not started

Detailed plan: [`docs/ai_ecommerce_social_stylist_plan.md`](docs/ai_ecommerce_social_stylist_plan.md)

---

## MVP Scope (First Build)

### User-facing features
- Account creation and profile setup
- Preference onboarding (budget, sizes, favorite styles)
- Personalized recommendation feed
- Product detail page with “Why this match?” explanation
- Best-deal panel showing comparable offers

### Platform features
- Product catalog ingestion
- Offer ingestion/normalization from selected merchants
- Recommendation API endpoint
- Price history snapshots + alerts (basic)

---

## Proposed Architecture

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python) or Node.js (TypeScript)
- **Database**: PostgreSQL (+ `pgvector` for embeddings)
- **Cache**: Redis
- **Async jobs**: Celery/RQ or BullMQ
- **AI services**:
  - Embeddings for style similarity
  - Vision/text analysis for style tags
  - LLM-generated recommendation rationale

---

## AI Agents (Planned)

### 1) Social Style Profiler
Builds a per-user style profile from authorized social activity and/or user-provided inspiration images.

### 2) Recommendation Agent
Ranks products by style-match score plus practical constraints (size, budget, availability, seasonality).

### 3) Deal Finder Agent
Compares total landed cost (item + shipping + discounts), stock, and merchant trust indicators to suggest best-value options.

---

## Compliance and Privacy Principles

Before coding integrations, we will enforce the following:

- Explicit user consent for any social data usage
- Only platform-approved API usage and scopes
- Data minimization and secure token handling
- Data deletion/export paths for users
- Audit logs and access controls

---

## Suggested Repository Layout (When Coding Starts)

```text
.
├── README.md
├── docs/
│   └── ai_ecommerce_social_stylist_plan.md
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Backend service (FastAPI or Node)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared lint/tsconfig/etc.
│   └── types/               # Shared types/contracts
├── infra/                   # IaC / deployment templates
└── scripts/                 # Data import, local automation
```

---

## Milestones Before Production Coding

1. **Finalize social platform legal feasibility** (by region + use case)
2. **Choose implementation stack** (FastAPI vs Node backend)
3. **Define API contract v0** for recommendations and offers
4. **Create seed dataset** for product/style experimentation
5. **Set quality metrics** (CTR, conversion, savings-per-order)

---

## How to Contribute at This Stage

Since the codebase is pre-implementation, useful contributions now are:

- Improving architecture/design docs
- Proposing API contracts and schemas
- Defining acceptance criteria for MVP features
- Risk and compliance checklists

---

## Next Step

After README approval, we can scaffold the initial monorepo structure and start Phase 1 implementation.
docs/ai_ecommerce_social_stylist_plan.md
docs/ai_ecommerce_social_stylist_plan.md
New
+117
-0

# AI-Powered Social Style E-commerce: Implementation Plan

## 1) Product Vision
Build an e-commerce platform that recommends outfits based on a customer's social media interests (e.g., celebrities and style posts from Instagram/Facebook), then compares prices across multiple stores and surfaces the best-value option.

## 2) Core User Journey
1. User signs up and consents to social data usage.
2. User connects social accounts (or manually shares profile preferences if account linking is not available).
3. System creates a style profile:
   - Followed creators/celebrities
   - Saved/liked style posts
   - Color/pattern/silhouette preferences
4. Recommendation engine proposes products with "style match" score.
5. Deal engine compares prices from partner stores and marketplaces.
6. UI shows best deal, alternatives, shipping estimates, and confidence score.

## 3) High-Level Architecture
- **Frontend**: Next.js + Tailwind + component library (responsive catalog, recommendation feed, style boards).
- **Backend API**: FastAPI or Node.js (TypeScript) for user profiles, recommendations, and checkout orchestration.
- **Data Layer**:
  - PostgreSQL for users/orders/products
  - Redis for caching recommendations and price snapshots
  - Vector DB (e.g., pgvector or Pinecone) for style embeddings
- **AI Layer**:
  - Multimodal embedding model for images + captions
  - LLM for style reasoning and explanation text
  - Ranking model for personalization and conversion optimization
- **Integrations**:
  - Social APIs where permitted/available
  - Product feeds from partner merchants
  - Price comparison connectors/scrapers (legal-compliant)

## 4) AI Components
### A. Social Style Profiler
Input signals:
- Followed accounts and categories
- Engagement on fashion-related posts
- Optional uploaded inspiration images

Pipeline:
1. Ingest public/authorized social signals.
2. Extract visual/text features (colors, cuts, brands, vibe).
3. Build weighted style vectors per user.
4. Persist profile with explainable tags ("minimalist streetwear", "neutral palette").

### B. Recommendation Agent
- Candidate generation from product catalog embeddings.
- Re-ranking by size availability, brand affinity, budget, and seasonality.
- Explanations: "Recommended because it matches looks from creators you follow."

### C. Deal Finder Agent
- Pull price, shipping, discounts, and stock from supported vendors.
- Normalize total landed cost.
- Rank by best value and trust score.
- Alert user on price drops and restocks.

## 5) Social Media Data & Compliance
- Use only officially supported APIs and explicit user consent.
- Respect platform terms; avoid prohibited scraping.
- Store minimal personal data and provide data deletion controls.
- Add transparent consent screens and preference toggles.
- Implement rate limiting, auditing, and access logs.

## 6) MVP Scope (10-12 Weeks)
### Phase 1 (Weeks 1-3): Foundations
- Auth, user profile, product catalog ingestion
- Basic recommendation endpoint (non-social cold-start)

### Phase 2 (Weeks 4-7): Social style intelligence
- Social account connect flow (where available)
- Style embedding pipeline + profile generation
- Personalized recommendation feed

### Phase 3 (Weeks 8-10): Deal comparison
- Integrate 3-5 merchant sources
- Price normalization and best-deal ranking
- Price history chart and alerts

### Phase 4 (Weeks 11-12): Hardening
- Analytics, A/B tests, abuse prevention, monitoring
- Security and compliance checks

## 7) Suggested Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python) for AI-heavy workloads
- **ML/AI**: OpenAI embeddings + vision-capable model for tagging and rationale generation
- **DB**: PostgreSQL + pgvector
- **Queue/Workers**: Celery/RQ or BullMQ for async social ingestion and repricing jobs
- **Infra**: Docker, managed Postgres, object storage, CDN

## 8) Data Model (Minimal)
- `users(id, email, consent_flags, budget_range, sizes, created_at)`
- `social_connections(user_id, provider, token_ref, scopes, status)`
- `style_profiles(user_id, embedding, tags_json, updated_at)`
- `products(id, merchant_id, title, image_url, brand, category, attributes_json)`
- `offers(id, product_id, merchant_id, price, shipping, in_stock, fetched_at)`
- `recommendations(user_id, product_id, match_score, rationale, created_at)`

## 9) Safety & Trust Features
- Explain recommendation reasons (human-readable).
- Let users hide styles/brands they dislike.
- Brand safety filters and counterfeit risk signals.
- Clear label for sponsored vs organic recommendations.

## 10) Success Metrics
- CTR on recommendations
- Add-to-cart and conversion uplift
- Average order value
- Recommendation satisfaction feedback
- Price-savings per order vs baseline

## 11) Immediate Next Steps
1. Validate legal feasibility for each social platform and region.
2. Start with one social source + one fashion niche for MVP.
3. Build synthetic dataset for rapid model iteration before full integrations.
4. Launch a concierge beta with manual QA for recommendation quality.

