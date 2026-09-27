# GovInnovate | Government Innovation Procurement & Pilot Management Platform

> **Smart India Hackathon (SIH 2026) | National GovTech Operating System**
> Moving public challenges from Problem Statement to Startup Discovery, Double-Blind Evaluation, Controlled Pilot, Empirical Evidence, 3rd-Party Validation, and Statutory Procurement Scale-Up.

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![GFR 2017 Compliant](https://img.shields.io/badge/Compliance-GFR%20Rule%20149-emerald?style=flat-square)](docs/database-schema.md)
[![Workflow Tests](https://img.shields.io/badge/Workflow%20Tests-72%2F72%20Passing-success?style=flat-square)](scripts/test-end-to-end-workflow.mjs)
[![Security Tests](https://img.shields.io/badge/RBAC%20Tests-381%2F381%20Passing-success?style=flat-square)](scripts/test-authorization.mjs)

---

## 🏛️ Executive Summary

**GovInnovate** bridges government departments and innovative deep-tech startups under statutory public procurement guidelines (**General Financial Rules — GFR 2017 Rule 149**). 

Traditional government procurement struggles with deeptech because departments cannot legally purchase unproven technologies without open tenders, while startups cannot prove efficacy without government testbeds. GovInnovate solves this deadlock through **controlled, performance-escrow pilots** backed by **cryptographically signed SHA-256 telemetry evidence** and **accredited third-party validation**.

```
Government Problem ──► Challenge Statement ──► Startup Discovery & Application
                                                         │
Scale-Up Procurement ◄── 3rd-Party Validation ◄── Controlled Pilot & Telemetry Evidence
```

---

## ⚡ Quick Start (Frontend + Backend in One Command)

GovInnovate is a full-stack Next.js application where **the frontend UI, backend API routes (34 endpoints), security middleware, and database engine run together in a single command**.

### Prerequisites
* **Node.js** `18.18.0` or higher (`node -v`)
* **npm** `9.0.0` or higher (`npm -v`)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/dev-complies/SIH2026-PROJECT.git
cd SIH2026-PROJECT

# 2. Install dependencies
npm install

# 3. Start the application (Frontend + Backend APIs + Database)
npm run dev
```

Open **`http://localhost:3000`** in your browser.

> [!TIP]
> **No separate backend process needed!** Running `npm run dev` boots up both the React frontend and all 34 server-side backend API endpoints at `http://localhost:3000`.

---

## 🎯 Smart India Hackathon Live Demonstration

The application includes an **interactive 12-stage Demonstration Dock** mounted at the bottom of every page. It guides evaluators step-by-step with **automatic role switching** (no manual re-logins needed):

| Step | Stage Name | Route | Active Persona | Key Live Talking Point / Data Point |
|:---:|:---|:---|:---|:---|
| **01** | **Landing Page** | `/` | *Public / Citizen* | National GovTech operating system, pilot impact stats, statutory GFR Rule 149 framework. |
| **02** | **Government Dashboard** | `/gov/dashboard` | **Rajesh Verma** *(Gov Officer)* | Dept of Urban Development command center: active challenges, pilot pipeline, escrow disbursements. |
| **03** | **Open Challenge** | `/challenges/chal-air-001` | **Rajesh Verma** *(Gov Officer)* | *"Urban Air Quality Hyperlocal Monitoring & Intervention Mesh"* (Baseline 35% &rarr; Target 85% coverage). |
| **04** | **Startup Discovery** | `/challenges` | **Aarav Sharma** *(Startup CEO)* | AirSense Technologies filters live civic challenges under Smart Cities Mission & CleanTech IoT. |
| **05** | **Startup Application** | `/startup/applications` | **Aarav Sharma** *(Startup CEO)* | Submits 90-day pilot proposal (`APP-AIR-2026-01`) with optical IoT mesh architecture & DPIIT credentials. |
| **06** | **Expert Evaluation** | `/expert/evaluations` | **Dr. Alok Gupta** *(IIT Kanpur)* | Mandatory Conflict of Interest (COI) disclosure affirmed; blind technical scoring (AirSense: 91.7/100). |
| **07** | **Shortlisting Matrix** | `/gov/shortlisting` | **Rajesh Verma** *(Gov Officer)* | Committee approves consensus ranking (AirSense #1 of 14 applicants) and authorizes pilot agreement. |
| **08** | **Pilot Dashboard** | `/gov/pilots/PILOT-UP-UAQ-01` | **Rajesh Verma** *(Gov Officer)* | Lucknow Urban Air Quality Pilot (90 Days &bull; 40 IoT Nodes, live GIS map, milestone escrow tracker). |
| **09** | **KPI Results Tracking** | `/kpis` | **Rajesh Verma** *(Gov Officer)* | **Coverage**: 35% &rarr; 86%; **Accuracy**: 82% &rarr; 95%; **Uptime**: 76% &rarr; 94% *(Exceeding Targets)*. |
| **10** | **Evidence Vault** | `/evidence` | **Rajesh Verma** *(Gov Officer)* | Cryptographically verified SHA-256 telemetry logs, CPCB collocated sensor reports, raw data packets. |
| **11** | **Validation Audit** | `/validator/dashboard` | **Priya Nair** *(TERI Auditor)* | TERI Class-A Auditor executes 8-point empirical validation checklist and certifies tamper-evident logs. |
| **12** | **Scale-Up Decision** | `/scale-up` | **Rajesh Verma** *(Gov Officer)* | Statutory Scale-Up Memo `DEC-SCALE-2026-01`: ₹1.68 Cr expansion to 6 Smart Cities across Uttar Pradesh. |

---

## 👥 Demo Personas & Instant Authentication

Navigate to [`/auth/login`](http://localhost:3000/auth/login) for 1-click authentication into any of the 4 primary demo roles:

| Role | Name | Official Designation / Entity | Email | Password |
|:---|:---|:---|:---|:---|
| **🏛️ Government Officer** | Rajesh Verma | Joint Director, Urban Smart Infrastructure (UP Urban Dev) | `officer@urban.gov.in` | `Password123!` |
| **🚀 Startup Founder** | Aarav Sharma | CEO, AirSense Technologies Pvt Ltd *(DPIIT-94812)* | `founder@airsense.example.com` | `Password123!` |
| **🔬 Expert Evaluator** | Dr. Alok Gupta | Professor of Atmospheric Sciences, IIT Kanpur | `dr.gupta@iitk.ac.in` | `Password123!` |
| **🛡️ 3rd-Party Validator** | Priya Nair | Lead Auditor, Environmental Systems Validation (TERI) | `validator@teriin.org` | `Password123!` |

*(All accounts are pre-authorized with zero configuration required).*

---

## 🏗️ Technical Architecture & Backend Specification

### 1. Server-Side REST API Handlers (`src/app/api/`)
Contains **34 server-side Route Handlers** running in Node.js:
* `/api/applications` — Proposal intake, validation, and DPIIT verification
* `/api/eligibility` — Statutory compliance review under GFR Rule 149
* `/api/shortlist` — Multi-expert consensus scoring aggregation
* `/api/pilots` & `/api/milestones` — Testbed management & milestone escrow releases
* `/api/evidence` & `/api/kpis` — SHA-256 telemetry ingestion & SLA tracking
* `/api/validator` — Independent 8-point accredited audit checklist
* `/api/audit-logs` — Immutable sequential cryptographic ledger
* `/api/protected/...` — RBAC-guarded administrative and procurement endpoints

### 2. Security & Request Interception (`src/middleware.ts`)
* **Role-Based Authorization (RBAC)**: Validates session cookies against protected route matrices.
* **CSRF Origin Verification**: Inspects mutating operations (`POST`, `PUT`, `PATCH`, `DELETE`).
* **Defense-in-Depth Headers**: Standardized HTTP headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`).

### 3. Cryptographic Tamper-Evidence
Every government milestone approval, validator certificate, and scale-up decision is hashed via **SHA-256** and chained back to the platform genesis block (`GENESIS_HASH_GOVINNOVATE_2026`).

---

## 🧪 Automated Testing & Verification

The platform includes two standalone automated test suites ensuring zero regression:

```bash
# 1. Typecheck the entire codebase (0 errors)
npm run typecheck

# 2. Run the End-to-End Workflow Verification Suite (72 tests)
node scripts/test-end-to-end-workflow.mjs

# 3. Run the Security & RBAC Authorization Suite (381 tests)
node scripts/test-authorization.mjs

# 4. Run production build (69 / 69 routes compiled)
npm run build
```

---

## 📦 Production Deployment

For the fastest presentation performance with pre-rendered static routes:

```bash
npm run build
npm run start
```
Starts the production server at `http://localhost:3000`.

---

## 📜 Statutory Framework & Compliance

Developed strictly under:
* **General Financial Rules (GFR 2017) Rule 149**: Government e-Marketplace (GeM) & Innovation Pilot Scale-Up.
* **Central Vigilance Commission (CVC) Guidelines**: Mandatory Conflict of Interest (COI) declarations for technical evaluators.
* **MeitY Sovereign Data Tenancy**: Localized data storage and cryptographic audit trails.
