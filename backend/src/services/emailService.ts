import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'gator4417.hostgator.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'no-reply@anzacash.com',
        pass: process.env.SMTP_PASS || 'UQIvlUfTE[@B',
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'anzacash <no-reply@anzacash.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html,
        replyTo: process.env.SMTP_REPLY_TO || 'anzacashpro@gmail.com',
      };

      await this.transporter.sendMail(mailOptions);

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendPasswordResetCode(email: string, code: string, userName?: string): Promise<{ success: boolean; message: string }> {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ANZACASH - Password Reset Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4169E1;
            margin-bottom: 10px;
          }
          .code {
            font-size: 32px;
            font-weight: bold;
            color: #4169E1;
            text-align: center;
            padding: 20px;
            background: #f0f8ff;
            border-radius: 8px;
            margin: 20px 0;
            letter-spacing: 4px;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ANZACASH</div>
            <h1>Password Reset Verification</h1>
          </div>

          <p>Hello ${userName || 'there'},</p>

          <p>You requested to reset your password for your ANZACASH account.</p>

          <div class="code">${code}</div>

          <p><strong>Important:</strong></p>
          <ul style="color: #666; font-size: 14px; line-height: 1.6;">
            <li>Use this code on the reset password page to create a new password</li>
            <li>This code will be overwritten when a new reset is requested</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>

          <div class="footer">
            <p>Best regards,<br>
            ANZACASH Team</p>
            <p style="font-size: 12px; color: #999;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textTemplate = `
ANZACASH - Password Reset Code

Hello ${userName || 'there'},

You requested to reset your password for your ANZACASH account.

Your verification code is: ${code}

Use this code on the reset password page to create a new password.

Best regards,
ANZACASH Team
    `;

    return this.sendEmail({
      to: email,
      subject: 'ANZACASH - Reset Your Password Code',
      html: htmlTemplate,
      text: textTemplate
    });
  }
}

export default EmailService;