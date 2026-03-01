import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE_URL = process.env.NEXTAUTH_URL || "https://www.markedbytrobes.com";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${SITE_URL}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password - Marked by Trobes",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                background-color: #f8f6f3;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                background-color: #0c1c33;
                color: #f0dfcc;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
                color: #333;
                line-height: 1.6;
              }
              .content h2 {
                color: #0c1c33;
                margin-top: 0;
              }
              .button {
                display: inline-block;
                background-color: #0c1c33;
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
              }
              .button:hover {
                background-color: #1a2f4d;
              }
              .footer {
                background-color: #f8f6f3;
                padding: 20px 30px;
                text-align: center;
                font-size: 14px;
                color: #666;
              }
              .warning {
                background-color: #fff4e6;
                border-left: 4px solid #ff9800;
                padding: 15px;
                margin: 20px 0;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Marked by Trobes</h1>
              </div>
              <div class="content">
                <h2>Reset Your Password</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your account. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                  <strong>⏰ This link expires in 1 hour</strong><br>
                  For security reasons, this password reset link will expire in 60 minutes.
                </div>
                
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${resetUrl}" style="color: #0c1c33;">${resetUrl}</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Marked by Trobes. All rights reserved.</p>
                <p>Discovering books that leave their mark</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${SITE_URL}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify Your Email - Marked by Trobes",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Georgia', serif;
                background-color: #f8f6f3;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                background-color: #0c1c33;
                color: #f0dfcc;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
                color: #333;
                line-height: 1.6;
              }
              .content h2 {
                color: #0c1c33;
                margin-top: 0;
              }
              .button {
                display: inline-block;
                background-color: #0c1c33;
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: 600;
              }
              .button:hover {
                background-color: #1a2f4d;
              }
              .footer {
                background-color: #f8f6f3;
                padding: 20px 30px;
                text-align: center;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Marked by Trobes</h1>
              </div>
              <div class="content">
                <h2>Welcome! Please Verify Your Email</h2>
                <p>Hello,</p>
                <p>Thank you for signing up! We're excited to have you join our community of book lovers.</p>
                <p>To complete your registration and start exploring book reviews and recommendations, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${verifyUrl}" class="button">Verify Email Address</a>
                </div>
                
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                  This link will expire in 24 hours for security purposes.
                </p>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verifyUrl}" style="color: #0c1c33;">${verifyUrl}</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Marked by Trobes. All rights reserved.</p>
                <p>Discovering books that leave their mark</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}
