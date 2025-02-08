import { NextResponse } from "next/server";
import { verifyCloudProof, IVerifyResponse } from "@worldcoin/minikit-js";

export async function POST(req: Request) {
  try {
    const { payload, action } = await req.json();

    const verifyResult = await verifyCloudProof(
      payload,
      process.env.APP_ID as `app_${string}`,
      action
    );

    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: 200, message: "Verification successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      { error: "Failed to verify proof" },
      { status: 500 }
    );
  }
}
