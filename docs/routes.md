# GovInnovate Frontend Routing & Page Hierarchy Specification

## 1. Routing Architecture Overview

GovInnovate employs Next.js 14+ App Router with strict route grouping (`(public)`, `(government)`, `(procurement)`, `(startup)`, `(expert)`, `(validator)`, `(admin)`) and client/server middleware route protection.

### Layout Hierarchy
- **Root Layout (`src/app/layout.tsx`)**: Global typography (Inter), theme context, TanStack Query provider, Toast/Notification provider, WebGL capability detector.
- **Public Layout (`src/app/(public)/layout.tsx`)**: Public header navigation, challenge search drawer, authenticated user switcher, footer.
- **Dashboard Layouts (`src/app/(role)/layout.tsx`)**: Persistent GovTech enterprise shell containing:
  - Collapsible side navigation with role-specific items and badge counters (e.g. pending approvals).
  - Top administrative bar with breadcrumb trail, global search modal (`Cmd+K`), active role/department context switcher, and unread notification bell.
  - Consistent layout spacing, eliminating erratic container shifts.

---

## 2. Route Directory & Access Control Map

| Route Path | Page Title | Authorized Roles | Layout Pattern | Core Components | Visual & 3D Elements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PUBLIC ROUTES** | | | | | |
| `/` | GovInnovate \| Public Innovation Procurement OS | Public (All) | Public Hero Layout | Hero Section, Lifecycle Pipeline, Featured Challenges, Proven Solutions, Impact Stats | **Interactive 3D Architectural City** (Three.js/R3F) with data flow lines & node tooltips |
| `/challenges` | Innovation Challenges Directory | Public (All) | Filter & Split View | Multi-faceted Filter Sidebar, Challenge Data Grid/Cards, Quick Preview Drawer | Status badges, budget/deadline indicators, department crests |
| `/challenges/[code]` | Challenge Details & Scope | Public (All) | 2-Column Document Layout | Problem Statement, Objectives, Pilot Scope, Timeline, Rubric Breakdown, Eligibility Checklist | Phase progress stepper, "Apply as Startup" CTA, Download PDF Brief |
| `/proven-solutions` | Proven Solutions Catalog | Public (All) | Catalog Grid & Facets | Department Selector, Technology Filter, ROI & Impact Cards, Replication Guide Modal | Validated KPI badges, pilot location tags, before/after metric charts |
| `/proven-solutions/[id]` | Proven Solution Deep Dive | Public (All) | Showcase Layout | Problem-Solution Story, Verified Pilot Results, Evidence Snapshots, Procurement Specification | Recharts time-series comparison (Baseline vs. Outcome) |
| `/auth/login` | Secure Portal Login | Public (All) | Clean Auth Card | Email/Password, Role Switcher Demo Quick-Login, SAML/Gov SSO placeholder | High contrast focus states, security advisory notice |
| `/auth/register` | Startup Registration | Public (All) | Multi-step Onboarding | DPIIT validation, company info, founder details, legal consent | Real-time validation feedback, password strength meter |
| **GOVERNMENT OFFICER ROUTES** | | | | | |
| `/gov/dashboard` | Government Command Center | `GOVERNMENT_OFFICER` | Enterprise Shell | Metric Ribbon, Action Required Queue, Active Pilots Table, Innovation Pipeline | **Hybrid 2D/3D Innovation Ecosystem Pipeline** & Pilot Geo Map |
| `/gov/challenges` | Department Challenges | `GOVERNMENT_OFFICER` | Data Table with Tabs | Status Tabs (Draft, Review, Active, Closed), Create Challenge Button, Quick Actions | Status pills, application count indicators, deadline alerts |
| `/gov/challenges/new` | Create Innovation Challenge | `GOVERNMENT_OFFICER` | 7-Step Stepper Wizard | Step 1: Problem, 2: Outcomes, 3: Specs, 4: Pilot Design, 5: Eligibility, 6: Rubrics, 7: Review | **AI Challenge Assistant Panel** (Auto-structuring & KPI suggestions) |
| `/gov/challenges/[id]` | Challenge Management Hub | `GOVERNMENT_OFFICER` | Tabbed Workstation | Applications Tab, Assigned Evaluators, Scoring Consensus, Timeline, Compliance Docs | Live application funnel, blind review toggle |
| `/gov/challenges/[id]/screen/[appId]` | Eligibility Screening Desk | `GOVERNMENT_OFFICER` | Split Document Screen | Left: Startup Proposal; Right: Eligibility Checklist & Decision Action Panel | One-click condition notes, approval/rejection audit reason input |
| `/gov/challenges/[id]/evaluations` | Expert Evaluation Consensus | `GOVERNMENT_OFFICER` | Matrix Table | Blind Candidate Matrix, Rubric Score Breakdown, Inter-rater Variance, COI Status | Heatmap score matrix, expert comment flyouts |
| `/gov/challenges/[id]/shortlist` | Shortlisting & Award Workbench | `GOVERNMENT_OFFICER` | Ranking & Selection List | Weighted Ranked Proposals, Budget Allocation, Selection Justification, Pilot Conversion | Cutoff slider, award confirmation modal |
| `/gov/pilots` | Active Innovation Pilots | `GOVERNMENT_OFFICER` | Operational Table | Filter by Dept, Status, Risk, Progress; Search by Code or Title | Risk indicators, progress micro-charts, milestone countdowns |
| `/gov/pilots/[id]` | Pilot Command & Oversight | `GOVERNMENT_OFFICER` | Full Workstation Shell | Tabs: Overview, Milestones, KPIs, Evidence, Risks, Issues, Documents, Payments, Validation | **3D Pilot Infrastructure & Device Map** (Geospatial sensor pins) |
| `/gov/pilots/[id]/scale-up` | Scale-Up & Procurement Decision | `GOVERNMENT_OFFICER` | Decision Workbench | Validation Findings Summary, Scale Recommendation Form, Committee Concurrence | Outcome selector: Scale, Extend, Retest, Close; PDF Memo Export |
| **PROCUREMENT OFFICER ROUTES** | | | | | |
| `/procurement/dashboard` | Procurement & Compliance Center | `PROCUREMENT_OFFICER` | Enterprise Shell | Legal Review Queue, Milestone Disbursement Queue, Budget Burn Rate, Procurement Pipeline | Financial burndown charts, pending compliance alerts |
| `/procurement/challenges` | Challenge Legal Clearance | `PROCUREMENT_OFFICER` | Review List & Drawer | RFP Terms Review, Procurement Rule Compliance Checklist, Publication Sign-off | Side-by-side legal text comparison, approval stamp |
| `/procurement/payments` | Milestone Payment Authorizations | `PROCUREMENT_OFFICER` | Transactional Table | Milestone Evidence Verifications, Contract Milestones, Invoice Data, Disburse Action | Mock payment gateway dispatcher, bank advice export |
| `/procurement/scale-up` | Scale-Up Procurement Contracts | `PROCUREMENT_OFFICER` | Contracting Workspace | Validated Specs, Direct Procurement Justification, State Tender Template Generator | Formal procurement requisition pack builder |
| **STARTUP ROUTES** | | | | | |
| `/startup/dashboard` | Innovator Control Room | `STARTUP` | Enterprise Shell | Profile Completeness Gauge, Active Submissions, Pilot Progress, Pending Invoices | Milestone deadline countdown cards, payment disbursement track |
| `/startup/profile` | Startup Profile & Credentials | `STARTUP` | Sectioned Settings Form | DPIIT Recognition, Tech Stack Tags, Team Bios, Case Studies, Certifications, Legal Docs | Profile completeness calculation ring (0-100%) |
| `/startup/challenges` | Matched Challenge Opportunities | `STARTUP` | Search & Save Grid | Fit-score recommendations, Saved challenges, Deadline alerts | Match tag based on registered technology stack |
| `/startup/challenges/[id]/apply` | Challenge Application Wizard | `STARTUP` | Multi-step Stepper | Solution, Technical Approach, Pilot Plan, Budget, Team, Compliance, Draft Save | Auto-save draft indicator, word-count limits, attachment uploaders |
| `/startup/applications/[id]` | Application Status Tracker | `STARTUP` | Progress Tracker View | Timeline Stepper (Received -> Screening -> Evaluation -> Shortlist), Clarification Q&A | Decision notices, clarification response uploader |
| `/startup/pilots/[id]` | Pilot Execution Workbench | `STARTUP` | Tabbed Workstation | Milestone Deliverable Submission, KPI Data Logger, Evidence File Uploader, Risk Log | Direct telemetry log input, file drag-and-drop with hash check |
| **EXPERT EVALUATOR ROUTES** | | | | | |
| `/expert/dashboard` | Evaluator Workdesk | `EXPERT_EVALUATOR` | Task Queue Layout | Assigned Applications, COI Pending Signatures, Evaluation Deadlines | Progress completion ring, submission locks |
| `/expert/evaluate/[assignmentId]` | Blind Evaluation Workbench | `EXPERT_EVALUATOR` | Split Screen Evaluator | Left: Anonymized Proposal; Right: Weighted Rubric Form with Justifications & Score Slider | **Strict COI Gate Modal** (Must sign before proposal unlocks) |
| `/expert/history` | Historical Evaluations | `EXPERT_EVALUATOR` | Read-only Archive Table | Completed reviews, anonymized challenge codes, timestamps | Score audit certificate generator |
| **INDEPENDENT VALIDATOR ROUTES** | | | | | |
| `/validator/dashboard` | Independent Audit Desk | `INDEPENDENT_VALIDATOR`| Audit Queue Layout | Assigned Pilots, Evidence Verification Deadlines, Field Inspection Schedules | Verification queue counters, sensor anomaly alerts |
| `/validator/pilots/[id]` | Pilot Validation Studio | `INDEPENDENT_VALIDATOR`| Verification Workbench | Methodology Setup, KPI Time-Series Audit, Evidence Inspection & Hash Verification | Time-series chart overlays, Validation Report Editor |
| **PLATFORM ADMINISTRATOR ROUTES**| | | | | |
| `/admin/dashboard` | System Governance Console | `PLATFORM_ADMIN` | Metric Grid & Systems | Platform Health, Total Pilots, Active Departments, Evaluation Times, Storage Usage | System throughput gauges, database query telemetry |
| `/admin/users` | User & Role Management | `PLATFORM_ADMIN` | Paginated Data Table | Role Assignment, Department Affiliation, Account Status, Session Revocation | Role switcher toggle, password reset trigger |
| `/admin/departments` | Government Departments | `PLATFORM_ADMIN` | Master-Detail List | Ministry Hierarchies, State/District Mappings, Officer Rosters | Add/Edit Department modal |
| `/admin/rubrics` | Evaluation Rubric Templates | `PLATFORM_ADMIN` | Template Builder | Default Scoring Rubrics, Weight Checkers (100% validation), Category Presets | Drag-and-drop criterion reordering |
| `/admin/audit-logs` | Immutable Audit Trail | `PLATFORM_ADMIN` | Forensic Event Stream | Search by User, Entity, Time Range; View Pre/Post JSON Diffs, Verify Hash Chain | Cryptographic SHA-256 chain verification badge (`TAMPER_FREE`) |

---

## 3. Navigation & Breadcrumb Conventions

- Breadcrumbs are consistently rendered above the page title:
  `GovInnovate > Department of Urban Development > Challenges > UAQ-2026 > Applications > App #104`
- Global keyboard navigation:
  - `Cmd+K` or `Ctrl+K`: Opens Global Command Palette (Instant jump to any challenge, pilot, startup, or document).
  - `Esc`: Closes open drawers, modals, and preview panels.
  - `Tab`: Sequential focus across form controls with high-contrast indicator.
