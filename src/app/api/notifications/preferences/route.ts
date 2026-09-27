import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/auth/serverAuth";
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
    const body: NotificationPreferences = await request.json();

    if (!body || !body.types) {
      return NextResponse.json(
        { success: false, error: "Invalid preferences payload" },
        { status: 400 }
      );
    }

    const saved = notificationDb.savePreferences(body);

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
