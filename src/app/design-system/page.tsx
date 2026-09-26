"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  StatusBadge,
  GovStatus,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumb,
  Stepper,
  Timeline,
  Progress,
  KPICard,
  ChartContainer,
  FileUpload,
  DatePicker,
  FilterBar,
  Pagination,
  EmptyState,
  LoadingState,
  Skeleton,
  TableSkeletonRows,
  ErrorState,
  ConfirmationDialog,
  useToast,
  Tooltip,
} from "@/components/ui";

import {
  InnovationCity,
  InnovationPipeline,
  PilotEnvironment,
  PilotMap,
} from "@/components/3d";

import {
  ShieldCheck,
  Send,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
} from "lucide-react";

export default function DesignSystemShowcasePage() {
  const { showToast } = useToast();

  // Component state toggles
  const [activeStep, setActiveStep] = useState(2);
  const [radioVal, setRadioVal] = useState("direct");
  const [switchVal, setSwitchVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSearch, setFilterSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    dept: "urban",
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const colors = [
    { name: "Background", hex: "#F7F8FA", bg: "bg-[#F7F8FA]", border: "border-slate-300", text: "text-slate-900" },
    { name: "Primary", hex: "#163A5F", bg: "bg-[#163A5F]", text: "text-white" },
    { name: "Accent Blue", hex: "#2563EB", bg: "bg-[#2563EB]", text: "text-white" },
    { name: "Success", hex: "#15803D", bg: "bg-[#15803D]", text: "text-white" },
    { name: "Warning", hex: "#B45309", bg: "bg-[#B45309]", text: "text-white" },
    { name: "Danger", hex: "#B91C1C", bg: "bg-[#B91C1C]", text: "text-white" },
    { name: "Text", hex: "#172033", bg: "bg-[#172033]", text: "text-white" },
    { name: "Muted", hex: "#667085", bg: "bg-[#667085]", text: "text-white" },
    { name: "Border", hex: "#D9DEE7", bg: "bg-[#D9DEE7]", text: "text-slate-900" },
    { name: "Dark Surface", hex: "#111827", bg: "bg-[#111827]", text: "text-white" },
  ];

  const typography = [
    { level: "Display", size: "text-4xl (36px)", weight: "font-extrabold", sample: "GovInnovate Operating System" },
    { level: "H1", size: "text-3xl (30px)", weight: "font-bold", sample: "Urban Air Quality Hyperlocal Pilot" },
    { level: "H2", size: "text-2xl (24px)", weight: "font-bold", sample: "Procurement & Milestone Payment Queue" },
    { level: "H3", size: "text-lg (18px)", weight: "font-semibold", sample: "Active Innovation Pilots Oversight" },
    { level: "Body", size: "text-sm (14px)", weight: "font-normal", sample: "Municipal wards in central Lucknow suffer from localized particulate spikes." },
    { level: "Caption", size: "text-xs (12px)", weight: "font-medium", sample: "Empirically verified by Independent Validator on 2026-07-29" },
    { level: "Metadata", size: "text-[10px] (10px)", weight: "font-mono", sample: "HASH: sha256_91823abce12893812839120938102381" },
  ];

  const statuses: GovStatus[] = [
    "DRAFT",
    "UNDER_REVIEW",
    "PUBLISHED",
    "APPLICATIONS_CLOSED",
    "SUBMITTED",
    "ELIGIBLE",
    "CONDITIONALLY_ELIGIBLE",
    "INELIGIBLE",
    "UNDER_EVALUATION",
    "SHORTLISTED",
    "PILOT_AWARDED",
    "ACTIVE",
    "PAUSED",
    "APPROVED",
    "REJECTED",
    "OVERDUE",
    "VALIDATED",
    "PARTIALLY_VALIDATED",
    "NOT_VALIDATED",
    "PAID",
    "SCALE",
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="border-b border-gov-border pb-6 text-left">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="default" className="bg-gov-primary font-mono text-[10px]">
            GOVINNOVATE DESIGN SYSTEM v1.0
          </Badge>
          <span className="text-xs text-gov-muted">Enterprise GovTech Design Language</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gov-primary tracking-tight">
          Visual Foundations & Component Library
        </h1>
        <p className="text-sm text-gov-muted max-w-3xl mt-1 leading-relaxed">
          A disciplined, institutional design system crafted for public procurement accountability, evidence-based pilot management, and data-dense operational dashboards. Eliminates generic AI SaaS styling, unnecessary glassmorphism, and excessive card clutter.
        </p>
      </div>

      {/* SECTION 1: FOUNDATIONS (Colors, Typography, Radii, Shadows) */}
      <section className="space-y-8 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            1. Design Tokens & Foundations
          </h2>
          <p className="text-xs text-gov-muted mt-1">Official color tokens, typography hierarchy, border radiuses, and shadow scales.</p>
        </div>

        {/* Color Palette */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Color System</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {colors.map((c) => (
              <div key={c.name} className="border border-gov-border rounded-card bg-white p-3 shadow-2xs">
                <div className={`h-12 w-full rounded-control ${c.bg} ${c.border || ""} shadow-inner mb-2`} />
                <p className="text-xs font-bold text-slate-800 leading-tight">{c.name}</p>
                <p className="text-[10px] font-mono text-gov-muted mt-0.5">{c.hex}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Scale */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Typography Scale (Inter)</h3>
          <div className="border border-gov-border rounded-card bg-white overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Scale Level</TableHead>
                  <TableHead className="w-36">Size & Weight</TableHead>
                  <TableHead>Sample Rendering</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typography.map((t) => (
                  <TableRow key={t.level}>
                    <TableCell className="font-semibold text-xs text-gov-primary">{t.level}</TableCell>
                    <TableCell className="font-mono text-xs text-gov-muted">{t.size}</TableCell>
                    <TableCell>
                      <span className={`${t.size.split(" ")[0]} ${t.weight} text-slate-900 truncate block`}>
                        {t.sample}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Radii & Shadows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Border Radius System</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-[8px]">
                <span className="font-semibold">Control Radius: 8px</span>
                <span className="font-mono text-gov-muted">Buttons, Inputs, Badges, Tabs</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-[12px]">
                <span className="font-semibold">Card Radius: 12px</span>
                <span className="font-mono text-gov-muted">Cards, Panels, Tables, Drawers</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-[16px]">
                <span className="font-semibold">Container Radius: 16px</span>
                <span className="font-mono text-gov-muted">Modals, Dialogs, Outer Shells</span>
              </div>
            </div>
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Shadow Scale</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-control shadow-2xs">
                <span className="font-semibold">Shadow 2xs / Subtle:</span> Buttons, data rows, chips
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-control shadow-sm">
                <span className="font-semibold">Shadow sm:</span> Enterprise cards, overview widgets
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-control shadow-md">
                <span className="font-semibold">Shadow md:</span> Modals, dropdown popovers, notifications
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FORM CONTROLS & INPUTS */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            2. Form Controls & Interactive Inputs
          </h2>
          <p className="text-xs text-gov-muted mt-1">Full state coverage: default, hover, focus, disabled, loading, and error states.</p>
        </div>

        {/* Buttons Grid */}
        <div className="border border-gov-border rounded-card bg-white p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Button Component Variants & Sizes</h3>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Button variant="default">Primary Default</Button>
            <Button variant="accent">Accent Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success Action</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Text Link</Button>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center pt-2 border-t border-slate-100">
            <Button size="sm" variant="default">Small (sm)</Button>
            <Button size="default" variant="default">Default</Button>
            <Button size="lg" variant="default">Large (lg)</Button>
            <Button variant="default" isLoading>Processing...</Button>
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              With Left Icon
            </Button>
            <Button variant="default" rightIcon={<Send className="w-4 h-4" />}>
              With Right Icon
            </Button>
            <Button variant="default" disabled>Disabled State</Button>
          </div>
        </div>

        {/* Inputs, Textarea, Select Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Text Inputs</h3>
            <Input label="Standard Input" placeholder="Enter department name" helperText="Official title under state gazette" />
            <Input label="With Left Icon" leftIcon={<Search className="w-4 h-4" />} placeholder="Search challenge code..." />
            <Input label="Error State" defaultValue="invalid-code" error="Challenge code must follow pattern UAQ-YYYY-XXX" />
            <Input label="Disabled State" disabled defaultValue="LKO-MUNICIPAL-LOCKED" />
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select & Textarea</h3>
            <Select
              label="Department Hierarchy"
              options={[
                { value: "urban", label: "Department of Urban Development" },
                { value: "health", label: "Public Health Department" },
                { value: "transport", label: "State Transport Authority" },
              ]}
            />
            <Textarea
              label="Problem Statement Formulation"
              placeholder="Describe civic failure, affected ward population, and operational bottleneck..."
              helperText="Minimum 50 characters required"
            />
            <Textarea
              label="Error State"
              error="Technical approach description is required"
              defaultValue="Short"
            />
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Toggles, Checks & Radios</h3>
            <Switch
              label="Blind Evaluation Masking"
              description="Mask applicant identities and company names from expert evaluators"
              checked={switchVal}
              onChange={setSwitchVal}
            />

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Checkbox
                label="Conflict of Interest Declaration"
                description="I certify no financial interest in applicant organizations"
                checked={checkboxVal}
                onChange={(e) => setCheckboxVal(e.target.checked)}
              />
              <Checkbox
                label="Disabled Checklist Item"
                description="Locked by administrative order"
                disabled
                checked
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-2">Procurement Route</span>
              <RadioGroup
                name="procurement-route"
                value={radioVal}
                onChange={setRadioVal}
                options={[
                  { value: "direct", label: "Direct Pilot Innovation Grant", description: "Up to ₹25 Lakhs per municipal pilot" },
                  { value: "challenge", label: "Open Competitive Challenge", description: "Multi-ward phased procurement" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* DatePicker & FileUpload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">DatePicker Component</h3>
            <DatePicker label="Application Deadline" defaultValue="2026-03-31" helperText="Tender window closes at 18:00 IST" />
            <DatePicker label="Evaluation Sign-off Date" error="Date cannot precede application deadline" defaultValue="2026-03-15" />
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">FileUpload & Checksum Generator</h3>
            <FileUpload
              label="Milestone Evidence File (Drag & Drop)"
              description="Upload PDF audit or CSV telemetry logs. Cryptographic SHA-256 computed on selection."
              onFileSelect={(file, hash) => {
                showToast({
                  type: "success",
                  title: "File Checksum Generated",
                  description: `${file.name}: ${hash.slice(0, 24)}...`,
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: STATUS BADGES & DATA FEEDBACK */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            3. Status Badges & Lifecycle Indicators
          </h2>
          <p className="text-xs text-gov-muted mt-1">Formal GovTech status pills with icons and accessibility dot indicators.</p>
        </div>

        <div className="border border-gov-border rounded-card bg-white p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">StatusBadge System (All 21 States)</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gov-muted font-medium mr-2">Small Size Variant:</span>
            <StatusBadge status="PUBLISHED" size="sm" />
            <StatusBadge status="ACTIVE" size="sm" />
            <StatusBadge status="UNDER_REVIEW" size="sm" />
            <StatusBadge status="REJECTED" size="sm" />
            <StatusBadge status="PAID" size="sm" />
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">KPICard Component</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard
              title="Ward Sensing Coverage"
              metricCode="WARD_COVERAGE_PCT"
              currentValue={86}
              baselineValue={35}
              targetValue={85}
              unit="%"
              trend="up"
              trendLabel="+51% Over Baseline"
              dataSource="Municipal GIS Buffer Analysis"
              isVerified
            />
            <KPICard
              title="Measurement Accuracy vs CPCB"
              metricCode="SENSOR_ACCURACY_R2"
              currentValue={95}
              baselineValue={82}
              targetValue={92}
              unit="%"
              trend="up"
              trendLabel="+13% Calibration Gain"
              dataSource="BAM-1020 Collocation Spot Check"
              isVerified
            />
            <KPICard
              title="Fleet Telemetry Uptime"
              metricCode="FLEET_UPTIME_PCT"
              currentValue={94}
              baselineValue={76}
              targetValue={90}
              unit="%"
              trend="up"
              trendLabel="High Fleet Availability"
              dataSource="Automated Telemetry Daemon"
              isVerified
            />
          </div>
        </div>

        {/* Progress & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Progress Bars</h3>
            <Progress value={75} label="Overall Pilot Progress (90 Days)" showValue variant="default" />
            <Progress value={95} label="KPI Realization (Accuracy)" showValue variant="success" />
            <Progress value={45} label="Budget Burn Rate" showValue variant="warning" />
            <Progress value={15} label="Remaining Time Window" showValue variant="danger" />
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Timeline Stream (Audit Trail)</h3>
            <Timeline
              events={[
                {
                  id: "t-1",
                  title: "Scale-up Procurement Authorized",
                  timestamp: "2026-07-30T15:00:00Z",
                  description: "Direct tender approved for 80 municipal wards.",
                  actor: "Rajesh Verma (Joint Director)",
                  status: "completed",
                },
                {
                  id: "t-2",
                  title: "Third-Party Validation Report Submitted",
                  timestamp: "2026-07-29T10:00:00Z",
                  description: "Outcome certified as VALIDATED with 95% accuracy.",
                  actor: "Priya Nair (TERI Auditor)",
                  status: "completed",
                },
                {
                  id: "t-3",
                  title: "Milestone 3 Deliverables Under Final Review",
                  timestamp: "2026-07-28T16:00:00Z",
                  description: "Deliverables checklist undergoing verification.",
                  actor: "AirSense Technologies",
                  status: "current",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: NAVIGATION & FLOW CONTROLS */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            4. Navigation & Flow Controls
          </h2>
          <p className="text-xs text-gov-muted mt-1">Breadcrumbs, multi-step wizards, tabbed panels, and pagination.</p>
        </div>

        {/* Stepper Component */}
        <div className="border border-gov-border rounded-card bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Stepper Component (7-Step Challenge Wizard)
            </h3>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous Step
              </Button>
              <Button
                size="sm"
                variant="default"
                disabled={activeStep === 6}
                onClick={() => setActiveStep(activeStep + 1)}
              >
                Next Step
              </Button>
            </div>
          </div>

          <Stepper
            activeStep={activeStep}
            onStepClick={setActiveStep}
            steps={[
              { id: 1, title: "Problem", description: "Civic bottleneck" },
              { id: 2, title: "Outcomes", description: "Quantifiable goals" },
              { id: 3, title: "Specs", description: "Sensor & hardware" },
              { id: 4, title: "Pilot Design", description: "Wards & duration" },
              { id: 5, title: "Eligibility", description: "DPIIT & criteria" },
              { id: 6, title: "Rubrics", description: "Weighted criteria" },
              { id: 7, title: "Review", description: "Sign-off & publish" },
            ]}
          />
        </div>

        {/* Breadcrumb & Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Breadcrumb Component</h3>
            <Breadcrumb
              items={[
                { label: "Department of Urban Development", href: "/gov/dashboard" },
                { label: "Challenges", href: "/challenges" },
                { label: "UAQ-LKO-2026", href: "/challenges/UAQ-LKO-2026" },
                { label: "Pilot #01 Oversight" },
              ]}
            />
          </div>

          <div className="border border-gov-border rounded-card bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tabs Component</h3>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Pilot Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones (3)</TabsTrigger>
                <TabsTrigger value="kpis">KPIs & Sensor Feeds</TabsTrigger>
                <TabsTrigger value="validation">Validation Report</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-3 bg-slate-50 border border-slate-200 rounded-control text-xs text-gov-muted">
                Showing pilot overview, Lucknow ward coordinates, and AirSense team roster.
              </TabsContent>
              <TabsContent value="milestones" className="p-3 bg-slate-50 border border-slate-200 rounded-control text-xs text-gov-muted">
                3 Milestones: ₹6L (Approved), ₹8L (Approved), ₹8L (Under Review).
              </TabsContent>
              <TabsContent value="kpis" className="p-3 bg-slate-50 border border-slate-200 rounded-control text-xs text-gov-muted">
                Time-series telemetry feed displaying PM2.5, PM10, temperature, and fleet uptime.
              </TabsContent>
              <TabsContent value="validation" className="p-3 bg-slate-50 border border-slate-200 rounded-control text-xs text-gov-muted">
                Formal TERI audit report certifying 95% BAM-1020 correlation.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* FilterBar & Pagination */}
        <div className="border border-gov-border rounded-card bg-white p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">FilterBar & Pagination Components</h3>
          <FilterBar
            searchValue={filterSearch}
            onSearchChange={setFilterSearch}
            activeFilters={activeFilters}
            onFilterChange={(k, v) => setActiveFilters((prev) => ({ ...prev, [k]: v }))}
            onResetFilters={() => {
              setFilterSearch("");
              setActiveFilters({});
            }}
            filters={[
              {
                key: "dept",
                label: "Department",
                options: [
                  { value: "urban", label: "Urban Development" },
                  { value: "health", label: "Public Health" },
                ],
              },
              {
                key: "status",
                label: "Status",
                options: [
                  { value: "active", label: "Active Pilots" },
                  { value: "completed", label: "Completed" },
                ],
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={4}
            totalItems={38}
            itemsPerPage={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* SECTION 5: OVERLAYS & DIALOGS */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            5. Overlays, Drawers & Dialogs
          </h2>
          <p className="text-xs text-gov-muted mt-1">Accessible modal dialogs, slide-out drawers, tooltips, and toast triggers.</p>
        </div>

        <div className="border border-gov-border rounded-card bg-white p-6 shadow-2xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Modal Dialog */}
            <Modal>
              <ModalTrigger asChild>
                <Button variant="default" className="w-full">
                  Open Standard Modal
                </Button>
              </ModalTrigger>
              <ModalContent size="md">
                <ModalHeader>
                  <ModalTitle>Add Evaluation Criterion</ModalTitle>
                  <ModalDescription>Define a weighted criterion for challenge assessment</ModalDescription>
                </ModalHeader>
                <div className="space-y-3 py-2 text-xs">
                  <Input label="Criterion Name" placeholder="e.g. Edge Calibration Stability" />
                  <Input label="Weight Percentage" type="number" defaultValue="15" helperText="Total rubric must sum to 100%" />
                  <Textarea label="Scoring Guidance" placeholder="Describe expectations for maximum score..." />
                </div>
                <ModalFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="default">Save Criterion</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Slide-out Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full">
                  Open Slide Drawer
                </Button>
              </DrawerTrigger>
              <DrawerContent width="md">
                <DrawerHeader>
                  <DrawerTitle>Proposal Document Preview</DrawerTitle>
                  <DrawerDescription>Applicant #APP-2026-UAQ-001 (Identity Masked)</DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-control">
                      <span className="font-semibold block text-slate-800">Executive Summary</span>
                      <p className="text-gov-muted mt-1 leading-relaxed">
                        Deployment of 40 calibrated laser particle monitors across Lucknow municipal wards with automated regression against reference CPCB stations.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-control">
                      <span className="font-semibold block text-slate-800">Technical Approach</span>
                      <p className="text-gov-muted mt-1 leading-relaxed">
                        Dual optical sensors per node with heated inlet to eliminate hygroscopic droplet distortion during high-humidity winter inversions.
                      </p>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button variant="outline">Close</Button>
                  <Button variant="default">Accept for Scoring</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
              open={isConfirmOpen}
              onOpenChange={setIsConfirmOpen}
              trigger={
                <Button variant="destructive" className="w-full">
                  Trigger Confirm Dialog
                </Button>
              }
              title="Authorize ₹8,00,000 Milestone Disbursement?"
              description="This action will release public treasury funds against certified Milestone 3 deliverables. This transaction is immutable and permanently recorded in the audit log."
              confirmLabel="Authorize Disbursement"
              onConfirm={() => {
                setIsConfirmOpen(false);
                showToast({
                  type: "success",
                  title: "Disbursement Authorized",
                  description: "₹8,00,000 released via mock transaction gateway.",
                });
              }}
            />

            {/* Tooltip Demonstration */}
            <Tooltip content="Central Pollution Control Board reference regulatory BAM-1020 monitor">
              <Button variant="secondary" className="w-full">
                Hover for Tooltip
              </Button>
            </Tooltip>
          </div>

          {/* Toast Notification Triggers */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700 block mb-2">Toast Notification System</span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                onClick={() =>
                  showToast({
                    type: "success",
                    title: "Milestone Deliverables Approved",
                    description: "Milestone 2 deliverable package certified by Government Officer.",
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
                onClick={() =>
                  showToast({
                    type: "warning",
                    title: "Approaching Application Deadline",
                    description: "Tender window closes in 48 hours for UAQ-LKO-2026.",
                  })
                }
              >
                Warning Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-300 text-red-800 bg-red-50 hover:bg-red-100"
                onClick={() =>
                  showToast({
                    type: "error",
                    title: "Access Denied (403 Forbidden)",
                    description: "Only Procurement Officers can authorize payment releases.",
                  })
                }
              >
                Error Toast
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100"
                onClick={() =>
                  showToast({
                    type: "info",
                    title: "Telemetry Sync Complete",
                    description: "Ingested 960 hourly readings from Lucknow sensor mesh.",
                  })
                }
              >
                Info Toast
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: STATE CONTAINERS */}
      <section className="space-y-6 text-left">
        <div>
          <h2 className="text-xl font-bold text-gov-primary flex items-center">
            <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
            6. State Containers & Layout Blocks
          </h2>
          <p className="text-xs text-gov-muted mt-1">Empty states, loading states, error banners, and operational chart containers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmptyState
            title="No Pending Clarifications"
            description="All submitted startup applications have answered department queries."
            actionLabel="View All Applications"
            onAction={() => showToast({ type: "info", title: "Navigating to Applications..." })}
          />

          <LoadingState
            label="Synchronizing Telemetry Records"
            subtext="Connecting to municipal IoT sensor cluster..."
          />

          <ErrorState
            title="Payment Gateway Timeout"
            errorCode="GATEWAY_504_TIMEOUT"
            message="Treasury mock gateway was unable to verify fund availability. Please retry."
            onRetry={() => showToast({ type: "info", title: "Retrying gateway connection..." })}
          />
        </div>

        {/* ChartContainer Demonstration */}
        <ChartContainer
          title="Air Quality Sensor Accuracy & Correlation vs. CPCB Station"
          description="Bi-weekly collocated R-squared correlation trend across Lucknow wards"
          footerNotes="Verified by TERI Environmental Auditor • BAM-1020 Reference Monitor"
          actionSlot={
            <Badge variant="success" className="text-xs">
              Correlation: 95.0%
            </Badge>
          }
        >
          <div className="w-full h-44 bg-slate-50 border border-slate-200 rounded-control flex flex-col items-center justify-center text-xs text-gov-muted p-4">
            <span className="font-semibold text-slate-700">Recharts Telemetry Area (Real Database Values)</span>
            <div className="flex items-center space-x-6 mt-3 text-[11px]">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-slate-400 mr-1.5" /> Baseline: 82.0%
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1.5" /> Current: 95.0%
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" /> Target: 92.0% (Exceeded)
              </span>
            </div>
          </div>
        </ChartContainer>
      </section>

      {/* SECTION 7: STRATEGIC 3D VISUALIZATION SYSTEM */}
      <section className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gov-primary flex items-center">
              <span className="w-2 h-5 bg-gov-accent rounded-sm mr-2.5" />
              7. Strategic 3D Visualization Suite
            </h2>
            <p className="text-xs text-gov-muted mt-1">
              Three.js, React Three Fiber & Drei implementations engineered strictly for institutional digital twins, evidence telemetry, and throughput funnels.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-blue-300 text-gov-accent bg-blue-50/60 font-mono text-[10px]">
              THREE.JS • R3F • DREI
            </Badge>
            <Badge variant="success" className="text-[10px]">
              REDUCED MOTION SAFE
            </Badge>
          </div>
        </div>

        {/* Design System Guidelines Alert */}
        <div className="bg-slate-50 border border-gov-border rounded-card p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-gov-primary font-bold">
            <Sparkles className="w-4 h-4 text-gov-accent" />
            <span>GovTech 3D Design Directives & Guardrails</span>
          </div>
          <p className="text-gov-muted leading-relaxed">
            3D is applied selectively: Landing hero, executive pipeline, district pilot maps, and collocated sensor validation environments. All forms, tables, audit trails, and legal procurement artifacts remain strictly 2D. Cyberpunk neon shaders, gratuitous particle emitters, and rapid camera rotations are prohibited. Every 3D canvas includes automatic viewport intersection observation (pauses frame loop when offscreen), <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">prefers-reduced-motion</code> detection, and an accessible 2D fallback.
          </p>
        </div>

        {/* Tabbed 3D Component Sandbox */}
        <Tabs defaultValue="city" className="w-full">
          <TabsList className="w-full max-w-2xl grid grid-cols-4 h-11">
            <TabsTrigger value="city" className="text-xs">
              InnovationCity
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs">
              InnovationPipeline
            </TabsTrigger>
            <TabsTrigger value="pilot-env" className="text-xs">
              PilotEnvironment
            </TabsTrigger>
            <TabsTrigger value="pilot-map" className="text-xs">
              PilotMap
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: InnovationCity */}
          <TabsContent value="city" className="space-y-4 mt-4">
            <div className="border border-gov-border rounded-card p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gov-primary">InnovationCity: Architectural Digital Twin</h3>
                  <p className="text-xs text-gov-muted">
                    Subtle daylight architectural geometry: State Secretariat, municipal departments, interconnected network arcs, and live pilot nodes.
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  &lt;InnovationCity /&gt;
                </Badge>
              </div>
              <InnovationCity height="h-96" />
            </div>
          </TabsContent>

          {/* Tab 2: InnovationPipeline */}
          <TabsContent value="pipeline" className="space-y-4 mt-4">
            <div className="border border-gov-border rounded-card p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gov-primary">InnovationPipeline: Volumetric Funnel</h3>
                  <p className="text-xs text-gov-muted">
                    3D pillar heights correspond to program volume: Challenges (12) → Startups (48) → Pilots (6) → Validated (4) → Scaled (3).
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  &lt;InnovationPipeline /&gt;
                </Badge>
              </div>
              <InnovationPipeline height="h-80" />
            </div>
          </TabsContent>

          {/* Tab 3: PilotEnvironment */}
          <TabsContent value="pilot-env" className="space-y-4 mt-4">
            <div className="border border-gov-border rounded-card p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gov-primary">PilotEnvironment: Hyperlocal Deployment Site</h3>
                  <p className="text-xs text-gov-muted">
                    Urban pilot deployment across Lucknow Wards (14, 18, 22, 29) with collocated sensor masts, PM2.5 readings, and threshold alerts.
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  &lt;PilotEnvironment /&gt;
                </Badge>
              </div>
              <PilotEnvironment height="h-80" />
            </div>
          </TabsContent>

          {/* Tab 4: PilotMap */}
          <TabsContent value="pilot-map" className="space-y-4 mt-4">
            <div className="border border-gov-border rounded-card p-4 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gov-primary">PilotMap: Regional Geospatial Terrain</h3>
                  <p className="text-xs text-gov-muted">
                    Interactive state-level terrain visualizing pilot clusters across Lucknow, Kanpur, and Noida with drilldown detail cards.
                  </p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  &lt;PilotMap /&gt;
                </Badge>
              </div>
              <PilotMap height="h-80" />
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
