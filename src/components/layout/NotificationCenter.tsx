"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  FileCheck2,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "ACTION" | "MILESTONE" | "PAYMENT" | "SYSTEM";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Milestone 3 Deliverables Submitted",
    message: "AirSense Technologies uploaded final 90-day collocated air quality sensor dataset for Pilot UAQ-LKO.",
    category: "ACTION",
    timestamp: "12m ago",
    read: false,
    actionUrl: "/gov/dashboard?tab=pilots",
    actionLabel: "Review Deliverables",
  },
  {
    id: "notif-2",
    title: "Blind Expert Scoring Consensus Ready",
    message: "Dr. Alok Gupta completed independent evaluation for Challenge CHAL-UP-DUD-001 (Score: 92.5/100).",
    category: "ACTION",
    timestamp: "45m ago",
    read: false,
    actionUrl: "/gov/dashboard?tab=evaluations",
    actionLabel: "View Consensus",
  },
  {
    id: "notif-3",
    title: "Escrow Milestone 2 Disbursed",
    message: "Treasury transaction RBI-NEFT-91283 for ₹8,00,000 has been cleared to AirSense Technologies.",
    category: "PAYMENT",
    timestamp: "3h ago",
    read: false,
    actionUrl: "/procurement/dashboard",
    actionLabel: "View Treasury Receipt",
  },
  {
    id: "notif-4",
    title: "Collocated Verification Report Filed",
    message: "TERI Environmental auditor confirmed R2 = 0.95 collocated correlation against CPCB reference station.",
    category: "MILESTONE",
    timestamp: "1d ago",
    read: true,
    actionUrl: "/validator/dashboard",
    actionLabel: "Inspect Report",
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"ALL" | "ACTION" | "MILESTONE" | "PAYMENT">("ALL");
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    return n.category === filter;
  });

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-control text-slate-600 hover:text-gov-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gov-accent"
        title="Operational Notifications"
        aria-label="Operational Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white font-mono shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-card border border-gov-border bg-white shadow-xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-gov-primary uppercase tracking-wide">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0 font-mono">
                  {unreadCount} UNREAD
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-gov-accent hover:underline font-medium"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="px-3 py-2 border-b border-slate-100 flex items-center space-x-1 text-[11px] bg-white overflow-x-auto">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-2 py-0.5 rounded font-medium ${
                filter === "ALL"
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("ACTION")}
              className={`px-2 py-0.5 rounded font-medium ${
                filter === "ACTION"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Action Required
            </button>
            <button
              onClick={() => setFilter("MILESTONE")}
              className={`px-2 py-0.5 rounded font-medium ${
                filter === "MILESTONE"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Milestones
            </button>
            <button
              onClick={() => setFilter("PAYMENT")}
              className={`px-2 py-0.5 rounded font-medium ${
                filter === "PAYMENT"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Treasury
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-gov-muted">
                No notifications in this category
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markOneAsRead(item.id)}
                  className={`p-3.5 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                    !item.read ? "bg-blue-50/30" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <h4 className="font-semibold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-gov-muted shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-gov-muted mt-1 leading-normal pl-3">
                    {item.message}
                  </p>

                  {item.actionLabel && (
                    <div className="mt-2 pl-3">
                      <span className="inline-flex items-center text-[10px] font-semibold text-gov-accent hover:underline">
                        {item.actionLabel}
                        <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex justify-between items-center text-[11px] text-gov-muted">
              <span>Security Event Stream</span>
              <button
                onClick={clearAll}
                className="hover:text-red-700 hover:underline text-[10px]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
