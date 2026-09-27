"use client";

import React, { useState, useEffect } from "react";
import {
  NotificationPreferences,
  NotificationType,
  ALL_NOTIFICATION_TYPES,
  getDefaultPreferences,
} from "@/database/notificationDatabase";
import { useAuth } from "@/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Sliders,
  Shield,
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  Moon,
  Clock,
  VolumeX,
  Save,
  RotateCcw,
} from "lucide-react";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesUpdated?: () => void;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
  onPreferencesUpdated,
}: NotificationPreferencesModalProps) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadPreferences() {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications/preferences");
        const data = await res.json();
        if (data.success && data.preferences) {
          setPrefs(data.preferences);
        } else {
          const fallback = getDefaultPreferences(
            currentUser?.id || "guest",
            currentUser?.role || "GOVERNMENT_OFFICER"
          );
          setPrefs(fallback);
        }
      } catch (err) {
        console.error("Failed to load notification preferences:", err);
        const fallback = getDefaultPreferences(
          currentUser?.id || "guest",
          currentUser?.role || "GOVERNMENT_OFFICER"
        );
        setPrefs(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const toggleChannel = (type: NotificationType, channel: "inApp" | "emailDigest" | "urgentSms") => {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      types: {
        ...prefs.types,
        [type]: {
          ...prefs.types[type],
          [channel]: !prefs.types[type][channel],
        },
      },
    });
  };

  const toggleAntiSpam = (key: keyof NotificationPreferences["antiSpam"]) => {
    if (!prefs) return;
    if (typeof prefs.antiSpam[key] === "boolean") {
      setPrefs({
        ...prefs,
        antiSpam: {
          ...prefs.antiSpam,
          [key]: !prefs.antiSpam[key],
        },
      });
    }
  };

  const handleSave = async () => {
    if (!prefs) return;
    setSaving(true);
    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const data = await res.json();
      if (data.success) {
        showToast({ type: "success", title: "Notification preferences successfully saved" });
        if (onPreferencesUpdated) onPreferencesUpdated();
        onClose();
      } else {
        showToast({ type: "error", title: "Failed to save preferences" });
      }
    } catch (err) {
      showToast({ type: "error", title: "Error updating preferences" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const fallback = getDefaultPreferences(
      currentUser?.id || "guest",
      currentUser?.role || "GOVERNMENT_OFFICER"
    );
    setPrefs(fallback);
    showToast({ type: "info", title: "Reset to statutory default thresholds" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-xl border border-gov-border bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800">
        {/* Header */}
        <div className="border-b border-gov-border bg-slate-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-gov-primary">
                  Notification Delivery Preferences
                </h2>
                <Badge variant="outline" className="font-mono text-xs">
                  {currentUser?.role || "ROLE-AWARE"}
                </Badge>
              </div>
              <p className="text-xs text-gov-muted">
                Control delivery channels across the 10 statutory event types and configure spam suppression
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {loading || !prefs ? (
            <div className="py-12 text-center text-xs text-gov-muted">
              Loading preferences...
            </div>
          ) : (
            <>
              {/* Anti-Spam & Delivery Safeguards Section */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Anti-Spam & Relevance Filtering Controls
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-300 bg-white">
                    Rate Limit: 60m Dedup Window
                  </Badge>
                </div>
                <p className="text-xs text-emerald-800">
                  GovInnovate automatically prevents notification spam by deduplicating repetitive alerts and suppressing irrelevant cross-role signals.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Quiet Hours */}
                  <div
                    onClick={() => toggleAntiSpam("quietHoursEnabled")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      prefs.antiSpam.quietHoursEnabled
                        ? "bg-white border-emerald-400 shadow-xs"
                        : "bg-emerald-100/40 border-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center">
                        <Moon className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Quiet Hours
                      </span>
                      <input
                        type="checkbox"
                        checked={prefs.antiSpam.quietHoursEnabled}
                        onChange={() => {}}
                        className="rounded text-emerald-600"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Mute non-urgent alerts from 10:00 PM to 07:00 AM IST.
                    </p>
                  </div>

                  {/* Mute Low Priority */}
                  <div
                    onClick={() => toggleAntiSpam("muteLowPriority")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      prefs.antiSpam.muteLowPriority
                        ? "bg-white border-emerald-400 shadow-xs"
                        : "bg-emerald-100/40 border-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center">
                        <VolumeX className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Mute Low Priority
                      </span>
                      <input
                        type="checkbox"
                        checked={prefs.antiSpam.muteLowPriority}
                        onChange={() => {}}
                        className="rounded text-emerald-600"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Suppress informational badges during peak working hours.
                    </p>
                  </div>

                  {/* Consolidate Daily Digest */}
                  <div
                    onClick={() => toggleAntiSpam("consolidateDigest")}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      prefs.antiSpam.consolidateDigest
                        ? "bg-white border-emerald-400 shadow-xs"
                        : "bg-emerald-100/40 border-transparent opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Daily Digest
                      </span>
                      <input
                        type="checkbox"
                        checked={prefs.antiSpam.consolidateDigest}
                        onChange={() => {}}
                        className="rounded text-emerald-600"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Batch non-critical events into a 17:00 PM summary digest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Matrix of 10 Notification Types */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Statutory Event Triggers & Channels
                  </h3>
                  <div className="flex items-center space-x-6 text-xs font-semibold text-slate-500 pr-3">
                    <span className="flex items-center">
                      <Bell className="w-3.5 h-3.5 mr-1 text-slate-700" /> In-App
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1 text-slate-700" /> Email
                    </span>
                    <span className="flex items-center">
                      <Smartphone className="w-3.5 h-3.5 mr-1 text-slate-700" /> SMS / Urgent
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-gov-border rounded-lg overflow-hidden bg-white">
                  {ALL_NOTIFICATION_TYPES.map((type) => {
                    const typePref = prefs.types[type] || {
                      inApp: true,
                      emailDigest: true,
                      urgentSms: false,
                    };
                    return (
                      <div
                        key={type}
                        className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900">{type}</span>
                            {type.includes("Overdue") || type.includes("Risk") ? (
                              <Badge variant="destructive" className="text-xs py-0 px-1 font-mono">
                                HIGH URGENCY
                              </Badge>
                            ) : null}
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            {type === "Application Deadline" && "Alerts 48h and 12h prior to proposal window cutoff"}
                            {type === "Evaluation Assignment" && "Statutory blind proposal assignment notices"}
                            {type === "Evaluation Pending" && "Reminders for pending technical evaluation rubrics"}
                            {type === "Milestone Due" && "Advance reminders for pilot deliverable schedules"}
                            {type === "Milestone Overdue" && "Liquidated damages warnings on delayed pilot tranches"}
                            {type === "Payment Pending" && "PFMS treasury and escrow sanction requirements"}
                            {type === "Validation Required" && "Independent technical audit requests for pilot KPIs"}
                            {type === "Risk Alert" && "Critical technical, cybersecurity, or data breach alerts"}
                            {type === "Document Expiry" && "Advance notices 30d and 7d prior to legal document expiry"}
                            {type === "Challenge Closing" && "Final departmental challenge deadline notices"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-10 pr-4">
                          {/* In-App Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={typePref.inApp}
                              onChange={() => toggleChannel(type, "inApp")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gov-accent"></div>
                          </label>

                          {/* Email Digest Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={typePref.emailDigest}
                              onChange={() => toggleChannel(type, "emailDigest")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>

                          {/* Urgent SMS Toggle */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={typePref.urgentSms}
                              onChange={() => toggleChannel(type, "urgentSms")}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gov-border bg-slate-50 px-6 py-3.5 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Defaults
          </Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-gov-primary hover:bg-gov-primary/90 text-white text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
