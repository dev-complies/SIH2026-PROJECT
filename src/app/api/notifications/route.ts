import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
import {
  notificationDb,
  NotificationType,
  ContextualNotification,
} from "@/database/notificationDatabase";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const searchParams = request.nextUrl.searchParams;

    const readStatus = (searchParams.get("readStatus") as "ALL" | "UNREAD" | "READ") || "ALL";
    const category = searchParams.get("category") || "ALL";
    const type = (searchParams.get("type") as NotificationType) || undefined;
    const search = searchParams.get("search") || undefined;

    const notifications = notificationDb.getNotificationsForUser(user, {
      readStatus,
      category,
      type,
      search,
    });

    const unreadCount = notificationDb.getUnreadCount(user);

    // Compute category counts for user
    const allUserNotifs = notificationDb.getNotificationsForUser(user);
    const categoryCounts: Record<string, number> = {
      ALL: allUserNotifs.length,
      DEADLINE: 0,
      EVALUATION: 0,
      MILESTONE: 0,
      PAYMENT: 0,
      VALIDATION: 0,
      RISK: 0,
      DOCUMENT: 0,
      CHALLENGE: 0,
    };

    for (const notif of allUserNotifs) {
      if (categoryCounts[notif.category] !== undefined) {
        categoryCounts[notif.category]++;
      }
    }

    return NextResponse.json({
      success: true,
      unreadCount,
      totalCount: notifications.length,
      categoryCounts,
      notifications,
      userRole: user?.role || "GUEST",
    });
  } catch (error: any) {
    console.error("Failed to fetch contextual notifications:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const body = await request.json();
    const { action, notificationId } = body;

    if (action === "mark-read" && notificationId) {
      const ok = notificationDb.markAsRead(notificationId);
      return NextResponse.json({ success: ok });
    }

    if (action === "mark-unread" && notificationId) {
      const ok = notificationDb.markAsUnread(notificationId);
      return NextResponse.json({ success: ok });
    }

    if (action === "mark-all-read") {
      const updatedCount = notificationDb.markAllAsRead(user);
      return NextResponse.json({ success: true, updatedCount });
    }

    if (action === "clear-all") {
      const clearedCount = notificationDb.clearAll(user);
      return NextResponse.json({ success: true, clearedCount });
    }

    if (action === "delete" && notificationId) {
      const ok = notificationDb.deleteNotification(notificationId);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Failed to update notification state:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = notificationDb.dispatchNotification(body);

    return NextResponse.json({
      success: result.success,
      notification: result.notification,
      reason: result.reason,
    });
  } catch (error: any) {
    console.error("Failed to dispatch notification:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
