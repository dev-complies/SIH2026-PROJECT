"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  FileCheck2,
  X,
  ExternalLink,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Calendar,
  FileText,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  ContextualNotification,
  NotificationType,
} from "@/database/notificationDatabase";
import { NotificationPreferencesModal } from "@/components/notifications/NotificationPreferencesModal";

export function NotificationCenter() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [notifications, setNotifications] = useState<ContextualNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "ALL" | "UNREAD" | "DEADLINE" | "EVALUATION" | "MILESTONE" | "PAYMENT" | "RISK"
  >("ALL");

  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch contextual notifications for active user & role
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh when dropdown opens or user/role switches
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, currentUser?.role, currentUser?.id]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markOneAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", notificationId: id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markOneAsUnread = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-unread", notificationId: id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: false } : n))
        );
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-all-read" }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        showToast({ type: "info", title: "All notifications marked as read" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-all" }),
      });
      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
        showToast({ type: "info", title: "Notification tray cleared" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    if (filter === "DEADLINE") return n.category === "DEADLINE" || n.category === "CHALLENGE";
    if (filter === "EVALUATION") return n.category === "EVALUATION";
    if (filter === "MILESTONE") return n.category === "MILESTONE";
    if (filter === "PAYMENT") return n.category === "PAYMENT";
    if (filter === "RISK") return n.category === "RISK" || n.category === "DOCUMENT";
    return true;
  });

  const getNotificationIcon = (type: NotificationType, severity: string) => {
    if (severity === "CRITICAL") {
      return <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />;
    }
    switch (type) {
      case "Application Deadline":
      case "Challenge Closing":
        return <Calendar className="w-4 h-4 text-amber-600 shrink-0" />;
      case "Evaluation Assignment":
      case "Evaluation Pending":
        return <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0" />;
      case "Milestone Due":
      case "Milestone Overdue":
        return <Clock className="w-4 h-4 text-blue-600 shrink-0" />;
      case "Payment Pending":
        return <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />;
      case "Validation Required":
        return <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />;
      case "Risk Alert":
        return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />;
      case "Document Expiry":
        return <FileText className="w-4 h-4 text-orange-600 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 shrink-0" />;
    }
  };

  return (
    <>
      <div className="relative" ref={panelRef}>
        {/* Bell Trigger Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) fetchNotifications();
          }}
          className="relative p-2 rounded-control text-slate-600 hover:text-gov-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-accent"
          title="Contextual Notifications & Alerts"
          aria-label="Contextual Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white font-mono shadow-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-[440px] rounded-card border border-gov-border bg-white shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wide">
                  Notifications
                </h3>
                {unreadCount > 0 ? (
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-mono">
                    {unreadCount} UNREAD
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] text-emerald-700 bg-emerald-50 border-emerald-200">
                    ALL CAUGHT UP
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-gov-accent hover:underline font-medium text-[11px]"
                  >
                    Mark all read
                  </button>
                )}
                {/* Preferences Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsPreferencesOpen(true);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                  title="Configure Notification Preferences"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center space-x-1.5 text-[11px] bg-white overflow-x-auto scrollbar-none">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "ALL"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("UNREAD")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "UNREAD"
                    ? "bg-red-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("DEADLINE")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "DEADLINE"
                    ? "bg-amber-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Deadlines
              </button>
              <button
                onClick={() => setFilter("EVALUATION")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "EVALUATION"
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Evaluations
              </button>
              <button
                onClick={() => setFilter("MILESTONE")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "MILESTONE"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pilots
              </button>
              <button
                onClick={() => setFilter("PAYMENT")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "PAYMENT"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Treasury
              </button>
              <button
                onClick={() => setFilter("RISK")}
                className={`px-2 py-0.5 rounded font-medium shrink-0 transition-colors ${
                  filter === "RISK"
                    ? "bg-rose-600 text-white font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Risks
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              {loading && notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-gov-muted animate-pulse">
                  Loading relevant notifications...
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-gov-muted px-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2 opacity-70" />
                  No alerts in this category for {currentUser?.role || "your role"}
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs transition-colors hover:bg-slate-50 relative group ${
                      !item.read ? "bg-blue-50/40" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      {/* Category Icon */}
                      <div className="mt-0.5">
                        {getNotificationIcon(item.type, item.severity)}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title and Timestamp */}
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-semibold text-slate-900 leading-snug">
                              {item.title}
                            </span>
                            {!item.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-gov-muted shrink-0 ml-1">
                            {new Date(item.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Notification Type & Severity Badge */}
                        <div className="flex items-center space-x-1.5 mt-1">
                          <Badge variant="outline" className="text-[9px] py-0 px-1 font-medium bg-slate-50">
                            {item.type}
                          </Badge>
                          {item.severity === "CRITICAL" && (
                            <Badge variant="destructive" className="text-[9px] py-0 px-1 font-mono">
                              CRITICAL
                            </Badge>
                          )}
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.entityId}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                          {item.message}
                        </p>

                        {/* Action Link & Read Status Actions */}
                        <div className="mt-2.5 flex items-center justify-between pt-1">
                          <Link
                            href={item.actionUrl}
                            onClick={() => {
                              if (!item.read) markOneAsRead(item.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center text-[10px] font-bold text-gov-accent hover:underline group-hover:text-blue-800"
                          >
                            <span>{item.actionLabel}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-1" />
                          </Link>

                          <div className="flex items-center space-x-2">
                            {item.read ? (
                              <button
                                onClick={(e) => markOneAsUnread(item.id, e)}
                                className="text-[10px] text-slate-400 hover:text-slate-700 transition-colors"
                                title="Mark as unread"
                              >
                                Mark unread
                              </button>
                            ) : (
                              <button
                                onClick={(e) => markOneAsRead(item.id, e)}
                                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                title="Mark as read"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 flex justify-between items-center text-[11px] text-gov-muted">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-gov-primary hover:underline font-semibold flex items-center text-[11px]"
              >
                <FolderOpen className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Open Notification Center
              </Link>

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="hover:text-red-700 hover:underline text-[10px]"
                >
                  Clear tray
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={fetchNotifications}
      />
    </>
  );
}
