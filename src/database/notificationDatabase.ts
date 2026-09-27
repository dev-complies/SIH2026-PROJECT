/**
 * Contextual Notification Database & Anti-Spam Dispatch Engine
 * Enforces role-based relevance filtering, deduplication, and user notification preferences.
 */

import { UserRole, User } from "@/types";

export type NotificationType =
  | "Application Deadline"
  | "Evaluation Assignment"
  | "Evaluation Pending"
  | "Milestone Due"
  | "Milestone Overdue"
  | "Payment Pending"
  | "Validation Required"
  | "Risk Alert"
  | "Document Expiry"
  | "Challenge Closing";

export type NotificationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";

export type NotificationCategory =
  | "DEADLINE"
  | "EVALUATION"
  | "MILESTONE"
  | "PAYMENT"
  | "VALIDATION"
  | "RISK"
  | "DOCUMENT"
  | "CHALLENGE";

export interface ContextualNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  recipientRoles: UserRole[];
  recipientUserIds?: string[]; // If specified, only matches these exact user IDs
  entityType: string;
  entityId: string;
  actionUrl: string;
  actionLabel: string;
  createdAt: string; // ISO 8601
  read: boolean;
  readAt?: string;
  dedupKey: string; // Fingerprint for spam prevention
}

export interface TypePreference {
  inApp: boolean;
  emailDigest: boolean;
  urgentSms: boolean;
}

export interface NotificationPreferences {
  userId: string;
  role: UserRole;
  types: Record<NotificationType, TypePreference>;
  antiSpam: {
    consolidateDigest: boolean;
    muteLowPriority: boolean;
    quietHoursEnabled: boolean;
    minIntervalMinutes: number;
  };
}

export const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  "Application Deadline",
  "Evaluation Assignment",
  "Evaluation Pending",
  "Milestone Due",
  "Milestone Overdue",
  "Payment Pending",
  "Validation Required",
  "Risk Alert",
  "Document Expiry",
  "Challenge Closing",
];

// Role-Relevance Matrix: Defines which roles legitimately need to receive each notification type
// Strictly prevents notification leaks and operational spam
export const ROLE_RELEVANCE_MAP: Record<NotificationType, UserRole[]> = {
  "Application Deadline": ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Evaluation Assignment": ["EXPERT", "EXPERT_EVALUATOR", "ADMIN", "PLATFORM_ADMIN"],
  "Evaluation Pending": ["EXPERT", "EXPERT_EVALUATOR", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Milestone Due": ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Milestone Overdue": ["STARTUP", "GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Payment Pending": ["PROCUREMENT_OFFICER", "GOVERNMENT_OFFICER", "STARTUP", "ADMIN", "PLATFORM_ADMIN"],
  "Validation Required": ["VALIDATOR", "INDEPENDENT_VALIDATOR", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Risk Alert": ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "VALIDATOR", "INDEPENDENT_VALIDATOR", "ADMIN", "PLATFORM_ADMIN"],
  "Document Expiry": ["STARTUP", "PROCUREMENT_OFFICER", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
  "Challenge Closing": ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN", "PLATFORM_ADMIN"],
};

export const DEFAULT_TYPE_PREFERENCES: Record<NotificationType, TypePreference> = {
  "Application Deadline": { inApp: true, emailDigest: true, urgentSms: false },
  "Evaluation Assignment": { inApp: true, emailDigest: true, urgentSms: true },
  "Evaluation Pending": { inApp: true, emailDigest: true, urgentSms: false },
  "Milestone Due": { inApp: true, emailDigest: true, urgentSms: false },
  "Milestone Overdue": { inApp: true, emailDigest: true, urgentSms: true },
  "Payment Pending": { inApp: true, emailDigest: true, urgentSms: false },
  "Validation Required": { inApp: true, emailDigest: true, urgentSms: true },
  "Risk Alert": { inApp: true, emailDigest: true, urgentSms: true },
  "Document Expiry": { inApp: true, emailDigest: true, urgentSms: false },
  "Challenge Closing": { inApp: true, emailDigest: true, urgentSms: false },
};

export function getDefaultPreferences(userId: string, role: UserRole): NotificationPreferences {
  return {
    userId,
    role,
    types: { ...DEFAULT_TYPE_PREFERENCES },
    antiSpam: {
      consolidateDigest: true,
      muteLowPriority: false,
      quietHoursEnabled: true,
      minIntervalMinutes: 60,
    },
  };
}

// Canonical Seed Notifications covering all 10 Prompt Types
const INITIAL_NOTIFICATIONS: ContextualNotification[] = [
  // 1. Application Deadline
  {
    id: "NOTIF-001",
    type: "Application Deadline",
    title: "Application Deadline Approaching (48 Hours)",
    message: "Deadline for Challenge CHAL-UP-DUD-001 (Smart Water Telemetry Lucknow) ends in 48 hours. Ensure DPR and technical feasibility models are locked.",
    category: "DEADLINE",
    severity: "HIGH",
    recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN"],
    entityType: "Challenge",
    entityId: "CHAL-UP-DUD-001",
    actionUrl: "/challenges/CHAL-UP-DUD-001",
    actionLabel: "Review Application",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    read: false,
    dedupKey: "Application Deadline:CHAL-UP-DUD-001",
  },
  // 2. Evaluation Assignment
  {
    id: "NOTIF-002",
    type: "Evaluation Assignment",
    title: "New Technical Proposal Assigned for Blind Review",
    message: "You have been nominated to evaluate Application APP-2026-089 against the statutory 5-point evaluation rubric. Evaluation window is active.",
    category: "EVALUATION",
    severity: "HIGH",
    recipientRoles: ["EXPERT", "EXPERT_EVALUATOR", "ADMIN"],
    recipientUserIds: ["usr-005"], // Dr. Arvind Gupta
    entityType: "Application",
    entityId: "APP-2026-089",
    actionUrl: "/expert/dashboard",
    actionLabel: "Commence Evaluation",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    read: false,
    dedupKey: "Evaluation Assignment:APP-2026-089",
  },
  // 3. Evaluation Pending
  {
    id: "NOTIF-003",
    type: "Evaluation Pending",
    title: "Evaluation Scoring Pending Consensus",
    message: "2 expert evaluations are pending for Challenge CHAL-UP-DUD-001. Scoring window closes in 24 hours to finalize pilot shortlist.",
    category: "EVALUATION",
    severity: "MEDIUM",
    recipientRoles: ["EXPERT", "EXPERT_EVALUATOR", "GOVERNMENT_OFFICER", "ADMIN"],
    entityType: "Challenge",
    entityId: "CHAL-UP-DUD-001",
    actionUrl: "/expert/evaluations",
    actionLabel: "Complete Scoring",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    read: false,
    dedupKey: "Evaluation Pending:CHAL-UP-DUD-001",
  },
  // 4. Milestone Due
  {
    id: "NOTIF-004",
    type: "Milestone Due",
    title: "Milestone 3 Deliverable Due in 5 Days",
    message: "Pilot PIL-2026-089: Milestone 3 ('Telemetry Integration & 90-Day Sensor Benchmark') is scheduled for submission on 15 Oct 2026.",
    category: "MILESTONE",
    severity: "MEDIUM",
    recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN"],
    entityType: "Milestone",
    entityId: "MS-003",
    actionUrl: "/gov/pilots/report",
    actionLabel: "View Milestone Spec",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // 5 hours ago
    read: false,
    dedupKey: "Milestone Due:MS-003",
  },
  // 5. Milestone Overdue
  {
    id: "NOTIF-005",
    type: "Milestone Overdue",
    title: "Urgent: Milestone 2 Calibration Overdue",
    message: "Sensor field calibration report for Pilot PIL-2026-014 (Varanasi Ghat Sanitation) is 3 days overdue. Liquidated damages notice initiated.",
    category: "MILESTONE",
    severity: "CRITICAL",
    recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "ADMIN"],
    entityType: "Milestone",
    entityId: "MS-002-VAR",
    actionUrl: "/gov/dashboard?tab=pilots",
    actionLabel: "Submit Escalation Notice",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    read: false,
    dedupKey: "Milestone Overdue:MS-002-VAR",
  },
  // 6. Payment Pending
  {
    id: "NOTIF-006",
    type: "Payment Pending",
    title: "Payment Disbursement Sanction Pending",
    message: "Milestone 2 tranche of ₹2,50,000 for AquaSense Technologies has passed verification and awaits PFMS treasury approval.",
    category: "PAYMENT",
    severity: "HIGH",
    recipientRoles: ["PROCUREMENT_OFFICER", "GOVERNMENT_OFFICER", "STARTUP", "ADMIN"],
    entityType: "Payment",
    entityId: "PAY-2026-002",
    actionUrl: "/payments",
    actionLabel: "Sanction Tranche",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 hours ago
    read: false,
    dedupKey: "Payment Pending:PAY-2026-002",
  },
  // 7. Validation Required
  {
    id: "NOTIF-007",
    type: "Validation Required",
    title: "Independent Technical Validation Required",
    message: "Pilot PIL-2026-089 has completed 90-day deployment. Independent validator certification required on water leakage reduction KPIs.",
    category: "VALIDATION",
    severity: "HIGH",
    recipientRoles: ["VALIDATOR", "INDEPENDENT_VALIDATOR", "GOVERNMENT_OFFICER", "ADMIN"],
    recipientUserIds: ["usr-006"], // Priya Nair
    entityType: "ValidationReport",
    entityId: "VAL-2026-001",
    actionUrl: "/validator/dashboard",
    actionLabel: "Start Validation Audit",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), // 20 hours ago
    read: false,
    dedupKey: "Validation Required:VAL-2026-001",
  },
  // 8. Risk Alert
  {
    id: "NOTIF-008",
    type: "Risk Alert",
    title: "Risk Alert: Cybersecurity Firmware Vulnerability Flagged",
    message: "Risk RSK-2026-007: Edge IoT telemetry firmware in Lucknow deployment requires critical cryptographic patch prior to municipal SCADA tie-in.",
    category: "RISK",
    severity: "CRITICAL",
    recipientRoles: ["GOVERNMENT_OFFICER", "PROCUREMENT_OFFICER", "VALIDATOR", "ADMIN"],
    entityType: "Risk",
    entityId: "RSK-2026-007",
    actionUrl: "/risks-issues",
    actionLabel: "Inspect Risk & Mitigation",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // 1 day ago
    read: false,
    dedupKey: "Risk Alert:RSK-2026-007",
  },
  // 9. Document Expiry
  {
    id: "NOTIF-009",
    type: "Document Expiry",
    title: "Document Expiry Warning (NDA & Data Security Agreement)",
    message: "Bilateral Data Sharing Agreement DOC-2026-004 expires on 15 Oct 2026. Renewal addendum required under DPDP Act 2023.",
    category: "DOCUMENT",
    severity: "MEDIUM",
    recipientRoles: ["STARTUP", "PROCUREMENT_OFFICER", "GOVERNMENT_OFFICER", "ADMIN"],
    entityType: "Document",
    entityId: "DOC-2026-004",
    actionUrl: "/documents",
    actionLabel: "Execute Addendum",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 1.5 days ago
    read: true,
    readAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    dedupKey: "Document Expiry:DOC-2026-004",
  },
  // 10. Challenge Closing
  {
    id: "NOTIF-010",
    type: "Challenge Closing",
    title: "Challenge Portal Closing in 24 Hours",
    message: "RFP Portal for Challenge CHAL-UP-DUD-001 will permanently close for new proposals on 28 Sep 2026 at 23:59 IST.",
    category: "CHALLENGE",
    severity: "HIGH",
    recipientRoles: ["STARTUP", "GOVERNMENT_OFFICER", "ADMIN"],
    entityType: "Challenge",
    entityId: "CHAL-UP-DUD-001",
    actionUrl: "/challenges/CHAL-UP-DUD-001",
    actionLabel: "View Portal Status",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago
    read: true,
    readAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    dedupKey: "Challenge Closing:CHAL-UP-DUD-001",
  },
];

class NotificationDatabase {
  private notifications: ContextualNotification[] = [...INITIAL_NOTIFICATIONS];
  private preferencesMap: Map<string, NotificationPreferences> = new Map();
  // Anti-spam deduplication log: Map of dedupKey -> lastTimestamp
  private dedupHistory: Map<string, number> = new Map();

  constructor() {
    // Populate dedup history with initial keys
    for (const notif of this.notifications) {
      this.dedupHistory.set(notif.dedupKey, new Date(notif.createdAt).getTime());
    }
  }

  /**
   * Role Normalizer
   */
  private normalizeRole(role: UserRole | string): UserRole {
    switch (role) {
      case "ADMIN":
      case "PLATFORM_ADMIN":
        return "ADMIN";
      case "EXPERT":
      case "EXPERT_EVALUATOR":
        return "EXPERT";
      case "VALIDATOR":
      case "INDEPENDENT_VALIDATOR":
        return "VALIDATOR";
      case "GOVERNMENT_OFFICER":
        return "GOVERNMENT_OFFICER";
      case "PROCUREMENT_OFFICER":
        return "PROCUREMENT_OFFICER";
      case "STARTUP":
        return "STARTUP";
      default:
        return "STARTUP";
    }
  }

  /**
   * Retrieves notifications contextualized to the requesting user and their active role.
   * Enforces:
   * 1. Role-Relevance Filtering (Only notify users about relevant events)
   * 2. User-specific Direct Routing (if recipientUserIds specified)
   * 3. User Preferences (inApp toggle, mute low priority)
   * 4. Anti-spam suppression
   */
  public getNotificationsForUser(
    user?: User | null,
    filterOptions?: {
      readStatus?: "ALL" | "UNREAD" | "READ";
      category?: string;
      type?: NotificationType;
      search?: string;
    }
  ): ContextualNotification[] {
    const role = user ? this.normalizeRole(user.role) : "GOVERNMENT_OFFICER";
    const userId = user?.id || "guest";
    const prefs = this.getPreferences(userId, role);

    return this.notifications.filter((notif) => {
      // 1. Role Relevance Check: Is this notification type relevant to the user's role?
      const allowedRoles = ROLE_RELEVANCE_MAP[notif.type] || [];
      const hasRoleRelevance =
        allowedRoles.includes(role) ||
        notif.recipientRoles.map((r) => this.normalizeRole(r)).includes(role);

      if (!hasRoleRelevance) {
        return false;
      }

      // 2. Direct User Targeted Check: If notification is specifically addressed to certain user IDs
      if (notif.recipientUserIds && notif.recipientUserIds.length > 0) {
        if (user && !notif.recipientUserIds.includes(user.id) && role !== "ADMIN") {
          return false;
        }
      }

      // 3. User Preference Check: Did user disable in-app notifications for this type?
      const typePref = prefs.types[notif.type];
      if (typePref && !typePref.inApp) {
        return false;
      }

      // 4. Anti-Spam Mute Low Priority: If enabled, suppress INFO severity
      if (prefs.antiSpam.muteLowPriority && notif.severity === "INFO") {
        return false;
      }

      // 5. Query Filters
      if (filterOptions?.readStatus === "UNREAD" && notif.read) return false;
      if (filterOptions?.readStatus === "READ" && !notif.read) return false;
      if (filterOptions?.category && filterOptions.category !== "ALL" && notif.category !== filterOptions.category) {
        return false;
      }
      if (filterOptions?.type && notif.type !== filterOptions.type) return false;
      if (filterOptions?.search) {
        const q = filterOptions.search.toLowerCase();
        const matches =
          notif.title.toLowerCase().includes(q) ||
          notif.message.toLowerCase().includes(q) ||
          notif.entityId.toLowerCase().includes(q) ||
          notif.type.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }

  /**
   * Retrieves accurate unread count for user
   */
  public getUnreadCount(user?: User | null): number {
    const userNotifications = this.getNotificationsForUser(user);
    return userNotifications.filter((n) => !n.read).length;
  }

  /**
   * Mark individual notification as read
   */
  public markAsRead(id: string): boolean {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      item.readAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Mark individual notification as unread
   */
  public markAsUnread(id: string): boolean {
    const item = this.notifications.find((n) => n.id === id);
    if (item) {
      item.read = false;
      item.readAt = undefined;
      return true;
    }
    return false;
  }

  /**
   * Mark all relevant notifications as read for a user
   */
  public markAllAsRead(user?: User | null): number {
    const relevant = this.getNotificationsForUser(user);
    let count = 0;
    for (const notif of relevant) {
      if (!notif.read) {
        notif.read = true;
        notif.readAt = new Date().toISOString();
        count++;
      }
    }
    return count;
  }

  /**
   * Clear all relevant notifications for a user
   */
  public clearAll(user?: User | null): number {
    const relevantIds = new Set(this.getNotificationsForUser(user).map((n) => n.id));
    const initialLen = this.notifications.length;
    this.notifications = this.notifications.filter((n) => !relevantIds.has(n.id));
    return initialLen - this.notifications.length;
  }

  /**
   * Delete single notification
   */
  public deleteNotification(id: string): boolean {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.notifications.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Anti-Spam Dispatch Engine
   * Validates deduplication and role-relevance before creating a new notification.
   */
  public dispatchNotification(params: {
    type: NotificationType;
    title: string;
    message: string;
    category?: NotificationCategory;
    severity?: NotificationSeverity;
    recipientRoles?: UserRole[];
    recipientUserIds?: string[];
    entityType: string;
    entityId: string;
    actionUrl: string;
    actionLabel: string;
  }): { success: boolean; notification?: ContextualNotification; reason?: string } {
    const dedupKey = `${params.type}:${params.entityId}`;
    const now = Date.now();
    const lastTriggered = this.dedupHistory.get(dedupKey);

    // Anti-spam rule: If duplicate notification was dispatched within 60 minutes, suppress to avoid spam
    if (lastTriggered && now - lastTriggered < 60 * 60 * 1000) {
      // Find existing notification and update timestamp rather than polluting inbox
      const existing = this.notifications.find((n) => n.dedupKey === dedupKey);
      if (existing) {
        existing.createdAt = new Date().toISOString();
        existing.message = params.message;
        existing.read = false; // Mark unread again to notify of update
        this.dedupHistory.set(dedupKey, now);
        return {
          success: true,
          notification: existing,
          reason: "Updated existing alert (anti-spam deduplication applied)",
        };
      }
    }

    const defaultRoles = ROLE_RELEVANCE_MAP[params.type] || ["GOVERNMENT_OFFICER", "ADMIN"];
    const recipientRoles = params.recipientRoles || defaultRoles;

    const newNotification: ContextualNotification = {
      id: `NOTIF-${String(this.notifications.length + 1).padStart(3, "0")}`,
      type: params.type,
      title: params.title,
      message: params.message,
      category: params.category || "CHALLENGE",
      severity: params.severity || "MEDIUM",
      recipientRoles,
      recipientUserIds: params.recipientUserIds,
      entityType: params.entityType,
      entityId: params.entityId,
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      createdAt: new Date().toISOString(),
      read: false,
      dedupKey,
    };

    this.notifications.unshift(newNotification);
    this.dedupHistory.set(dedupKey, now);

    return {
      success: true,
      notification: newNotification,
    };
  }

  /**
   * User Notification Preferences
   */
  public getPreferences(userId: string, role: UserRole): NotificationPreferences {
    const key = `${userId}:${role}`;
    if (!this.preferencesMap.has(key)) {
      this.preferencesMap.set(key, getDefaultPreferences(userId, role));
    }
    return this.preferencesMap.get(key)!;
  }

  public savePreferences(prefs: NotificationPreferences): NotificationPreferences {
    const key = `${prefs.userId}:${prefs.role}`;
    this.preferencesMap.set(key, { ...prefs });
    return this.preferencesMap.get(key)!;
  }
}

export const notificationDb = new NotificationDatabase();
