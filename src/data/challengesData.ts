export interface ChallengeItem {
  id: string;
  code: string;
  title: string;
  department: string;
  state: string;
  district: string;
  location: string;
  category: string;
  technology: string[];
  budget: string;
  budgetNumeric: number;
  pilotDuration: string;
  durationDays: number;
  deadline: string;
  deadlineDate: string;
  daysRemaining: number;
  status: "OPEN" | "PILOT_ACTIVE" | "UNDER_EVALUATION" | "VALIDATED" | "CLOSED";
  statusLabel: string;
  statusVariant: "default" | "success" | "warning" | "danger" | "secondary";
  description: string;

  // Detail page fields
  problem: string;
  context: string;
  desiredOutcome: string;
  kpis: {
    name: string;
    baseline: string;
    target: string;
    instrument: string;
    weight: string;
  }[];
  eligibility: {
    registration: string;
    experience: string;
    certifications: string;
    team: string;
    financial: string;
    security: string;
  };
  requirements: {
    mandatory: string[];
    preferred: string[];
    integration: string;
  };
  pilotStructure: {
    milestone: string;
    timeline: string;
    deliverable: string;
    disbursement: string;
  }[];
  budgetBreakdown: {
    category: string;
    amount: string;
    share: string;
  }[];
  timeline: {
    phase: string;
    date: string;
    description: string;
    completed?: boolean;
    current?: boolean;
  }[];
  documents: {
    name: string;
    size: string;
    type: string;
    date: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  coordinates: [number, number, number];
}

export const CHALLENGES_DATA: ChallengeItem[] = [
  {
    id: "chal-air-001",
    code: "CHAL-UP-DUD-2026-001",
    title: "Urban Air Quality Hyperlocal Monitoring & Intervention Mesh",
    department: "Department of Urban Development",
    state: "Uttar Pradesh",
    district: "Lucknow",
    location: "Lucknow, Uttar Pradesh",
    category: "CleanTech & Environmental IoT",
    technology: ["IoT Sensors", "Laser Optical Counting", "LoRaWAN", "Edge Analytics", "GIS"],
    budget: "₹25,00,000",
    budgetNumeric: 2500000,
    pilotDuration: "90 Days",
    durationDays: 90,
    deadline: "31 March 2026",
    deadlineDate: "2026-03-31",
    daysRemaining: 4,
    status: "OPEN",
    statusLabel: "PROPOSALS OPEN",
    statusVariant: "default",
    description:
      "Deployment of 40 calibrated sensor nodes across 4 identified municipal wards to detect micro-dust hot spots and guide municipal dust-suppression trucks in real time.",
    problem:
      "Extreme localized particulate pollution (PM2.5 and PM10) creates respiratory emergencies in high-density urban wards. Current municipal monitoring relies on only 2 stationary CPCB stations across 110 square kilometers, failing to identify street-level canyon dispersion or construction plume dynamics.",
    context:
      "Municipal dust-suppression misting trucks are currently dispatched uniformly based on city-wide averages rather than real-time hyper-local air quality hot spots. Traditional stationary monitoring stations cost >₹1.2 Crore each and cannot provide the spatial granularity required for rapid municipal tactical intervention.",
    desiredOutcome:
      "Establish a high-density mesh network of 40 calibrated optical particle counting nodes providing 15-minute resolution GIS telemetry, achieving a 35% faster municipal response time to localized hazardous AQI spikes and a 20% reduction in peak resident exposure.",
    kpis: [
      {
        name: "Collocated Correlation with CPCB Reference Station",
        baseline: "35.0% correlation",
        target: "R² ≥ 0.92 correlation",
        instrument: "Collocated BAM-1020 Beta-Attenuation Monitor",
        weight: "35%",
      },
      {
        name: "Spatial Telemetry Coverage of Municipal Wards",
        baseline: "35.0% ward coverage",
        target: "85.0% continuous coverage",
        instrument: "Municipal GIS Shapefile Layer Verification",
        weight: "30%",
      },
      {
        name: "Telemetry Uptime & Anti-Fouling Reliability",
        baseline: "65.0% uptime",
        target: "≥ 95.0% hourly availability",
        instrument: "Automated Command Center Health Ping Log",
        weight: "20%",
      },
      {
        name: "Municipal Misting Dispatch Response Time",
        baseline: "4.5 hours latency",
        target: "≤ 45 minutes dispatch",
        instrument: "Integrated Command & Control Center (ICCC) Log",
        weight: "15%",
      },
    ],
    eligibility: {
      registration: "Registered Indian Private Limited Company with active DPIIT Startup Recognition Certificate.",
      experience: "Minimum 1 year operational experience or at least 1 previous field deployment of hardware IoT or environmental sensors.",
      certifications: "RoHS compliance certificate, IP65 weatherproof certification, and CE/ISO 9001 manufacturing quality standards.",
      team: "Core technical team must include at least 1 lead embedded hardware engineer and 1 atmospheric data scientist.",
      financial: "Positive net worth or minimum 6 months verifiable operating runway; no bank credit defaults.",
      security: "Data localization strictly on Indian servers; CERT-In empaneled security audit clearance.",
    },
    requirements: {
      mandatory: [
        "Laser scattering particulate counters capable of resolving PM1, PM2.5, and PM10 simultaneously.",
        "IP65 rated weatherproof enclosure with automated anti-fouling optical purge mechanism.",
        "Solar/battery dual power backup capable of uninterrupted 48-hour operation during grid outage.",
        "Encrypted cellular NB-IoT or LoRaWAN backhaul with fallback buffer storage of 14 days of telemetry.",
      ],
      preferred: [
        "Electrochemical multi-gas sensor expansion slot for NO2, SO2, and TVOC.",
        "On-device machine learning temperature and relative humidity curve auto-calibration.",
        "Rapid pole-mount mounting fixture requiring under 15 minutes per site installation.",
      ],
      integration:
        "Push JSON telemetry via secure TLS 1.3 REST API and Webhook into the Lucknow Integrated Command and Control Center (ICCC) every 15 minutes.",
    },
    pilotStructure: [
      {
        milestone: "Milestone 1: Site Survey & Deployment",
        timeline: "Day 15",
        deliverable: "Physical deployment of first 10 calibrated sensor nodes and baseline connectivity verification.",
        disbursement: "20% (₹5,00,000)",
      },
      {
        milestone: "Milestone 2: Full Mesh & Collocated Audit",
        timeline: "Day 45",
        deliverable: "Complete 40-node mesh live, collocated calibration audit with CPCB reference BAM-1020, and ICCC API stream.",
        disbursement: "40% (₹10,00,000)",
      },
      {
        milestone: "Milestone 3: 90-Day Validation & Handover",
        timeline: "Day 90",
        deliverable: "Continuous 90-day time-series telemetry dataset, third-party validator verification report, and open API documentation.",
        disbursement: "40% (₹10,00,000)",
      },
    ],
    budgetBreakdown: [
      { category: "Hardware Sensors & Custom Mounts (40 Nodes)", amount: "₹14,00,000", share: "56%" },
      { category: "Field Installation & Electrical Integration", amount: "₹3,50,000", share: "14%" },
      { category: "Cellular Telemetry & Cloud Compute Backhaul", amount: "₹2,50,000", share: "10%" },
      { category: "Collocated CPCB Calibration Verification", amount: "₹2,00,000", share: "8%" },
      { category: "Independent Validator Audit Escrow", amount: "₹3,00,000", share: "12%" },
    ],
    timeline: [
      {
        phase: "Challenge Formulation & Notice",
        date: "01 March 2026",
        description: "Official Gazette notification published under GFR Rule 149.",
        completed: true,
      },
      {
        phase: "Startup Proposals Due",
        date: "31 March 2026",
        description: "Closing date for proposal submissions, technical decks, and compliance bonds.",
        current: true,
      },
      {
        phase: "Independent Expert Evaluation",
        date: "07 April 2026",
        description: "Double-blind technical scoring by empaneled academic and municipal experts.",
      },
      {
        phase: "Pilot Deployment Kickoff",
        date: "15 April 2026",
        description: "Field deployment begins in Lucknow municipal wards 14, 18, 22, and 29.",
      },
      {
        phase: "Final Verification & Validation",
        date: "15 July 2026",
        description: "Independent audit report by TERI / IIT Kanpur for state scale-up procurement.",
      },
    ],
    documents: [
      { name: "CHAL-UP-DUD-001_Detailed_RFP_Statement.pdf", size: "2.4 MB", type: "PDF", date: "01 Mar 2026" },
      { name: "Lucknow_Ward_14_18_GIS_Boundary_Shapefiles.zip", size: "8.1 MB", type: "ZIP", date: "01 Mar 2026" },
      { name: "ICCC_Rest_Telemetry_API_Specification_v2.json", size: "480 KB", type: "JSON", date: "05 Mar 2026" },
      { name: "GovInnovate_Standard_Tripartite_Pilot_Agreement.pdf", size: "1.1 MB", type: "PDF", date: "01 Mar 2026" },
    ],
    faq: [
      {
        question: "Does the startup retain proprietary intellectual property rights for the sensor design?",
        answer:
          "Yes. Under GovInnovate standard terms, the startup retains 100% of all background IP, proprietary firmware, and sensor calibration algorithms. The Municipal Corporation receives a perpetual non-exclusive license solely for pilot data usage.",
      },
      {
        question: "Is DPIIT recognition mandatory to apply for this challenge?",
        answer:
          "Yes. Per Ministry of Commerce and Department of Urban Development pilot directives, applicant startups must possess an active DPIIT recognition number.",
      },
      {
        question: "How are milestone payments disbursed during the pilot?",
        answer:
          "Payments are disbursed directly into the startup's verified escrow account within 7 working days following validation sign-off by the municipal officer and independent technical validator.",
      },
      {
        question: "Can hardware be collocated with existing street lighting infrastructure?",
        answer:
          "Yes. The Lucknow Municipal Corporation will provide physical mounting permissions on municipal utility poles and ensure 230V auxiliary power connections where needed.",
      },
    ],
    coordinates: [0, 0.4, 0],
  },
  {
    id: "chal-traffic-002",
    code: "CHAL-UP-DUT-2026-002",
    title: "Adaptive AI Traffic Signal Optimization for Congestion Corridors",
    department: "Directorate of Urban Transport",
    state: "Uttar Pradesh",
    district: "Kanpur Nagar",
    location: "Kanpur Nagar, Uttar Pradesh",
    category: "Smart Mobility & Transit",
    technology: ["Edge Computer Vision", "Real-Time AI", "Traffic Signal Controllers", "4G LTE"],
    budget: "₹35,00,000",
    budgetNumeric: 3500000,
    pilotDuration: "120 Days",
    durationDays: 120,
    deadline: "15 April 2026",
    deadlineDate: "2026-04-15",
    daysRemaining: 19,
    status: "OPEN",
    statusLabel: "PROPOSALS OPEN",
    statusVariant: "default",
    description:
      "Edge computer-vision sensors and dynamic phase signal controllers along 6 high-density intersections of the GT Road commercial corridor with emergency vehicle priority.",
    problem:
      "Fixed-cycle timer traffic signals cannot adapt to asymmetric rush-hour surges, causing severe gridlocks averaging 18.5 minutes intersection delays and blocking emergency ambulances along the GT Road corridor.",
    context:
      "Manual traffic police overrides are erratic and uncoordinated between successive intersections, leading to shockwave braking and excessive fuel burn.",
    desiredOutcome:
      "Implement adaptive computer vision signal controllers with corridor green-wave synchronization, reducing average corridor delay by ≥ 20.0% and prioritizing emergency ambulances within 4 minutes.",
    kpis: [
      {
        name: "Peak Hour Corridor Delay Reduction",
        baseline: "18.5 minutes average delay",
        target: "≤ 13.0 minutes delay (≥ 28% reduction)",
        instrument: "Automated Floating Car Telemetry & ANPR Sensors",
        weight: "40%",
      },
      {
        name: "Emergency Ambulance Priority Clearance",
        baseline: "8.2 minutes transit time",
        target: "≤ 4.0 minutes transit time",
        instrument: "Hospital GPS Ambulance Tracker Log",
        weight: "35%",
      },
      {
        name: "Edge Hardware Controller Uptime",
        baseline: "88.0% reliability",
        target: "≥ 98.0% continuous uptime",
        instrument: "Traffic Command Center Heartbeat Log",
        weight: "25%",
      },
    ],
    eligibility: {
      registration: "Registered Indian Private Limited Company with active DPIIT Startup Recognition Certificate.",
      experience: "Minimum 2 years experience in computer vision, edge AI, or intelligent transportation systems (ITS).",
      certifications: "ISO 9001 and CE/FCC compliance for industrial edge computing devices.",
      team: "Lead AI systems architect with verifiable deployment experience in video analytics.",
      financial: "Minimum annual turnover or funding runway of ₹50 Lakhs.",
      security: "Edge-only video processing with strict zero video streaming to public cloud.",
    },
    requirements: {
      mandatory: [
        "Edge computing boxes capable of real-time multi-lane vehicle queue counting at 30 fps without cloud offload.",
        "Direct interface with existing legacy fixed-time traffic signal controller cabinets via optoisolated relays.",
        "Automatic failover to legacy timer cycles in the event of camera malfunction or network drop.",
      ],
      preferred: [
        "Acoustic or beacon-based siren detection for automatic emergency ambulance preemption.",
        "Pedestrian waiting zone detection and dynamic crossing phase extension.",
      ],
      integration:
        "Integration with Kanpur City Traffic Police Command Room via fiber optic or secured VPN link.",
    },
    pilotStructure: [
      {
        milestone: "Milestone 1: Camera Installation & Baseline",
        timeline: "Day 30",
        deliverable: "Edge AI cameras deployed at 6 intersections; 14-day baseline traffic flow logged.",
        disbursement: "25% (₹8,75,000)",
      },
      {
        milestone: "Milestone 2: Closed-Loop Adaptive Control",
        timeline: "Day 60",
        deliverable: "Dynamic signal actuation activated with green-wave corridor timing.",
        disbursement: "35% (₹12,25,000)",
      },
      {
        milestone: "Milestone 3: Final Transit Audit & Handover",
        timeline: "Day 120",
        deliverable: "Comprehensive travel time reduction audit verified by IIT Kanpur Transport Engineering Dept.",
        disbursement: "40% (₹14,00,000)",
      },
    ],
    budgetBreakdown: [
      { category: "Industrial Edge AI Processors & IP Cameras", amount: "₹18,00,000", share: "51%" },
      { category: "Traffic Controller Interfacing & Cabling", amount: "₹6,00,000", share: "17%" },
      { category: "Ambulance Priority Beacons & Software", amount: "₹4,00,000", share: "11%" },
      { category: "Independent Traffic Audit (IIT Kanpur)", amount: "₹4,00,000", share: "12%" },
      { category: "Contingency & Field Spares", amount: "₹3,00,000", share: "9%" },
    ],
    timeline: [
      { phase: "Challenge Statement Release", date: "10 March 2026", description: "Gazette notice published.", completed: true },
      { phase: "Startup Proposals Due", date: "15 April 2026", description: "Bids close at 17:00 IST.", current: true },
      { phase: "Technical Committee Evaluation", date: "22 April 2026", description: "Demonstration & simulator test." },
      { phase: "Field Deployment Kickoff", date: "01 May 2026", description: "Corridor installation at GT Road." },
      { phase: "Final Outcome Validation", date: "01 September 2026", description: "Formal scaling certification." },
    ],
    documents: [
      { name: "Kanpur_GT_Road_Signal_Inventory_Spec.pdf", size: "3.8 MB", type: "PDF", date: "10 Mar 2026" },
      { name: "Intersection_Layout_Blueprints_6_Junctions.dwg", size: "12.4 MB", type: "DWG", date: "10 Mar 2026" },
    ],
    faq: [
      {
        question: "Are civil modifications to intersections permitted during installation?",
        answer: "No road digging or civil restructuring is allowed. All equipment must mount on existing signal mast arms.",
      },
      {
        question: "Can video recordings be retained for training?",
        answer: "Only aggregated metadata and queue lengths can be logged. Video feeds must be discarded after edge inference in compliance with the DPDP Act.",
      },
    ],
    coordinates: [-3.2, 0.4, 2.0],
  },
  {
    id: "chal-waste-003",
    code: "CHAL-UP-SWM-2026-003",
    title: "Deep-Learning Optical Purity Sorter for Dry Municipal Waste",
    department: "Noida Authority / Solid Waste SPV",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    location: "Noida Sector 62, Uttar Pradesh",
    category: "Circular Economy & Waste Tech",
    technology: ["Computer Vision", "Pneumatic Ejection", "Near-Infrared (NIR)", "Robotics"],
    budget: "₹20,00,000",
    budgetNumeric: 2000000,
    pilotDuration: "60 Days",
    durationDays: 60,
    deadline: "28 February 2026",
    deadlineDate: "2026-02-28",
    daysRemaining: 0,
    status: "UNDER_EVALUATION",
    statusLabel: "UNDER EVALUATION",
    statusVariant: "warning",
    description:
      "Automated pneumatic optical sorting of recyclable plastics and cardboard at Sector 62 Material Recovery Facility (MRF) to eliminate hazardous manual handling.",
    problem:
      "Manual sorting of post-consumer mixed dry waste exposes municipal sanitation workers to glass shards and pathogens while yielding purity rates below 60%.",
    context:
      "High contamination in sorted PET and HDPE plastics causes recyclers to reject truckloads, sending valuable recyclables to the regional landfill.",
    desiredOutcome:
      "Automated optical sorting system with pneumatic ejector valves achieving ≥ 85% segregation purity at a throughput of ≥ 5 Tonnes/Hour.",
    kpis: [
      { name: "Polymer Purity Post-Sort", baseline: "58.0% purity", target: "≥ 85.0% purity", instrument: "Bale Sampling Mass Test", weight: "50%" },
      { name: "Sorting Line Throughput", baseline: "1.8 Tonnes/Hour", target: "≥ 5.0 Tonnes/Hour", instrument: "Conveyor Belt Loadcell Scales", weight: "30%" },
      { name: "Automated E-Stop Jam Recovery", baseline: "25 min recovery", target: "≤ 3.0 min recovery", instrument: "Safety PLC Trip Logs", weight: "20%" },
    ],
    eligibility: {
      registration: "DPIIT-recognized robotics or industrial automation startup.",
      experience: "Demonstrated pilot or prototype of high-speed sorting or pneumatic actuators.",
      certifications: "ISO 13849 machinery safety compliance.",
      team: "Mechatronics or robotic controls lead on founding team.",
      financial: "Positive operational net worth.",
      security: "Standard industrial safety protocols.",
    },
    requirements: {
      mandatory: ["Near-Infrared (NIR) or multispectral camera system.", "Pneumatic solenoid air-jet bar with millisecond actuation."],
      preferred: ["Self-cleaning optical lens shield for dusty MRF environments."],
      integration: "Output conveyor diverter integration with existing conveyor lines.",
    },
    pilotStructure: [
      { milestone: "Milestone 1: Mechanical Fitment", timeline: "Day 15", deliverable: "Conveyor integration & pneumatics install", disbursement: "30%" },
      { milestone: "Milestone 2: Production Trial", timeline: "Day 40", deliverable: "100-ton sorting continuous test run", disbursement: "40%" },
      { milestone: "Milestone 3: Final Handover", timeline: "Day 60", deliverable: "Validation report & operator training", disbursement: "30%" },
    ],
    budgetBreakdown: [
      { category: "High-Speed Solenoid Jet Bar", amount: "₹8,00,000", share: "40%" },
      { category: "NIR Camera & Edge Processor", amount: "₹7,00,000", share: "35%" },
      { category: "Installation & Mechanical Chutes", amount: "₹3,00,000", share: "15%" },
      { category: "Audit & Safety Verification", amount: "₹2,00,000", share: "10%" },
    ],
    timeline: [
      { phase: "Proposals Closed", date: "28 Feb 2026", description: "Bids submitted.", completed: true },
      { phase: "Evaluation Committee", date: "20 Mar 2026", description: "Scoring underway.", current: true },
      { phase: "MRF Installation", date: "10 Apr 2026", description: "Setup at Sector 62." },
    ],
    documents: [{ name: "Noida_Sector_62_MRF_Conveyor_Schematics.pdf", size: "4.2 MB", type: "PDF", date: "15 Jan 2026" }],
    faq: [{ question: "Is 3-phase 415V power provided at site?", answer: "Yes, 63A dedicated 3-phase industrial power is available." }],
    coordinates: [3.4, 0.4, -1.8],
  },
  {
    id: "chal-water-004",
    code: "CHAL-UP-SWM-2026-004",
    title: "Groundwater Aquifer Depletion & Heavy Metal Telemetry Grid",
    department: "State Water & Sanitation Mission",
    state: "Uttar Pradesh",
    district: "Prayagraj",
    location: "Prayagraj, Uttar Pradesh",
    category: "Water Resources & Deep Sensing",
    technology: ["Subterranean IoT", "Spectroscopy", "Hydrostatic Telemetry", "Solar"],
    budget: "₹40,00,000",
    budgetNumeric: 4000000,
    pilotDuration: "180 Days",
    durationDays: 180,
    deadline: "30 April 2026",
    deadlineDate: "2026-04-30",
    daysRemaining: 34,
    status: "OPEN",
    statusLabel: "PROPOSALS OPEN",
    statusVariant: "default",
    description:
      "Automated hydrostatic depth sensors and spectroscopy probes in 50 designated agricultural and municipal borewells to track arsenic and groundwater drawdown.",
    problem:
      "Critical groundwater over-extraction and undetected arsenic leaching in alluvial aquifers threaten drinking water supplies for 800,000 rural and semi-urban citizens.",
    context:
      "Water department officers currently perform manual dip-meter readings only twice a year, giving zero early warning of severe water table collapse.",
    desiredOutcome:
      "Real-time solar telemetry from 50 subterranean probes transmitting hourly water table levels and quarterly spectral contaminant indicators to state portal.",
    kpis: [
      { name: "Hydrostatic Depth Telemetry Accuracy", baseline: "± 2.5 meters error", target: "≤ ± 0.05 meters error", instrument: "Manual Piezometer Benchmark", weight: "40%" },
      { name: "Hourly Data Completeness", baseline: "0% automated", target: "≥ 96.0% transmission rate", instrument: "State Hydrology Portal Logs", weight: "35%" },
      { name: "Heavy Metal Early Warning Latency", baseline: "6 months latency", target: "≤ 24 hours alert", instrument: "Central Ground Water Board Validation", weight: "25%" },
    ],
    eligibility: {
      registration: "DPIIT-recognized water-tech or deep-sensing startup.",
      experience: "At least 1 verified groundwater or hydrology sensor installation.",
      certifications: "IP68 submersible certification up to 100 meters water head.",
      team: "Hydrology engineer and embedded systems engineer.",
      financial: "Positive net worth.",
      security: "Encrypted data transmission to State Data Centre.",
    },
    requirements: {
      mandatory: ["IP68 titanium or ceramic piezoresistive pressure sensors.", "Solar-powered telemetry head with 5-year internal lithium battery backup."],
      preferred: ["Downhole optical spectrometer for total dissolved solids (TDS) and arsenic screening."],
      integration: "Push to Uttar Pradesh State Water Informatics System (UP-SWIS).",
    },
    pilotStructure: [
      { milestone: "Milestone 1: 15 Borewell Setup", timeline: "Day 45", deliverable: "Submersible sensor insertion & calibration", disbursement: "30%" },
      { milestone: "Milestone 2: Full 50-Well Network", timeline: "Day 90", deliverable: "Complete telemetry mesh & portal integration", disbursement: "40%" },
      { milestone: "Milestone 3: Seasonal Monsoonal Audit", timeline: "Day 180", deliverable: "6-month post-monsoon recharge report", disbursement: "30%" },
    ],
    budgetBreakdown: [
      { category: "50 IP68 Hydrostatic Probes & Cables", amount: "₹22,00,000", share: "55%" },
      { category: "Solar Telemetry Heads & Cellular SIMs", amount: "₹8,00,000", share: "20%" },
      { category: "Field Insertion & Borewell Sealing", amount: "₹5,00,000", share: "12.5%" },
      { category: "Independent Hydrogeological Audit", amount: "₹5,00,000", share: "12.5%" },
    ],
    timeline: [
      { phase: "Challenge Statement Published", date: "15 March 2026", description: "State portal notice live.", completed: true },
      { phase: "Submission Deadline", date: "30 April 2026", description: "Proposals close.", current: true },
      { phase: "Field Deployment", date: "20 May 2026", description: "Borewell installation in Prayagraj." },
    ],
    documents: [{ name: "Prayagraj_50_Borewell_Coordinates_Geology.xlsx", size: "1.2 MB", type: "XLSX", date: "15 Mar 2026" }],
    faq: [{ question: "What is the average depth of the borewells?", answer: "Target municipal and community borewells range between 60 to 120 meters deep." }],
    coordinates: [-1.8, 0.4, -3.2],
  },
  {
    id: "chal-energy-005",
    code: "CHAL-MH-MRE-2026-005",
    title: "AI Solar Rooftop Microgrid Real-Time Balancing & Net Metering",
    department: "Renewable Energy Development Agency",
    state: "Maharashtra",
    district: "Pune",
    location: "Pune, Maharashtra",
    category: "Clean Energy & Grid",
    technology: ["Smart Inverters", "Edge AI", "Modbus", "Zigbee", "Cloud Billing"],
    budget: "₹30,00,000",
    budgetNumeric: 3000000,
    pilotDuration: "90 Days",
    durationDays: 90,
    deadline: "20 May 2026",
    deadlineDate: "2026-05-20",
    daysRemaining: 54,
    status: "OPEN",
    statusLabel: "PROPOSALS OPEN",
    statusVariant: "default",
    description:
      "Distributed AI controllers across 80 municipal school rooftops to dynamically throttle inverters and balance localized distribution transformer loading during peak solar irradiance.",
    problem:
      "Reverse power flow and voltage spikes from distributed rooftop solar installations trip suburban distribution transformers, preventing further renewable energy integration.",
    context:
      "Traditional utility distribution grids lack visibility into second-by-second microgrid generation, causing reactive transformer curtailments.",
    desiredOutcome:
      "Deploy localized smart controller gateways to maintain transformer voltage within ±4% statutory limits while eliminating solar generation curtailment.",
    kpis: [
      { name: "Distribution Transformer Voltage Compliance", baseline: "14% excursions outside limit", target: "≤ 0.5% excursions", instrument: "MSEDCL Grid SCADA Logger", weight: "45%" },
      { name: "Renewable Energy Curtailment Prevention", baseline: "18.0% energy dumped", target: "≤ 2.0% energy dumped", instrument: "Smart Net Meter Telemetry", weight: "35%" },
      { name: "Telemetry Latency to Utility Gateway", baseline: "15 min polling", target: "≤ 5.0 seconds control response", instrument: "Substation RTU Logs", weight: "20%" },
    ],
    eligibility: {
      registration: "DPIIT-recognized clean-energy or power-electronics startup.",
      experience: "Demonstrated smart grid or battery energy storage deployment.",
      certifications: "CEA / BIS electrical safety certification for grid tie inverters.",
      team: "Power systems electrical engineer on team.",
      financial: "Positive net worth.",
      security: "Encrypted Modbus TCP and IEC 61850 protocol compliance.",
    },
    requirements: {
      mandatory: ["Bidirectional smart energy metering gateways with 4G backhaul.", "Dynamic active/reactive power (Volt-VAr) regulation capability."],
      preferred: ["Battery energy storage micro-dispatch integration capability."],
      integration: "Utility SCADA API and Automated Meter Reading (AMR) system.",
    },
    pilotStructure: [
      { milestone: "Milestone 1: 20 School Rooftops Installed", timeline: "Day 25", deliverable: "Gateway fitment and zero-injection testing", disbursement: "30%" },
      { milestone: "Milestone 2: Full 80 Rooftop Network", timeline: "Day 60", deliverable: "Automated autonomous localized grid balancing active", disbursement: "40%" },
      { milestone: "Milestone 3: Utility Grid Audit", timeline: "Day 90", deliverable: "Verification report co-signed by Discom engineers", disbursement: "30%" },
    ],
    budgetBreakdown: [
      { category: "80 Smart Gateway Controllers", amount: "₹15,00,000", share: "50%" },
      { category: "Installation & CT/PT Wiring", amount: "₹6,00,000", share: "20%" },
      { category: "Cloud Microgrid Balancing Backend", amount: "₹4,50,000", share: "15%" },
      { category: "Discom Independent Safety Audit", amount: "₹4,50,000", share: "15%" },
    ],
    timeline: [
      { phase: "Statement Release", date: "20 March 2026", description: "Live on portal.", completed: true },
      { phase: "Submissions Due", date: "20 May 2026", description: "Bidding window closes.", current: true },
      { phase: "Pilot Commissioning", date: "15 June 2026", description: "Deployment across Pune schools." },
    ],
    documents: [{ name: "Pune_Municipal_School_Transformer_Specs.pdf", size: "3.1 MB", type: "PDF", date: "20 Mar 2026" }],
    faq: [{ question: "Is roof access provided during school hours?", answer: "Yes, designated municipal facility passes will be provided to certified startup engineers." }],
    coordinates: [2.5, 0.4, 3.1],
  },
  {
    id: "chal-health-006",
    code: "CHAL-KA-DPH-2026-006",
    title: "AI Edge Diagnostic Ophthalmic Screening for Primary Health Centres",
    department: "Public Health Directorate",
    state: "Karnataka",
    district: "Bangalore Urban",
    location: "Bangalore Urban, Karnataka",
    category: "Healthcare & Telemetry",
    technology: ["Fundus Imaging", "Edge AI", "Offline Inference", "FHIR / HL7"],
    budget: "₹28,00,000",
    budgetNumeric: 2800000,
    pilotDuration: "90 Days",
    durationDays: 90,
    deadline: "10 May 2026",
    deadlineDate: "2026-05-10",
    daysRemaining: 44,
    status: "VALIDATED",
    statusLabel: "PILOT VALIDATED",
    statusVariant: "success",
    description:
      "Handheld non-mydriatic fundus cameras with on-device AI diabetic retinopathy screening across 25 rural Primary Health Centres (PHCs).",
    problem:
      "Rural diabetic patients face severe avoidable blindness due to the total absence of ophthalmologists at peripheral primary health facilities.",
    context:
      "Patients must travel over 80 km to district hospitals for dilated eye examinations, resulting in less than 5% screening compliance.",
    desiredOutcome:
      "Enable frontline ASHA health workers to perform 2-minute automated retinal triage with ≥ 92% clinical sensitivity validated against tertiary eye hospitals.",
    kpis: [
      { name: "Clinical Diabetic Retinopathy Sensitivity", baseline: "0% primary screening", target: "≥ 92.0% sensitivity vs retina specialists", instrument: "Independent Double-Blind Expert Audit", weight: "50%" },
      { name: "Screening Throughput per PHC", baseline: "0 screenings/day", target: "≥ 15 patients/day", instrument: "ABDM Tele-Health Gateway Logs", weight: "30%" },
      { name: "Offline Inference Reliability", baseline: "Cloud dependency", target: "100% offline inference capability", instrument: "Field Audit in Low-Connectivity Zones", weight: "20%" },
    ],
    eligibility: {
      registration: "DPIIT-recognized health-tech startup.",
      experience: "Prior clinical validation or CDSCO/CE certified medical software.",
      certifications: "ISO 13485 medical device quality management.",
      team: "Founding team includes clinician advisor and AI specialist.",
      financial: "Positive net worth.",
      security: "HIPAA and ABDM (Ayushman Bharat Digital Mission) compliance.",
    },
    requirements: {
      mandatory: ["Non-mydriatic portable fundus camera requiring no pupil-dilating drops.", "On-device AI inferencing without active internet connectivity."],
      preferred: ["Automated grading of glaucoma optic disc cup-to-disc ratio."],
      integration: "FHIR compliant integration with Karnataka State Health Registry.",
    },
    pilotStructure: [
      { milestone: "Milestone 1: 25 PHC Equipment Delivery", timeline: "Day 20", deliverable: "Hardware deployment & ASHA training", disbursement: "35%" },
      { milestone: "Milestone 2: 5,000 Patient Screening", timeline: "Day 60", deliverable: "Field screenings completed with tertiary referral sync", disbursement: "40%" },
      { milestone: "Milestone 3: Clinical Validation Audit", timeline: "Day 90", deliverable: "Statistical sensitivity report signed by medical college", disbursement: "25%" },
    ],
    budgetBreakdown: [
      { category: "25 Handheld Non-Mydriatic Fundus Units", amount: "₹16,00,000", share: "57%" },
      { category: "ASHA Worker Training & Handbooks", amount: "₹3,50,000", share: "12.5%" },
      { category: "ABDM Health Cloud Integration", amount: "₹3,50,000", share: "12.5%" },
      { category: "Tertiary Hospital Clinical Validation Audit", amount: "₹5,00,000", share: "18%" },
    ],
    timeline: [
      { phase: "Pilot Initiated", date: "15 Dec 2025", description: "Deployed in 25 PHCs.", completed: true },
      { phase: "Field Screenings", date: "15 Feb 2026", description: "5,000 screenings logged.", completed: true },
      { phase: "Clinical Validation Completed", date: "20 Mar 2026", description: "Validated at 94.2% sensitivity. Ready for state-wide scale-up.", completed: true },
    ],
    documents: [{ name: "Karnataka_Health_Directorate_Validation_Certificate.pdf", size: "1.8 MB", type: "PDF", date: "20 Mar 2026" }],
    faq: [{ question: "Do ASHA workers require medical degrees to operate?", answer: "No, the device is designed for intuitive 1-button capture with automated quality check." }],
    coordinates: [-2.1, 0.4, 1.8],
  },
];

export function getChallengeById(id: string): ChallengeItem | undefined {
  return CHALLENGES_DATA.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
}
