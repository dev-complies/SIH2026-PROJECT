/**
 * Statutory Proven Solutions Database & Government Replication Registry
 * Repositories solutions that have completed successful municipal/state pilots
 * with verified KPI attainment and independent third-party validation.
 */

export interface ValidatedKpiItem {
  name: string;
  metricCategory: string;
  baseline: string;
  target: string;
  actualAchieved: string;
  unit: string;
  improvementPercentage: number;
  isStatutoryTargetMet: boolean;
}

export interface ProvenSolutionCost {
  pilotTotalBudgetInr: number;
  perUnitPilotInr: number;
  perUnitScaleInr: number;
  unitLabel: string; // e.g. "per ward", "per intersection", "per km of pipeline", "per PHC"
  savingsVsLegacyPercentage: number;
  legacyAlternativeName: string;
  legacyCostInr: number;
  statutoryPaybackMonths: number;
}

export interface ProvenSolution {
  id: string;
  code: string;
  title: string;
  tagline: string;
  category:
    | "Air Quality & Environment"
    | "Smart Mobility & Traffic"
    | "Water & Sanitation"
    | "Heritage & Infrastructure"
    | "Healthcare & Public Health"
    | "Clean Energy & Waste";

  // 1. Problem
  problem: {
    statement: string;
    civicContext: string;
    consequencesOfStatusQuo: string;
  };

  // 2. Technology
  technology: {
    architecture: string;
    hardwareSpecs: string[];
    softwareStack: string[];
    connectivity: string[];
    aiCapabilities: string[];
    ipStatus: string;
  };

  // 3. Startup
  startup: {
    name: string;
    dpiitNumber: string;
    foundedYear: number;
    headquarters: string;
    cin: string;
    makeInIndiaLocalContent: number;
    contactPerson: string;
    contactEmail: string;
  };

  // 4. Pilot Location
  pilotLocation: {
    city: string;
    state: string;
    siteDescription: string;
    latitude: number;
    longitude: number;
    wardsTested: number;
    nodesDeployed: number;
  };

  // 5. Pilot Duration
  pilotDuration: {
    durationDays: number;
    startDate: string;
    endDate: string;
    activeOperationHours: number;
    completionStatus: "SUCCESSFULLY_COMPLETED" | "AUDITED_AND_SCALED";
  };

  // 6. Validated KPIs
  validatedKpis: ValidatedKpiItem[];

  // 7. Cost
  cost: ProvenSolutionCost;

  // 8. Validation Status
  validationStatus: {
    isFullyValidated: boolean;
    rating: "Class-A Certified" | "Empirically Validated" | "Benchmark Exceeded";
    accreditedAgency: string;
    leadAuditor: string;
    certificateDate: string;
    certificateSha256: string;
    keyAuditVerdict: string;
  };

  // 9. Applicable Departments
  applicableDepartments: string[];

  // Replication Guidance & Procurement Eligibility
  procurementEligibility: {
    gfrRule149vEligible: boolean;
    gemCatalogueCategory: string;
    estimatedScaleDeploymentTimelineMonths: number;
    recommendedReplicationScope: string;
    concessionModel: string;
  };

  replicationsUnderway: number; // Count of other cities currently adopting
  featuredOrder: number;
}

export const INITIAL_PROVEN_SOLUTIONS: ProvenSolution[] = [
  {
    id: "sol-aqi-lucknow",
    code: "SOL-ENV-01",
    title: "Hyperlocal IoT Air Quality Sensor Mesh & Rapid Ward Intervention System",
    tagline: "Ward-level particulate monitoring with sub-minute alert dispatch and automated misting truck routing.",
    category: "Air Quality & Environment",

    problem: {
      statement: "Municipal corporations rely on sparse, stationary CAAQMS stations (only 4 in Lucknow) that fail to detect localized dust, vehicular, and waste combustion hotspots.",
      civicContext: "Lucknow Winter Smog and seasonal NCAP particulate spikes impacting 3.8 million residents.",
      consequencesOfStatusQuo: "Untargeted street misting, high respiratory disease incidence, and delayed civic alerts.",
    },

    technology: {
      architecture: "Edge-to-Cloud Distributed Sensor Network with LoRaWAN / 4G NB-IoT mesh",
      hardwareSpecs: ["Class-A Laser Optical Particle Counter (OPC)", "PTC Heated Sample Inlets", "Electrochemical Gas Sensors (NO2, SO2, CO, O3)", "48-hr LiFePO4 Solar Buffer"],
      softwareStack: ["Docker Microservices", "PostGIS Spatial Datastore", "MQTT Broker", "Automated Calibration Polynomials"],
      connectivity: ["LoRaWAN 865-867 MHz", "4G LTE Cat-M1 Fallback"],
      aiCapabilities: ["Hotspot Micro-Attribution Machine Learning", "Dynamic Calibration Baseline Correction"],
      ipStatus: "Indian Patent Granted (App #202411038291)",
    },

    startup: {
      name: "AirSense Technologies Pvt Ltd",
      dpiitNumber: "DIPP-94812",
      foundedYear: 2021,
      headquarters: "Lucknow, Uttar Pradesh",
      cin: "U72900UP2021PTC148291",
      makeInIndiaLocalContent: 68.5,
      contactPerson: "Dr. Tarun Saxena (CTO)",
      contactEmail: "gov@airsense.example.com",
    },

    pilotLocation: {
      city: "Lucknow",
      state: "Uttar Pradesh",
      siteDescription: "12 Commercial & Eco-Residential Wards (Hazratganj, Lalbagh, Chowk, Gomti Nagar)",
      latitude: 26.8467,
      longitude: 80.9462,
      wardsTested: 12,
      nodesDeployed: 48,
    },

    pilotDuration: {
      durationDays: 90,
      startDate: "01 May 2026",
      endDate: "31 Jul 2026",
      activeOperationHours: 2160,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Sensor Node Telemetry Uptime",
        metricCategory: "Hardware Reliability",
        baseline: "92.0%",
        target: "99.0%",
        actualAchieved: "99.4%",
        unit: "% uptime",
        improvementPercentage: 8.0,
        isStatutoryTargetMet: true,
      },
      {
        name: "Collocated Correlation with CPCB BAM-1020",
        metricCategory: "Measurement Accuracy",
        baseline: "0.72 R²",
        target: "0.90 R²",
        actualAchieved: "0.95 R²",
        unit: "R² Coefficient",
        improvementPercentage: 31.9,
        isStatutoryTargetMet: true,
      },
      {
        name: "Spatial Coverage Density",
        metricCategory: "Urban Grid Reach",
        baseline: "12 km²",
        target: "45 km²",
        actualAchieved: "48 km²",
        unit: "sq km",
        improvementPercentage: 300.0,
        isStatutoryTargetMet: true,
      },
      {
        name: "Hotspot Alert Delivery Latency",
        metricCategory: "Civic Advisory Speed",
        baseline: "24h batch",
        target: "< 5 mins",
        actualAchieved: "2.1 mins",
        unit: "minutes",
        improvementPercentage: 99.8,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 2450000,
      perUnitPilotInr: 204166,
      perUnitScaleInr: 48125,
      unitLabel: "per ward / year",
      savingsVsLegacyPercentage: 98.3,
      legacyAlternativeName: "Continuous Ambient Air Quality Monitoring Station (CAAQMS)",
      legacyCostInr: 12000000,
      statutoryPaybackMonths: 4.2,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "The Energy and Resources Institute (TERI) & IIT Kanpur",
      leadAuditor: "Dr. Alok Gupta & Priya Nair",
      certificateDate: "24 Sep 2026",
      certificateSha256: "8e5926c483a99281a0b388d92f71884029486c91a0c793f18e932b17a10f823d",
      keyAuditVerdict: "Verified R² = 0.95 correlation with continuous CPCB reference monitors; dynamic baseline calibration eliminates optical sensor drift within ±2.5%.",
    },

    applicableDepartments: [
      "Department of Urban Development",
      "Environment, Forest & Climate Change",
      "State Pollution Control Boards (SPCBs)",
      "Smart City SPVs",
      "Municipal Corporations (Nagar Nigams)",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM Specialized Innovation Catalogue #UP-ENV-2026",
      estimatedScaleDeploymentTimelineMonths: 3,
      recommendedReplicationScope: "All 80 Municipal Wards across Tier-1/Tier-2 Smart Cities",
      concessionModel: "CAPEX + 3-Year AMC",
    },

    replicationsUnderway: 3,
    featuredOrder: 1,
  },

  {
    id: "sol-traffic-kanpur",
    code: "SOL-TRF-02",
    title: "Edge-AI Adaptive Signal Optimization & Emergency Vehicle Transit Greenwave",
    tagline: "Real-time intersection queue length vision analytics with dynamic phase split and automated ambulance priority.",
    category: "Smart Mobility & Traffic",

    problem: {
      statement: "Fixed-time traffic signals in dense commercial corridors cause severe congestion bottlenecks and hold up ambulances in bumper-to-bumper traffic.",
      civicContext: "Kanpur GT Road arterial commercial corridor carrying over 65,000 passenger car units (PCU) daily.",
      consequencesOfStatusQuo: "Average corridor delay of 24.6 minutes, transit delays, and elevated idling emissions.",
    },

    technology: {
      architecture: "Edge Computer Vision & Multi-Intersection Decentralized Agent Mesh",
      hardwareSpecs: ["Edge Vision Inference Box (NVIDIA Jetson Orin)", "Wide-Angle 4K Optical Sensors", "DSRC Transit Transponder Readers", "Relay Controller Bridge"],
      softwareStack: ["YOLOv9 Multi-Class Vehicle Detector", "Reinforcement Learning Phase Scheduler", "V2X Priority Daemon", "City ITMS Webhook"],
      connectivity: ["Fiber Optic Municipal Ring", "Encrypted 5G Cellular Backup"],
      aiCapabilities: ["Dense Congestion Queue Estimation", "Microscopic Traffic Flow Simulation"],
      ipStatus: "Patent Filed (App #202511019482)",
    },

    startup: {
      name: "OptiFlow AI Systems Pvt Ltd",
      dpiitNumber: "DIPP-104822",
      foundedYear: 2022,
      headquarters: "Kanpur, Uttar Pradesh",
      cin: "U72200UP2022PTC159381",
      makeInIndiaLocalContent: 72.0,
      contactPerson: "Vivek Narayanan (CEO)",
      contactEmail: "procure@optiflow.example.com",
    },

    pilotLocation: {
      city: "Kanpur",
      state: "Uttar Pradesh",
      siteDescription: "GT Road Commercial Corridor (6 High-Density Intersections from Rawatpur to Phoolbagh)",
      latitude: 26.4499,
      longitude: 80.3319,
      wardsTested: 6,
      nodesDeployed: 24,
    },

    pilotDuration: {
      durationDays: 120,
      startDate: "15 Jan 2026",
      endDate: "15 May 2026",
      activeOperationHours: 2880,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Peak-Hour Arterial Travel Delay",
        metricCategory: "Congestion Reduction",
        baseline: "24.6 mins",
        target: "< 18.0 mins",
        actualAchieved: "16.2 mins",
        unit: "minutes delay",
        improvementPercentage: 34.1,
        isStatutoryTargetMet: true,
      },
      {
        name: "Ambulance Corridor Clearance Time",
        metricCategory: "Emergency Response",
        baseline: "8.4 mins",
        target: "< 4.5 mins",
        actualAchieved: "3.2 mins",
        unit: "minutes to cross",
        improvementPercentage: 61.9,
        isStatutoryTargetMet: true,
      },
      {
        name: "Signal Controller Hardware Uptime",
        metricCategory: "System Reliability",
        baseline: "81.0%",
        target: "98.0%",
        actualAchieved: "99.2%",
        unit: "% uptime",
        improvementPercentage: 22.5,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 3200000,
      perUnitPilotInr: 533333,
      perUnitScaleInr: 165000,
      unitLabel: "per intersection",
      savingsVsLegacyPercentage: 82.5,
      legacyAlternativeName: "Imported SCATS / SCOOT Adaptive Traffic Control",
      legacyCostInr: 950000,
      statutoryPaybackMonths: 6.8,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "IIT Kanpur Transportation Systems Engineering Cell",
      leadAuditor: "Prof. Sudhir Misra",
      certificateDate: "10 Jun 2026",
      certificateSha256: "3f91a0c8b7e2190847291a0c189b882947192a0b18274910294819a0bc72910a",
      keyAuditVerdict: "Demonstrated 34.1% delay reduction and 100% emergency vehicle greenwave trigger success without secondary gridlock.",
    },

    applicableDepartments: [
      "Traffic Police & Directorate of Transport",
      "Department of Urban Development",
      "Public Works Department (PWD)",
      "Smart City Integrated Command & Control Centres (ICCC)",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM ITMS & Intelligent Traffic Control #TRF-AI-2026",
      estimatedScaleDeploymentTimelineMonths: 4,
      recommendedReplicationScope: "Major arterial and circular ring road corridors across Class-A cities",
      concessionModel: "CAPEX + 3-Year AMC",
    },

    replicationsUnderway: 2,
    featuredOrder: 2,
  },

  {
    id: "sol-water-agra",
    code: "SOL-WTR-03",
    title: "Non-Intrusive Acoustic Trunk Pipeline Leak Detection & Digital Water Audit",
    tagline: "Continuous hydrostatic and acoustic vibro-sensing detecting subterranean leaks with 1-meter precision.",
    category: "Water & Sanitation",

    problem: {
      statement: "Non-Revenue Water (NRW) in municipal distribution networks exceeds 38% due to aging subterranean pipes with undetectable underground ruptures.",
      civicContext: "Agra Municipal Water Supply Network supplying 1.8M residents from Yamuna Water Works.",
      consequencesOfStatusQuo: "Loss of 42 MLD potable water, road sinkholes, and low terminal pressure in tail-end wards.",
    },

    technology: {
      architecture: "IoT Hydrophone & Accelerometer Sensor Network with Cloud Cross-Correlation",
      hardwareSpecs: ["Sub-surface Piezoelectric Hydrophones", "Ultrasonic Clamp-on Flow Meters", "Solar-Powered Valve Loggers", "IP68 Enclosure"],
      softwareStack: ["Time-Difference-of-Arrival (TDOA) Leak Pinpointer", "EPANET Hydraulic Digital Twin", "GIS Leak Hazard Map"],
      connectivity: ["NB-IoT Dual-SIM", "Sub-GHz RF Metering"],
      aiCapabilities: ["Acoustic FFT Noise Filtration", "Transient Pressure Surge Waveform Classifier"],
      ipStatus: "Patent Granted (App #202311004819)",
    },

    startup: {
      name: "AquaPulse Telemetry Systems Pvt Ltd",
      dpiitNumber: "DIPP-88219",
      foundedYear: 2021,
      headquarters: "Bengaluru, Karnataka (UP Field Office: Agra)",
      cin: "U74999KA2021PTC147281",
      makeInIndiaLocalContent: 74.0,
      contactPerson: "Rohan Kulkarni (Managing Director)",
      contactEmail: "water@aquapulse.example.com",
    },

    pilotLocation: {
      city: "Agra",
      state: "Uttar Pradesh",
      siteDescription: "Sikandra to Tajganj Primary Water Distribution Trunk Main (28 km pipeline)",
      latitude: 27.1767,
      longitude: 78.0081,
      wardsTested: 14,
      nodesDeployed: 56,
    },

    pilotDuration: {
      durationDays: 90,
      startDate: "01 Mar 2026",
      endDate: "30 May 2026",
      activeOperationHours: 2160,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Non-Revenue Water (NRW) Physical Losses",
        metricCategory: "Water Conservation",
        baseline: "38.5%",
        target: "< 24.0%",
        actualAchieved: "18.2%",
        unit: "% loss rate",
        improvementPercentage: 52.7,
        isStatutoryTargetMet: true,
      },
      {
        name: "Subterranean Leak Pinpointing Accuracy",
        metricCategory: "Engineering Precision",
        baseline: "± 25 meters",
        target: "± 3 meters",
        actualAchieved: "± 0.8 meters",
        unit: "meters offset",
        improvementPercentage: 96.8,
        isStatutoryTargetMet: true,
      },
      {
        name: "Daily Potable Water Saved",
        metricCategory: "Volumetric Yield",
        baseline: "0 MLD",
        target: "4.0 MLD",
        actualAchieved: "6.8 MLD",
        unit: "Million Litres / Day",
        improvementPercentage: 70.0,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 2800000,
      perUnitPilotInr: 100000,
      perUnitScaleInr: 32000,
      unitLabel: "per km of pipeline",
      savingsVsLegacyPercentage: 88.0,
      legacyAlternativeName: "Manual Excavation & Step Testing Contractors",
      legacyCostInr: 260000,
      statutoryPaybackMonths: 3.4,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "UP Jal Nigam Directorate & CSIR-NEERI",
      leadAuditor: "Er. K.P. Singh (Chief Engineer, Water Works)",
      certificateDate: "18 Jun 2026",
      certificateSha256: "910283c7a9182b847192019a847291a0b82749102847291a0b82749102847291",
      keyAuditVerdict: "Prevented 6.8 MLD potable water loss across Agra trunk line; pinpointed 19 previously undetected deep underground ruptures with zero false digs.",
    },

    applicableDepartments: [
      "Jal Nigam / Public Health Engineering Department (PHED)",
      "Ministry of Jal Shakti (State Mission Directorate)",
      "Municipal Corporations & Water Supply Boards",
      "Smart City Infrastructure Missions",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM Water Audit & Pipeline Leak Detection Systems #WTR-09",
      estimatedScaleDeploymentTimelineMonths: 3,
      recommendedReplicationScope: "All urban drinking water trunk pipelines (>300mm diameter)",
      concessionModel: "Performance-Based Savings / Annuity",
    },

    replicationsUnderway: 4,
    featuredOrder: 3,
  },

  {
    id: "sol-drone-varanasi",
    code: "SOL-INF-04",
    title: "Autonomous Thermal UAV & LiDAR Structural Health Auditing for Heritage Environs",
    tagline: "Millimeter-level photogrammetric mesh, subsurface moisture thermal detection, and historic structural stress tracking.",
    category: "Heritage & Infrastructure",

    problem: {
      statement: "Historic ghats and medieval temple architecture suffer undetected structural subsidence, foundation scour, and moisture seepage.",
      civicContext: "Varanasi Heritage Riverfront (84 Ghats spanning 6.8 km along the River Ganga).",
      consequencesOfStatusQuo: "Sudden masonry collapses, heritage defacement, and unsafe pilgrim congregation areas during high-water monsoon.",
    },

    technology: {
      architecture: "Autonomous Flight UAVs with Multi-Spectral LiDAR and Radiometric Thermal Imaging",
      hardwareSpecs: ["Dual Radiometric Thermal Camera (640x512)", "300m Range LiDAR Scanner", "RTK-GNSS Positioning Receiver (±1cm)", "Tethered Power Station"],
      softwareStack: ["Automated Waypoint Flight Controller", "Dense 3D Point Cloud Generator", "Structural Crack Deformation Neural Network"],
      connectivity: ["Direct 5.8 GHz Encrypted Digital Video Downlink", "Cloud BIM Sync"],
      aiCapabilities: ["Automated Surface Crack Quantification", "Hydraulic Scour Risk Prediction"],
      ipStatus: "DGCA Type Certified Drone Platform",
    },

    startup: {
      name: "AeroVision Labs Pvt Ltd",
      dpiitNumber: "DIPP-110293",
      foundedYear: 2022,
      headquarters: "Varanasi, Uttar Pradesh",
      cin: "U74999UP2022PTC160492",
      makeInIndiaLocalContent: 81.0,
      contactPerson: "Ananya Bhargava (Head of Public Programs)",
      contactEmail: "heritage@aerovision.example.com",
    },

    pilotLocation: {
      city: "Varanasi",
      state: "Uttar Pradesh",
      siteDescription: "Assi Ghat to Rajghat Riverfront Corridor (84 Heritage Ghats & Retaining Walls)",
      latitude: 25.3176,
      longitude: 83.0062,
      wardsTested: 8,
      nodesDeployed: 12,
    },

    pilotDuration: {
      durationDays: 60,
      startDate: "10 Feb 2026",
      endDate: "10 Apr 2026",
      activeOperationHours: 720,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Crack & Deformation Detection Precision",
        metricCategory: "Diagnostic Accuracy",
        baseline: "Manual Visual Inspection (5mm)",
        target: "< 1.0mm",
        actualAchieved: "0.4mm",
        unit: "mm crack width",
        improvementPercentage: 92.0,
        isStatutoryTargetMet: true,
      },
      {
        name: "Riverfront Retaining Wall Inspection Speed",
        metricCategory: "Operational Velocity",
        baseline: "45 days (manual scaffolding)",
        target: "< 5 days",
        actualAchieved: "3.5 days",
        unit: "days per 5km",
        improvementPercentage: 92.2,
        isStatutoryTargetMet: true,
      },
      {
        name: "Pre-Monsoon Subsurface Scour Identification",
        metricCategory: "Disaster Risk Prevention",
        baseline: "0% preemptive",
        target: "> 80%",
        actualAchieved: "100%",
        unit: "% scour locations flagged",
        improvementPercentage: 100.0,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 1850000,
      perUnitPilotInr: 231250,
      perUnitScaleInr: 65000,
      unitLabel: "per km of riverfront / structure",
      savingsVsLegacyPercentage: 76.5,
      legacyAlternativeName: "Manual Scaffolding & High-Risk Diver River Inspections",
      legacyCostInr: 280000,
      statutoryPaybackMonths: 2.8,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "IIT BHU Civil Engineering Dept & Archaeological Survey of India (ASI)",
      leadAuditor: "Dr. R.K. Srivastava (Chair, Structural Heritage)",
      certificateDate: "28 Apr 2026",
      certificateSha256: "72910482910a9284710294819a0bc72910a82749102847192a0b182749102948",
      keyAuditVerdict: "Digitally mapped 84 heritage ghats into high-precision BIM models; identified 14 sub-surface foundation voids prior to flood season.",
    },

    applicableDepartments: [
      "Department of Tourism & Cultural Affairs",
      "Public Works Department (PWD)",
      "Archaeological Survey of India (ASI) State Liaison",
      "Irrigation and Water Resources Department",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM UAV Drone Surveying & Thermal Inspection #UAV-HERITAGE",
      estimatedScaleDeploymentTimelineMonths: 2,
      recommendedReplicationScope: "All state monuments, historic bridges, and river embankments",
      concessionModel: "Annual Inspection Service SLA",
    },

    replicationsUnderway: 2,
    featuredOrder: 4,
  },

  {
    id: "sol-health-gorakhpur",
    code: "SOL-HLT-05",
    title: "Edge-AI Autonomous Retinal Screening & Tele-Ophthalmology for Primary Health Centres",
    tagline: "Point-of-care non-mydriatic fundus imaging with instantaneous offline diabetic retinopathy and glaucoma diagnosis.",
    category: "Healthcare & Public Health",

    problem: {
      statement: "Rural and peri-urban populations lack access to certified ophthalmologists, leading to preventable blindness from undetected diabetic retinopathy.",
      civicContext: "Gorakhpur and Basti Community Health Centres (CHCs) serving 140 rural revenue villages.",
      consequencesOfStatusQuo: "Late-stage irreversible vision loss, travel expenses to tertiary hospitals, and clinical backlogs.",
    },

    technology: {
      architecture: "Handheld Non-Mydriatic Fundus Camera with On-Device Offline Neural Network",
      hardwareSpecs: ["Non-Mydriatic 45-degree Eye Imager", "Quad-Core Neural Processing Unit (NPU)", "7-inch Anti-Glare Touchscreen", "Rechargeable 10-hour Battery"],
      softwareStack: ["Offline Deep CNN Diagnostic Model", "ABDM (Ayushman Bharat Digital Mission) HL7/FHIR Connector", "Automated Referral Triage Cloud"],
      connectivity: ["Offline Autonomous Mode", "Wi-Fi / 4G Telemedicine Sync"],
      aiCapabilities: ["Diabetic Retinopathy Grading (Mild/Mod/Severe/PDR)", "Glaucoma Cup-to-Disc Ratio Analysis"],
      ipStatus: "CDSCO Approved Class-B Medical Device",
    },

    startup: {
      name: "NetraScan HealthTech Pvt Ltd",
      dpiitNumber: "DIPP-118491",
      foundedYear: 2022,
      headquarters: "Noida, Uttar Pradesh (UP Deployment Wing)",
      cin: "U85300UP2022PTC168392",
      makeInIndiaLocalContent: 86.0,
      contactPerson: "Dr. Meenakshi Sundaram (Chief Medical Officer)",
      contactEmail: "health@netrascan.example.com",
    },

    pilotLocation: {
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      siteDescription: "10 Rural Community Health Centres across Gorakhpur and Basti divisions",
      latitude: 26.7606,
      longitude: 83.3732,
      wardsTested: 10,
      nodesDeployed: 10,
    },

    pilotDuration: {
      durationDays: 90,
      startDate: "01 Mar 2026",
      endDate: "30 May 2026",
      activeOperationHours: 1440,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Diagnostic Sensitivity vs Retina Specialist Panel",
        metricCategory: "Clinical Accuracy",
        baseline: "32% (general physician triage)",
        target: "> 90.0%",
        actualAchieved: "96.4%",
        unit: "% sensitivity",
        improvementPercentage: 201.2,
        isStatutoryTargetMet: true,
      },
      {
        name: "Point-of-Care Diagnostic Time per Patient",
        metricCategory: "Clinical Throughput",
        baseline: "14 days (referral wait)",
        target: "< 5 mins",
        actualAchieved: "85 seconds",
        unit: "seconds per exam",
        improvementPercentage: 99.9,
        isStatutoryTargetMet: true,
      },
      {
        name: "Early-Stage Retinopathy Cases Identified",
        metricCategory: "Preventive Health Reach",
        baseline: "48 cases/quarter",
        target: "> 300 cases",
        actualAchieved: "742 cases",
        unit: "patients triaged",
        improvementPercentage: 1445.8,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 2100000,
      perUnitPilotInr: 210000,
      perUnitScaleInr: 68000,
      unitLabel: "per PHC device / year",
      savingsVsLegacyPercentage: 91.5,
      legacyAlternativeName: "Full Mydriatic Desktop Camera with Visiting Specialist",
      legacyCostInr: 800000,
      statutoryPaybackMonths: 3.1,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "National Health Mission (NHM UP) & AIIMS Gorakhpur",
      leadAuditor: "Dr. S.P. Tiwari (Director, Community Ophthalmology)",
      certificateDate: "14 Jun 2026",
      certificateSha256: "482910a9284710294819a0bc72910a82749102847192a0b18274910294810294",
      keyAuditVerdict: "Screened 8,410 rural citizens with 96.4% verified clinical sensitivity; seamless automated integration into state Ayushman Bharat patient records.",
    },

    applicableDepartments: [
      "Medical, Health and Family Welfare Department",
      "National Health Mission (NHM)",
      "Chief Medical Officer (CMO) Networks",
      "Rural Development & Panchayati Raj",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM Point-of-Care Medical Diagnostics #MED-RETINA",
      estimatedScaleDeploymentTimelineMonths: 3,
      recommendedReplicationScope: "All 900+ Community Health Centres and Primary Health Centres in UP",
      concessionModel: "CAPEX Device + Per-Scan Maintenance",
    },

    replicationsUnderway: 3,
    featuredOrder: 5,
  },

  {
    id: "sol-waste-bareilly",
    code: "SOL-WST-06",
    title: "Modular Decentralized Anaerobic Bio-Digesters & Catalytic Odor Absorption",
    tagline: "Rapid 24-hour on-site vegetable and food market waste conversion into methane-stabilized organic slurry.",
    category: "Clean Energy & Waste",

    problem: {
      statement: "Wholesale vegetable and grain mandis generate up to 25 tons/day of wet organic waste that rots uncollected, polluting drains and overwhelming landfills.",
      civicContext: "Bareilly Delapeer Mandi and civic vegetable wholesale hubs.",
      consequencesOfStatusQuo: "Noxious odors, leachate seepage into groundwater, and heavy diesel municipal transport haulage costs.",
    },

    technology: {
      architecture: "Thermophilic Anaerobic Plug-Flow Digester with Catalytic Bio-filter Scrubbers",
      hardwareSpecs: ["Continuous Masticator Shredder Unit", "Insulated Polyurethane Digester Tank (10 TPD)", "Active Carbon & Zeolite Odor Scrubber", "Digital Gas Flowmeter"],
      softwareStack: ["PLC Temperature / pH Automation", "SCADA Telemetry Unit", "Municipal Mandi Waste Weight Ledger"],
      connectivity: ["4G Industrial Gateway", "RS485 Modbus Sensor Bus"],
      aiCapabilities: ["Microbial Feed Rate Optimization Algorithm"],
      ipStatus: "Patent Filed (App #202411082910)",
    },

    startup: {
      name: "EcoMeth Innovations Pvt Ltd",
      dpiitNumber: "DIPP-129481",
      foundedYear: 2021,
      headquarters: "Bareilly, Uttar Pradesh",
      cin: "U37100UP2021PTC149201",
      makeInIndiaLocalContent: 92.0,
      contactPerson: "Er. Sumit Rastogi (Founder)",
      contactEmail: "waste@ecometh.example.com",
    },

    pilotLocation: {
      city: "Bareilly",
      state: "Uttar Pradesh",
      siteDescription: "Delapeer Wholesale Vegetable Mandi Complex (15 tons wet waste daily)",
      latitude: 28.3670,
      longitude: 79.4304,
      wardsTested: 4,
      nodesDeployed: 4,
    },

    pilotDuration: {
      durationDays: 100,
      startDate: "01 Jan 2026",
      endDate: "10 Apr 2026",
      activeOperationHours: 2400,
      completionStatus: "AUDITED_AND_SCALED",
    },

    validatedKpis: [
      {
        name: "Wet Market Waste Diverted from Landfill",
        metricCategory: "Solid Waste Diversion",
        baseline: "0% (100% landfilled)",
        target: "> 80.0%",
        actualAchieved: "94.6%",
        unit: "% waste diverted",
        improvementPercentage: 94.6,
        isStatutoryTargetMet: true,
      },
      {
        name: "Mandi Hydrogen Sulfide Odor Reduction",
        metricCategory: "Air & Civic Quality",
        baseline: "48 ppm H2S",
        target: "< 5 ppm",
        actualAchieved: "1.2 ppm",
        unit: "ppm odor concentration",
        improvementPercentage: 97.5,
        isStatutoryTargetMet: true,
      },
      {
        name: "Municipal Waste Haulage Truck Trips Saved",
        metricCategory: "Fuel & Carbon Savings",
        baseline: "6 trips/day",
        target: "< 2 trips/day",
        actualAchieved: "0.2 trips/day",
        unit: "daily diesel trips",
        improvementPercentage: 96.7,
        isStatutoryTargetMet: true,
      },
    ],

    cost: {
      pilotTotalBudgetInr: 3400000,
      perUnitPilotInr: 850000,
      perUnitScaleInr: 420000,
      unitLabel: "per 5-ton processing module",
      savingsVsLegacyPercentage: 68.0,
      legacyAlternativeName: "Centralized Waste Haulage to Regional Landfill",
      legacyCostInr: 1312500,
      statutoryPaybackMonths: 7.2,
    },

    validationStatus: {
      isFullyValidated: true,
      rating: "Class-A Certified",
      accreditedAgency: "CSIR - Central Mechanical Engineering Research Institute & Bareilly Nagar Nigam",
      leadAuditor: "Dr. Anupam Mukherjee",
      certificateDate: "22 Apr 2026",
      certificateSha256: "10294819a0bc72910a82749102847192a0b1827491029481029482910a928471",
      keyAuditVerdict: "Diverted 840 tons of organic Mandi waste into 42,000 kg bio-fertilizer slurry; odor levels remained below detectable thresholds under 100 days of continuous operation.",
    },

    applicableDepartments: [
      "Department of Urban Development",
      "Agriculture Marketing & Mandi Parishad",
      "New and Renewable Energy Development Agency (UPNEDA)",
      "Swachh Bharat Mission (Urban)",
    ],

    procurementEligibility: {
      gfrRule149vEligible: true,
      gemCatalogueCategory: "GeM Organic Waste Converters & Bio-Methanation #SBM-WASTE",
      estimatedScaleDeploymentTimelineMonths: 3,
      recommendedReplicationScope: "All major wholesale Krishi Upaj Mandis and municipal fruit/vegetable markets",
      concessionModel: "Build-Own-Operate (BOO) with Organic Fertilizer Offset",
    },

    replicationsUnderway: 2,
    featuredOrder: 6,
  },
];

class ProvenSolutionsDatabase {
  private solutions: ProvenSolution[];

  constructor() {
    this.solutions = [...INITIAL_PROVEN_SOLUTIONS];
  }

  public getAllSolutions(): ProvenSolution[] {
    return [...this.solutions];
  }

  public getSolutionById(id: string): ProvenSolution | undefined {
    return this.solutions.find((s) => s.id === id || s.code === id);
  }

  public getCategories(): string[] {
    return Array.from(new Set(this.solutions.map((s) => s.category)));
  }

  public getTechnologies(): string[] {
    const set = new Set<string>();
    this.solutions.forEach((s) => {
      s.technology.softwareStack.forEach((t) => set.add(t));
      s.technology.connectivity.forEach((t) => set.add(t));
      s.technology.aiCapabilities.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }

  public getDepartments(): string[] {
    const set = new Set<string>();
    this.solutions.forEach((s) => {
      s.applicableDepartments.forEach((d) => set.add(d));
    });
    return Array.from(set);
  }

  public getLocations(): string[] {
    const set = new Set<string>();
    this.solutions.forEach((s) => {
      set.add(`${s.pilotLocation.city}, ${s.pilotLocation.state}`);
    });
    return Array.from(set);
  }

  public filterSolutions(params: {
    search?: string;
    category?: string;
    technology?: string;
    department?: string;
    location?: string;
    sortBy?: "kpi" | "savings" | "duration" | "cost";
  }): ProvenSolution[] {
    let result = [...this.solutions];

    // Search query across title, problem, startup, tech, tags
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.problem.statement.toLowerCase().includes(q) ||
          s.problem.civicContext.toLowerCase().includes(q) ||
          s.startup.name.toLowerCase().includes(q) ||
          s.startup.dpiitNumber.toLowerCase().includes(q) ||
          s.pilotLocation.city.toLowerCase().includes(q) ||
          s.pilotLocation.state.toLowerCase().includes(q) ||
          s.technology.architecture.toLowerCase().includes(q) ||
          s.applicableDepartments.some((d) => d.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (params.category && params.category !== "ALL") {
      result = result.filter((s) => s.category === params.category);
    }

    // Department filter
    if (params.department && params.department !== "ALL") {
      result = result.filter((s) =>
        s.applicableDepartments.some((d) =>
          d.toLowerCase().includes(params.department!.toLowerCase())
        )
      );
    }

    // Location filter
    if (params.location && params.location !== "ALL") {
      result = result.filter(
        (s) =>
          s.pilotLocation.city.toLowerCase() === params.location!.toLowerCase() ||
          `${s.pilotLocation.city}, ${s.pilotLocation.state}`.toLowerCase() ===
            params.location!.toLowerCase()
      );
    }

    // Technology filter
    if (params.technology && params.technology !== "ALL") {
      const techQ = params.technology.toLowerCase();
      result = result.filter(
        (s) =>
          s.technology.architecture.toLowerCase().includes(techQ) ||
          s.technology.softwareStack.some((t) => t.toLowerCase().includes(techQ)) ||
          s.technology.hardwareSpecs.some((t) => t.toLowerCase().includes(techQ)) ||
          s.technology.connectivity.some((t) => t.toLowerCase().includes(techQ)) ||
          s.technology.aiCapabilities.some((t) => t.toLowerCase().includes(techQ))
      );
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case "savings":
          result.sort((a, b) => b.cost.savingsVsLegacyPercentage - a.cost.savingsVsLegacyPercentage);
          break;
        case "duration":
          result.sort((a, b) => b.pilotDuration.durationDays - a.pilotDuration.durationDays);
          break;
        case "cost":
          result.sort((a, b) => a.cost.perUnitScaleInr - b.cost.perUnitScaleInr);
          break;
        case "kpi":
        default:
          result.sort((a, b) => a.featuredOrder - b.featuredOrder);
          break;
      }
    }

    return result;
  }
}

export const provenSolutionsDb = new ProvenSolutionsDatabase();
