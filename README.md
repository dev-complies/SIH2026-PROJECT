# GovInnovate | Government Innovation Procurement & Pilot Management Platform

> **GovTech Operating System for Moving Public Challenges from Problem Statement to Startup Discovery, Evaluation, Pilot, Evidence, Validation, and Procurement Scale-up.**

GovInnovate bridges government departments and innovative deep-tech startups under statutory procurement guidelines (General Financial Rules — GFR 2017 Rule 149).

---

## 🏛️ System Architecture & Complete Innovation Lifecycle

```
Government Problem ──► Challenge Statement ──► Startup Discovery & Application
                                                         │
Scale-up Procurement ◄── Validation Report ◄── Controlled Pilot & Telemetry Evidence
```

1. **Government Problem Formulation**: 7-Step structured wizard with an advisory AI Challenge Assistant to formulate public problem statements.
2. **Public Challenge Catalog & Discovery**: Multi-facet filtering (Department, State, District, Category, Tech, Budget, Duration, Deadline, Status) with 2D cards and interactive 3D Geospatial Map.
3. **Startup B2B Capability Profile**: Verified DPIIT credentials, sovereign data tenancy, patent portfolio, previous government track record, case studies, and document repository.
4. **Startup Application Workflow**: 14-Step proposal submission wizard with autosave, draft persistence, field locking upon submission, status tracking timeline, clarification query responses, and withdrawal support.
5. **Double-Blind Expert Evaluation**: Independent academic and municipal scoring against weighted multi-criteria rubrics with Conflict of Interest (COI) declarations.
6. **Controlled Pilot Deployment**: Performance escrow disbursement tied to milestone-based telemetry evidence, automated KPI tracking, and third-party validation.
7. **Sovereign Evidence & Validation**: Cryptographically sealed SHA-256 evidence packages audited by empaneled validators (IIT / TERI) leading to GFR Rule 149 scale-up procurement.

---

## 👥 Role-Based Access Control (RBAC)

The platform enforces strict data isolation across 6 dedicated roles:

| Role | Workspace Route | Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **ADMIN** | `/admin/dashboard` | System configuration, user management, department onboarding, audit logs. |
| **GOVERNMENT_OFFICER** | `/gov/dashboard` | Challenge formulation, eligibility screening, pilot oversight, validation review. |
| **PROCUREMENT_OFFICER** | `/procurement/dashboard` | Budget allocations, milestone disbursements, GFR Rule 149 compliance, contracts. |
| **STARTUP** | `/startup/dashboard` | Challenge discovery, proposal submission, telemetry logging, capability profile. |
| **EXPERT** | `/expert/dashboard` | Double-blind technical evaluations, proposal scoring, clarification queries. |
| **VALIDATOR** | `/validator/dashboard` | Independent testbed audits, collocated calibration verification, scale-up reports. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & GovInnovate Design System
- **3D Visualization**: Three.js, React Three Fiber (R3F), Drei (Architectural Digital City, Pilot Map, Innovation Pipeline)
- **Forms & Validation**: Zod, React Hook Form, Custom Multi-Step Steppers
- **Security & Authorization**: Role-aware middleware, Row-Level Data Isolation, SHA-256 evidence anchoring
- **Charts & Telemetry**: Recharts, SVG GIS mesh layers
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# 1. Clone repository
git clone https://github.com/dev786786/SIH2026-PROJECT.git
cd SIH2026-PROJECT

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Verify types and security policies
npm run typecheck
node scripts/test-authorization.mjs

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 🧪 Testing & Verification

```bash
# Verify TypeScript compilation (0 errors required)
npm run typecheck

# Verify RBAC security assertions (72 / 72 tests)
node scripts/test-authorization.mjs

# Create production build
npm run build
```

---

## 📄 License & Compliance

Developed under General Financial Rules (GFR 2017) Rule 149 and Ministry of Electronics and Information Technology (MeitY) guidelines for Sovereign Indian Public Cloud Deployment.
