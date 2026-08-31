import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const normalizeToken = (value: string | null | undefined) =>
  String(value ?? "").trim();

const hashToken = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const { token, password } =
      await req.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          error:
            "Token and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedToken = normalizeToken(token);
    const normalizedHash = hashToken(normalizedToken);

    const user = await User.findOne({
      $or: [
        { resetPasswordToken: normalizedToken },
        { resetPasswordToken: normalizedHash },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid reset token",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "EXPIRE:",
      user.resetPasswordExpire
    );
    console.log(
      "NOW:",
      new Date()
    );

    if (
      !user.resetPasswordExpire ||
      user.resetPasswordExpire < new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "Reset token has expired",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to reset password",
      },
      {
        status: 500,
      }
    );
  }
}