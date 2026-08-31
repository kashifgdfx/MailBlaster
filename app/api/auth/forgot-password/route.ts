import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { transporter } from "@/lib/mailer";

const hashToken = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "No account found with this email",
        },
        {
          status: 404,
        }
      );
    }

    // Generate secure token and store a hash so the database never keeps plaintext secrets.
    const rawResetToken = crypto
      .randomBytes(32)
      .toString("hex");
    const resetTokenHash = hashToken(rawResetToken);

    // 1 hour expiry
    const resetExpire = new Date(
      Date.now() + 60 * 60 * 1000
    );

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = resetExpire;

    await user.save();

    const appUrl =
      process.env.APP_URL ||
      "http://localhost:3000";

    const resetLink =
      `${appUrl}/reset-password?token=${encodeURIComponent(rawResetToken)}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
        
        <h2 style="color:#111827">
          Password Reset Request
        </h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <a
          href="${resetLink}"
          style="
            display:inline-block;
            background:#2563eb;
            color:white;
            text-decoration:none;
            padding:12px 24px;
            border-radius:8px;
            font-weight:600;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px">
          Or copy and paste this link:
        </p>

        <p style="word-break:break-all">
          ${resetLink}
        </p>

        <p style="color:#6b7280">
          This link will expire in 1 hour.
        </p>

      </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset email sent successfully",
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to send reset email",
      },
      {
        status: 500,
      }
    );
  }
}