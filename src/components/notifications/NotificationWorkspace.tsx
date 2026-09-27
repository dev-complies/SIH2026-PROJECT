"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CreditCard,
  FileCheck2,
  Sliders,
  Filter,
  Search,
  ExternalLink,
  Shield,
  ShieldAlert,
  Calendar,
  FileText,
  RotateCcw,
  Sparkles,
  Trash2,
  MailCheck,
  Check,
  Volume2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  ContextualNotification,
  NotificationType,
  ALL_NOTIFICATION_TYPES,
  ROLE_RELEVANCE_MAP,
} from "@/database/notificationDatabase";
import { NotificationPreferencesModal } from "@/components/notifications/NotificationPreferencesModal";

export function NotificationWorkspace() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<ContextualNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (readFilter !== "ALL") params.set("readStatus", readFilter);
      if (selectedType !== "ALL") params.set("type", selectedType);
      if (search) params.set("search", search);

      const res = await fetch(`/api/notifications?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setCategoryCounts(data.categoryCounts || {});
      }
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Error loading notifications" });
    } finally {
      setLoading(false);
    }
  }, [readFilter, selectedType, search, showToast]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications, currentUser?.role]);

  const toggleReadStatus = async (item: ContextualNotification) => {
    const action = item.read ? "mark-unread" : "mark-read";
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notificationId: item.id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: !item.read } : n))
        );
        setUnreadCount((c) => (item.read ? c + 1 : Math.max(0, c - 1)));
      }
    } catch (err) {
      showToast({ type: "error", title: "Failed to update status" });
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-all-read" }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        showToast({ type: "success", title: "All notifications marked as read" });
      }
    } catch (err) {
      showToast({ type: "error", title: "Error marking all read" });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", notificationId: id }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        showToast({ type: "info", title: "Notification dismissed" });
      }
    } catch (err) {
      showToast({ type: "error", title: "Failed to dismiss" });
    }
  };

  // Dispatch a simulated test contextual notification to verify dynamic delivery & anti-spam
  const handleSimulateAlert = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Milestone Due",
          title: "Milestone Due: Lucknow Sensor Telemetry Review",
          message: "Demonstration alert dispatched for Lucknow Smart City telemetry review. Anti-spam deduplication active.",
          category: "MILESTONE",
          severity: "MEDIUM",
          recipientRoles: ["GOVERNMENT_OFFICER", "STARTUP", "ADMIN"],
          entityType: "Milestone",
          entityId: "MS-003",
          actionUrl: "/gov/pilots/report",
          actionLabel: "Inspect Milestone",
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.reason) {
          showToast({ type: "info", title: data.reason });
        } else {
          showToast({ type: "success", title: "New contextual alert dispatched and routed" });
        }
        loadNotifications();
      }
    } catch (err) {
      showToast({ type: "error", title: "Failed to dispatch test notification" });
    }
  };

  // Filter local items by severity if selected
  const displayedNotifications = notifications.filter((n) => {
    if (selectedSeverity !== "ALL" && n.severity !== selectedSeverity) {
      return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return (
          <Badge variant="destructive" className="font-mono text-xs">
            CRITICAL
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="warning" className="font-mono text-xs">
            HIGH
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="default" className="bg-blue-600 font-mono text-xs">
            MEDIUM
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-mono text-xs">
            INFO
          </Badge>
        );
    }
  };

  const getNotificationIcon = (type: NotificationType, severity: string) => {
    if (severity === "CRITICAL") {
      return <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />;
    }
    switch (type) {
      case "Application Deadline":
      case "Challenge Closing":
        return <Calendar className="w-5 h-5 text-amber-600 shrink-0" />;
      case "Evaluation Assignment":
      case "Evaluation Pending":
        return <FileCheck2 className="w-5 h-5 text-indigo-600 shrink-0" />;
      case "Milestone Due":
      case "Milestone Overdue":
        return <Clock className="w-5 h-5 text-blue-600 shrink-0" />;
      case "Payment Pending":
        return <CreditCard className="w-5 h-5 text-emerald-600 shrink-0" />;
      case "Validation Required":
        return <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />;
      case "Risk Alert":
        return <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
      case "Document Expiry":
        return <FileText className="w-5 h-5 text-orange-600 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contextual Notification Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-5">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <Badge variant="default" className="bg-gov-primary font-mono text-xs">
              ROLE CONTEXT: {currentUser?.role || "GOVERNMENT_OFFICER"}
            </Badge>
            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-xs">
              <Shield className="w-3 h-3 mr-1" /> ANTI-SPAM PROTECTION ACTIVE
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gov-primary tracking-tight">
            Contextual Notification Center
          </h1>
          <p className="text-xs text-gov-muted">
            Intelligent role-aware event routing across 10 statutory lifecycle triggers with delivery customization and spam suppression
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreferencesOpen(true)}
            className="text-xs"
          >
            <Sliders className="w-3.5 h-3.5 mr-1 text-gov-muted" />
            Preferences
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-xs"
          >
            <MailCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Mark All Read
          </Button>

          <Button
            size="sm"
            onClick={handleSimulateAlert}
            className="bg-gov-accent hover:bg-gov-accent/90 text-white text-xs"
          >
            <Bell className="w-3.5 h-3.5 mr-1" />
            Simulate Alert
          </Button>
        </div>
      </div>

      {/* Role Relevance Routing Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Contextual Event Routing Guarantee:</span>
            <p className="text-slate-600 text-xs mt-0.5">
              You only receive notifications pertinent to your authorized operational duties as a{" "}
              <strong className="text-blue-950 font-semibold">{currentUser?.role || "Government Official"}</strong>.
              Statutory evaluations are blinded, payment tranches are routed to procurement, and milestone deadlines are isolated to vendors.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-blue-950">{unreadCount}</div>
            <div className="text-xs text-blue-700 uppercase font-semibold">Unread Alerts</div>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-blue-950">{displayedNotifications.length}</div>
            <div className="text-xs text-blue-700 uppercase font-semibold">Matching Events</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gov-border shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gov-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications by title, entity, or keyword..."
            className="pl-9 text-xs h-9 bg-slate-50/50"
          />
        </div>

        {/* Read / Unread Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs shrink-0">
          <button
            onClick={() => setReadFilter("ALL")}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              readFilter === "ALL"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setReadFilter("UNREAD")}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center space-x-1 ${
              readFilter === "UNREAD"
                ? "bg-red-600 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-xs font-mono ${
                readFilter === "UNREAD" ? "bg-white text-red-700" : "bg-red-100 text-red-700"
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setReadFilter("READ")}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              readFilter === "READ"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Read
          </button>
        </div>

        {/* Notification Type Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-gov-border bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-accent cursor-pointer"
          >
            <option value="ALL">All 10 Notification Types</option>
            {ALL_NOTIFICATION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Severity Dropdown */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-9 px-3 text-xs rounded-lg border border-gov-border bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-gov-accent cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Main Notifications Stream */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center text-xs text-gov-muted bg-white rounded-xl border border-gov-border">
            Loading contextual notifications...
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gov-border p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-sm font-bold text-slate-800">No Notifications Found</h3>
            <p className="text-xs text-gov-muted max-w-md mx-auto mt-1">
              There are no pending alerts matching your active filter criteria for role{" "}
              <strong>{currentUser?.role || "GUEST"}</strong>.
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all ${
                !notif.read
                  ? "bg-blue-50/30 border-blue-200 shadow-xs hover:border-blue-300"
                  : "bg-white border-gov-border hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: Icon & Content */}
                <div className="flex items-start space-x-3.5 flex-1">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                    {getNotificationIcon(notif.type, notif.severity)}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-bold text-sm text-slate-900">
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <Badge variant="warning" className="text-xs py-0 px-1 font-mono">
                          NEW
                        </Badge>
                      )}
                      {getSeverityBadge(notif.severity)}
                      <Badge variant="outline" className="text-xs py-0 font-medium">
                        {notif.type}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center space-x-4 pt-1 text-xs text-gov-muted">
                      <span className="font-mono">
                        Entity: <strong className="text-slate-700">{notif.entityType} ({notif.entityId})</strong>
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        {new Date(notif.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span className="text-xs text-slate-400 font-mono">
                        Dedup: {notif.dedupKey}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link href={notif.actionUrl}>
                    <Button
                      size="sm"
                      className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs h-8"
                      onClick={() => {
                        if (!notif.read) toggleReadStatus(notif);
                      }}
                    >
                      <span>{notif.actionLabel}</span>
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </Link>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleReadStatus(notif)}
                      className={`text-xs font-medium transition-colors ${
                        notif.read
                          ? "text-slate-400 hover:text-slate-700"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      {notif.read ? "Mark unread" : "Mark read"}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={loadNotifications}
      />
    </div>
  );
}
