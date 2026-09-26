# GovInnovate RESTful API Architecture Specification

## 1. Standards & Protocols

### 1.1 Base URL & Content Negotiation
- **Base Endpoint**: `/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Authentication**: `Authorization: Bearer <access_token>`
- **Idempotency**: Mutating financial or final submission endpoints accept `Idempotency-Key: <UUID>` header.

### 1.2 Unified Response Format

#### Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5
  },
  "timestamp": "2026-09-27T00:55:00.000Z"
}
```

#### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "An evaluation score has already been submitted for this assignment.",
    "details": [
      { "field": "assignment_id", "issue": "Locked upon submission" }
    ]
  },
  "timestamp": "2026-09-27T00:55:00.000Z"
}
```

---

## 2. API Endpoints by Domain

### 2.1 Authentication & Profile (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | User login with email/password; returns JWT + refresh token cookie | Public | `{ "email": "officer@urban.gov.in", "password": "..." }` |
| `POST` | `/auth/refresh` | Exchange refresh token for fresh access token | Public (Cookie) | - |
| `POST` | `/auth/logout` | Revoke session and clear refresh token | Authenticated | - |
| `GET` | `/auth/me` | Fetch active user identity, role, and department context | Authenticated | - |
| `POST` | `/auth/register-startup` | Register startup account with DPIIT / incorporation details | Public | Startup registration payload |

### 2.2 Challenges Management (`/api/v1/challenges`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/challenges` | List challenges with pagination, department, status, and FTS filter | Public (Published) / Gov (All Dept) |
| `POST` | `/challenges` | Create new challenge draft | `GOVERNMENT_OFFICER` |
| `GET` | `/challenges/:id` | Get challenge full details, rubric, and scope | Public / Authenticated |
| `PUT` | `/challenges/:id` | Update draft challenge | `GOVERNMENT_OFFICER` (Owner) |
| `POST` | `/challenges/:id/submit-review` | Submit challenge for procurement compliance review | `GOVERNMENT_OFFICER` |
| `POST` | `/challenges/:id/publish` | Approve and publish challenge live | `PROCUREMENT_OFFICER` |
| `POST` | `/challenges/:id/close` | Close applications manually or schedule early close | `GOVERNMENT_OFFICER` |

### 2.3 AI Assistance Engine (`/api/v1/challenges/ai-assist`)

| Method | Endpoint | Description | Auth / Role | Request Payload |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/challenges/ai-assist/structure-problem` | Refine raw civic issue into structured problem & objectives | `GOVERNMENT_OFFICER` | `{ "rawText": "Air in city is dirty, citizen complaints..." }` |
| `POST` | `/challenges/ai-assist/suggest-kpis` | Recommend quantifiable KPIs, units, baselines, and data sources | `GOVERNMENT_OFFICER` | `{ "problemStatement": "...", "industry": "IoT CleanTech" }` |
| `POST` | `/challenges/ai-assist/review-draft` | Identify ambiguities or missing procurement specifications | `GOVERNMENT_OFFICER` | Challenge draft object |

*All AI responses return `{ "suggestion": { ... }, "disclaimer": "AI-generated suggestion — verify before publishing." }`*

### 2.4 Applications & Eligibility Screening (`/api/v1/applications`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/challenges/:id/applications` | List applications for a challenge (blind mode strips company names) | `GOVERNMENT_OFFICER`, `PROCUREMENT_OFFICER` |
| `POST` | `/challenges/:id/applications` | Submit application proposal | `STARTUP` |
| `GET` | `/applications/:id` | Get application details (role-scoped) | `STARTUP` (Owner), `GOVERNMENT_OFFICER` |
| `POST` | `/applications/:id/eligibility` | Record formal eligibility screening decision & checklist | `GOVERNMENT_OFFICER` |
| `POST` | `/applications/:id/request-clarification` | Request applicant clarification on specific criteria | `GOVERNMENT_OFFICER` |
| `POST` | `/applications/:id/respond-clarification` | Provide clarification answers & documents | `STARTUP` |

### 2.5 Expert Evaluations & Blind Scoring (`/api/v1/evaluations`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/challenges/:id/assign-experts` | Assign expert evaluators to shortlisted proposals | `GOVERNMENT_OFFICER` |
| `GET` | `/evaluations/my-assignments` | List proposals assigned to logged-in expert | `EXPERT_EVALUATOR` |
| `POST` | `/evaluations/:assignmentId/declare-coi` | Submit Conflict of Interest declaration (required to view proposal) | `EXPERT_EVALUATOR` |
| `GET` | `/evaluations/:assignmentId/proposal` | View proposal text (anonymized if blind evaluation is active) | `EXPERT_EVALUATOR` (Post-COI only) |
| `POST` | `/evaluations/:assignmentId/submit` | Submit finalized rubric scores and justifications (locks record) | `EXPERT_EVALUATOR` |
| `GET` | `/challenges/:id/evaluation-consensus` | View consolidated inter-rater matrix and average scores | `GOVERNMENT_OFFICER`, `PROCUREMENT_OFFICER` |
| `POST` | `/challenges/:id/shortlist` | Finalize application shortlisting for pilot contract | `GOVERNMENT_OFFICER` |

### 2.6 Pilots & Operational Execution (`/api/v1/pilots`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/pilots` | Instantiate new pilot from shortlisted application | `GOVERNMENT_OFFICER` |
| `GET` | `/pilots` | List pilots with department, status, risk, and geospatial filters | Authenticated |
| `GET` | `/pilots/:id` | Get complete pilot details (milestones, KPIs, status, budget) | Authenticated (Scoped) |
| `PUT` | `/pilots/:id/status` | Update pilot execution status (`ACTIVE`, `PAUSED`, `COMPLETED`) | `GOVERNMENT_OFFICER` |
| `GET` | `/pilots/:id/summary-metrics` | Get burndown, KPI achievement %, and milestone health | Authenticated |

### 2.7 Pilot Milestones (`/api/v1/pilots/:id/milestones`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/pilots/:id/milestones` | List all milestones with deliverable checklist and status | Authenticated |
| `POST` | `/pilots/:id/milestones/:mId/submit` | Submit completed milestone deliverables and notes | `STARTUP` |
| `POST` | `/pilots/:id/milestones/:mId/review` | Approve or reject milestone with audit comments | `GOVERNMENT_OFFICER` |

### 2.8 KPIs & Time-Series Measurements (`/api/v1/pilots/:id/kpis`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/pilots/:id/kpis` | List all configured KPIs (baseline, current, target) | Authenticated |
| `POST` | `/pilots/:id/kpis` | Define a new pilot KPI | `GOVERNMENT_OFFICER` |
| `POST` | `/pilots/:id/kpis/:kpiId/measurements` | Ingest a new time-series measurement record | `STARTUP` (or Sensor Ingestion Agent) |
| `GET` | `/pilots/:id/kpis/:kpiId/history` | Query historical time-series measurements for charting | Authenticated |

### 2.9 Evidence & File Uploads (`/api/v1/pilots/:id/evidence` & `/api/v1/uploads`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/uploads/presigned-url` | Generate pre-signed PUT URL with MIME & size validation | Authenticated |
| `POST` | `/uploads/confirm` | Confirm upload, compute SHA-256 hash, and register document | Authenticated |
| `GET` | `/pilots/:id/evidence` | List all evidence items linked to milestones or KPIs | Authenticated |
| `POST` | `/pilots/:id/evidence` | Link an uploaded file as evidence with description | `STARTUP` |
| `POST` | `/pilots/:id/evidence/:evidenceId/verify` | Mark evidence as `VERIFIED` or `REJECTED` with audit notes | `INDEPENDENT_VALIDATOR` |

### 2.10 Risks & Issues Management (`/api/v1/pilots/:id/risks` & `issues`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/pilots/:id/risks` | List pilot risks with computed risk score matrix | Authenticated |
| `POST` | `/pilots/:id/risks` | Register a new risk and mitigation strategy | `GOVERNMENT_OFFICER`, `STARTUP` |
| `PUT` | `/pilots/:id/risks/:riskId` | Update risk status or mitigation plan | `GOVERNMENT_OFFICER`, `STARTUP` |
| `GET` | `/pilots/:id/issues` | List open/resolved operational issues | Authenticated |
| `POST` | `/pilots/:id/issues` | Log an operational issue | `GOVERNMENT_OFFICER`, `STARTUP` |
| `PATCH` | `/pilots/:id/issues/:issueId/resolve` | Mark issue resolved with resolution summary | `GOVERNMENT_OFFICER`, `STARTUP` |

### 2.11 Document Management & Data/IP Governance (`/api/v1/pilots/:id/documents`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/pilots/:id/documents` | List legal documents, NDAs, and pilot agreements | Authenticated |
| `POST` | `/pilots/:id/documents` | Upload new version of a legal agreement | `GOVERNMENT_OFFICER`, `PROCUREMENT_OFFICER` |
| `GET` | `/pilots/:id/governance` | Fetch Data Owner, Processor, Access, and IP terms | Authenticated |
| `PUT` | `/pilots/:id/governance` | Update Data & IP terms (standard templates) | `PROCUREMENT_OFFICER` |

### 2.12 Milestone Payments (`/api/v1/payments`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/payments` | Query payments across pilots (Pending, Approved, Paid) | `PROCUREMENT_OFFICER`, `ADMIN` |
| `POST` | `/payments/:id/approve` | Authorize milestone disbursement | `PROCUREMENT_OFFICER` |
| `POST` | `/payments/:id/disburse` | Execute mock disbursement (records transaction reference) | `PROCUREMENT_OFFICER` |

### 2.13 Independent Validation Studio (`/api/v1/pilots/:id/validation`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/pilots/:id/validation` | View validation report status, findings, and outcome | Authenticated |
| `POST` | `/pilots/:id/validation` | Submit formal validation report (`VALIDATED`, `PARTIALLY`, `NOT`) | `INDEPENDENT_VALIDATOR` |

### 2.14 Scale-Up Decisions & Proven Solutions (`/api/v1/scale-up` & `/proven-solutions`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/pilots/:id/scale-up` | Record scale-up outcome: Scale, Extend, Retest, Close | `GOVERNMENT_OFFICER`, `PROCUREMENT_OFFICER` |
| `GET` | `/proven-solutions` | Browse public directory of successfully validated pilots | Public |
| `GET` | `/proven-solutions/:id` | Detailed case study with verified KPIs & procurement specs | Public |

### 2.15 3D Spatial Scene & Telemetry Feed (`/api/v1/3d-scene-data`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/3d-scene-data/city-network` | Returns nodes and connections for the Landing Architectural City scene | Public |
| `GET` | `/3d-scene-data/ecosystem-pipeline` | Returns volumetric pipeline stages with active volume counts | Authenticated |
| `GET` | `/3d-scene-data/pilots-geo` | Returns geospatial lat/long, sensor status, and risk level for pilot pins | Authenticated |

### 2.16 Audit Logs & System Governance (`/api/v1/audit-logs`)

| Method | Endpoint | Description | Auth / Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/audit-logs` | Query tamper-evident event stream with entity and user filters | `PLATFORM_ADMIN` |
| `GET` | `/audit-logs/verify-chain` | Cryptographically verify SHA-256 hash continuity of logs | `PLATFORM_ADMIN` |
