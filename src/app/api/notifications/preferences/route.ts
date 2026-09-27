import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorizedResponse } from "@/auth/serverAuth";
import {
  notificationDb,
  NotificationPreferences,
  getDefaultPreferences,
} from "@/database/notificationDatabase";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    const userId = user?.id || "guest";
    const userRole = user?.role || "GOVERNMENT_OFFICER";

    const preferences = notificationDb.getPreferences(userId, userRole);

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error: any) {
    console.error("Failed to fetch notification preferences:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) {
      return unauthorizedResponse("Authentication required to configure notification preferences.");
    }

    const body: NotificationPreferences = await request.json();

    if (!body || !body.types) {
      return NextResponse.json(
        { success: false, error: "Invalid preferences payload" },
        { status: 400 }
      );
    }

    // Bind preferences strictly to the authenticated user context to prevent spoofing
    const securedPreferences: NotificationPreferences = {
      userId: user.id,
      role: user.role,
      types: body.types,
      antiSpam: body.antiSpam || {
        consolidateDigest: true,
        muteLowPriority: false,
        quietHoursEnabled: false,
        minIntervalMinutes: 30,
      },
    };

    const saved = notificationDb.savePreferences(securedPreferences);

    return NextResponse.json({
      success: true,
      preferences: saved,
    });
  } catch (error: any) {
    console.error("Failed to save notification preferences:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
