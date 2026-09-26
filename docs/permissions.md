# GovInnovate Role-Based Access Control (RBAC) & Permissions Matrix

## 1. Overview & Security Principles

GovInnovate enforces strict Role-Based Access Control (RBAC) combined with Entity-Level and Attribute-Level Access Controls (ABAC). In public procurement and government pilot management, ensuring that data is partitioned, evaluations remain uninfluenced, and financial approvals adhere to the principle of least privilege is paramount.

### Core Security Tenets
1. **Blind Evaluation Guardrail**: Evaluators are strictly prevented from viewing identifying startup metadata (when blind scoring is active) and cannot access evaluations submitted by peer experts until their own score is formally locked and submitted.
2. **Conflict of Interest (COI) Gate**: An evaluator cannot view technical proposals or score sheets without submitting an explicit COI declaration.
3. **Tenant & Data Isolation**: Startups can only access their own submissions, proprietary documents, and pilot data. Competing proposals and bids are strictly inaccessible.
4. **Segregation of Duties (SoD)**: The Government Officer who approves milestone deliverables cannot single-handedly disburse public funds; financial disbursements require independent authorization from a Procurement Officer.
5. **Validator Independence**: Independent Validators possess read-only access to operational pilot data, sensor feeds, and submitted evidence, and write access only to the formal Validation Report.
6. **Immutable Audit Trail**: Audit records are write-once, append-only, and read-accessible exclusively by Platform Administrators and Compliance Auditors.

---

## 2. Platform Roles Definition

| Role Key | Name | Primary Responsibility | Organizational Scope |
| :--- | :--- | :--- | :--- |
| `GOVERNMENT_OFFICER` | Government Officer | Problem definition, challenge management, eligibility screening, pilot oversight, milestone approvals | Own Department |
| `PROCUREMENT_OFFICER` | Procurement Officer | Legal compliance review, tender publication, financial milestone payment release, procurement scale-up | Department / Ministry |
| `STARTUP` | Startup / Innovator | Challenge discovery, application submission, pilot milestone delivery, evidence submission, payment tracking | Own Organization |
| `EXPERT_EVALUATOR` | Expert Evaluator | Technical feasibility analysis, rubric-based blind scoring, qualitative commentary | Assigned Applications |
| `INDEPENDENT_VALIDATOR`| Independent Validator | Objective KPI measurement verification, methodology audit, validation report generation | Assigned Pilots |
| `PLATFORM_ADMIN` | Platform Administrator| User provisioning, department taxonomy, rubric templates, system health, audit log inspection | Global Platform |

---

## 3. Entity Permissions Matrix

Legend:
- **C**: Create
- **R**: Read (All records within scope)
- **R_OWN**: Read only records owned by/assigned to user's organization
- **R_BLIND**: Read with sensitive/identifying fields masked
- **U**: Update
- **U_OWN**: Update only records owned by user's organization
- **D**: Delete (or Soft Delete)
- **-**: No Access

| Entity / Domain | Government Officer | Procurement Officer | Startup | Expert Evaluator | Independent Validator | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Departments** | R | R | R | R | R | C / R / U / D |
| **Organizations / Startups** | R | R | C / R_OWN / U_OWN | R_BLIND | R_OWN | C / R / U |
| **Challenges (Draft)** | C / R_OWN / U_OWN / D | R_OWN | - | - | - | R |
| **Challenges (Published)** | R | R | R (Public) | R | R | R / U |
| **Applications (Draft)** | - | - | C / R_OWN / U_OWN / D | - | - | - |
| **Applications (Submitted)** | R (Dept) | R (Dept) | R_OWN | R_BLIND (Assigned) | - | R |
| **Eligibility Reviews** | C / R / U | R | R_OWN (Result only) | - | - | R |
| **COI Declarations** | R (Status only) | - | - | C / R_OWN | - | R |
| **Evaluation Scores** | R (Aggregated) | R (Aggregated) | - | C / R_OWN / U_OWN (Prior to submit) | - | R |
| **Pilots** | C / R_OWN / U_OWN | R_OWN | R_OWN | - | R (Assigned) | R |
| **Pilot Milestones** | R_OWN / U (Approve) | R_OWN | R_OWN / U (Submit) | - | R (Assigned) | R |
| **KPI Definitions** | C / R_OWN / U_OWN | R_OWN | R_OWN | - | R (Assigned) | R |
| **KPI Measurements** | R_OWN | R_OWN | C / R_OWN / U_OWN | - | R (Assigned) | R |
| **Evidence Records** | R_OWN | R_OWN | C / R_OWN / U_OWN | - | R / U (Verify) | R |
| **Risks & Issues** | C / R_OWN / U_OWN | R_OWN | C / R_OWN / U_OWN | - | R (Assigned) | R |
| **Legal Documents** | C / R_OWN / U_OWN | C / R_OWN / U_OWN | R_OWN / U (Sign) | - | R (Assigned) | R |
| **Payments** | R_OWN / U (Request) | R_OWN / U (Approve/Pay)| R_OWN (Status) | - | - | R |
| **Validation Reports** | R_OWN | R_OWN | R_OWN (Result) | - | C / R_OWN / U_OWN | R |
| **Scale-up Decisions** | C / R_OWN / U_OWN | R_OWN / U (Concur) | R_OWN (Result) | - | R (Assigned) | R |
| **Proven Solutions** | C / R / U | R | R (Public) | R | R | C / R / U / D |
| **Audit Logs** | - | - | - | - | - | R (Read-Only) |

---

## 4. State Machine Transition Authorization Matrix

Enforces which specific role possesses the authority to move an entity between lifecycle states:

### 4.1 Challenge Lifecycle
```
DRAFT -> UNDER_REVIEW -> PUBLISHED -> APPLICATIONS_CLOSED -> SHORTLISTED -> PILOT_ACTIVE -> COMPLETED -> ARCHIVED
```
- `DRAFT -> UNDER_REVIEW`: **Government Officer** (Initiator).
- `UNDER_REVIEW -> PUBLISHED`: **Procurement Officer** (Verifies legal compliance).
- `PUBLISHED -> APPLICATIONS_CLOSED`: **System Scheduler** (Triggered upon deadline expiry) or **Government Officer** (Manual early close with justification).
- `APPLICATIONS_CLOSED -> SHORTLISTED`: **Government Officer** (Following completion of expert scoring).
- `SHORTLISTED -> PILOT_ACTIVE`: **Government Officer** & **Procurement Officer** (Contract execution).
- `PILOT_ACTIVE -> COMPLETED`: **Government Officer** (All milestones & validations concluded).
- `COMPLETED -> ARCHIVED`: **Platform Admin** or **Government Officer**.

### 4.2 Application Lifecycle
```
DRAFT -> SUBMITTED -> UNDER_ELIGIBILITY -> ELIGIBLE / INELIGIBLE -> UNDER_EVALUATION -> SHORTLISTED / NOT_SELECTED -> PILOT_AWARDED
```
- `DRAFT -> SUBMITTED`: **Startup** (Applicant).
- `SUBMITTED -> UNDER_ELIGIBILITY`: **Government Officer** (Starts formal screening).
- `UNDER_ELIGIBILITY -> ELIGIBLE / INELIGIBLE`: **Government Officer** (Records checklist justification).
- `ELIGIBLE -> UNDER_EVALUATION`: **Government Officer** (Assigns expert panel).
- `UNDER_EVALUATION -> SHORTLISTED / NOT_SELECTED`: **Government Officer** (Review of combined expert scores).
- `SHORTLISTED -> PILOT_AWARDED`: **Government Officer** & **Procurement Officer**.

### 4.3 Pilot Milestone Lifecycle
```
NOT_STARTED -> IN_PROGRESS -> SUBMITTED -> UNDER_REVIEW -> APPROVED / REJECTED -> OVERDUE
```
- `NOT_STARTED -> IN_PROGRESS`: **Startup** (Commences work).
- `IN_PROGRESS -> SUBMITTED`: **Startup** (Uploads deliverables and logs metrics).
- `SUBMITTED -> UNDER_REVIEW`: **Government Officer** or **Independent Validator**.
- `UNDER_REVIEW -> APPROVED`: **Government Officer** (Validates deliverables; triggers payment request).
- `UNDER_REVIEW -> REJECTED`: **Government Officer** (With explicit rework comments).
- `* -> OVERDUE`: **System Scheduler** (Triggered when `NOW() > deadline` and status is not `APPROVED`).

### 4.4 Milestone Payment Lifecycle
```
NOT_DUE -> PENDING_APPROVAL -> APPROVED -> PROCESSING -> PAID / FAILED
```
- `NOT_DUE -> PENDING_APPROVAL`: **System** (Automatically triggered when Milestone becomes `APPROVED`).
- `PENDING_APPROVAL -> APPROVED`: **Procurement Officer** (Authorizes expenditure against budget).
- `APPROVED -> PROCESSING`: **Procurement Officer** / **Treasury Gateway**.
- `PROCESSING -> PAID`: **Procurement Officer** (Records disbursement reference/transaction hash).

### 4.5 Independent Validation Lifecycle
```
ASSIGNED -> IN_REVIEW -> VALIDATED / PARTIALLY_VALIDATED / NOT_VALIDATED
```
- `ASSIGNED -> IN_REVIEW`: **Independent Validator** (Commences audit).
- `IN_REVIEW -> VALIDATED / PARTIALLY_VALIDATED / NOT_VALIDATED`: **Independent Validator** (Submits signed report).

### 4.6 Scale-Up Decision Lifecycle
```
PENDING_REVIEW -> SCALE / EXTEND_PILOT / MODIFY_AND_RETEST / CLOSE
```
- Decided by **Government Officer** in consensus with **Procurement Officer** based on validated findings.

---

## 5. Field-Level & Attribute Security Rules

1. **Blind Scoring Masking**:
   - When `challenges.blind_evaluation = TRUE`, the following fields are stripped from the payload delivered to `EXPERT_EVALUATOR`:
     - `organizations.legal_name`
     - `organizations.trade_name`
     - `organizations.registration_number`
     - `applications.team_overview` (identifying names)
     - `applications.past_experience` (client names)
   - Evaluator receives an anonymized surrogate key: `Applicant #A-104`.
2. **Co-Evaluator Score Confidentiality**:
   - `evaluation_assignments` and `evaluation_scores` submitted by Evaluator A are completely hidden from Evaluator B until the evaluation window is officially closed and finalized by the Government Officer.
3. **Financial Authorization Isolation**:
   - A `GOVERNMENT_OFFICER` has read-only access to `payments.status` and cannot execute `PATCH /api/payments/:id/approve` or `PATCH /api/payments/:id/disburse`. Attempts trigger HTTP 403 Forbidden.
4. **Validator Non-Interference**:
   - An `INDEPENDENT_VALIDATOR` cannot edit `pilot_milestones.status` or `kpis.current_value`. They may only flag evidence as `VERIFIED` or `REJECTED` and provide commentary in their own `validation_reports`.

---

## 6. Audit Trail Enforcement

- Every RBAC check occurs at the backend route handler middleware.
- Any access violation (HTTP 401 or 403) is written to security telemetry logs with client IP, attempted URI, and JWT subject.
- All successful state transitions automatically invoke `AuditLogService.record(...)`, capturing before and after states with SHA-256 hash chaining.
