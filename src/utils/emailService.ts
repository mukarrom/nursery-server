import status from "http-status";
import * as nodemailer from "nodemailer";
import config from "../config";
import AppError from "../errors/AppError";

// Create a transporter with configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.smtpUserName,
    pass: config.smtpPassword,
  },
});

const generateEmailTemplate = ({
  username,
  otp,
  verificationLink,
}: {
  username: string;
  otp: string;
  verificationLink?: string;
}) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        /* Email styles moved to inline for better email client compatibility */
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .email-box { background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 150px; height: auto; margin-bottom: 20px; }
        h1 { color: #333333; margin: 0; font-size: 24px; }
        .content { margin-bottom: 30px; color: #666666; line-height: 1.6; }
        .otp-code { background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333333; margin: 20px 0; }
        .button-container { text-align: center; margin: 30px 0; }
        .button { 
            display: inline-block; 
            padding: 15px 40px; 
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }
        .footer { text-align: center; margin-top: 30px; color: #999999; font-size: 14px; }
        .social-links { margin-top: 20px; }
        .social-link { 
            display: inline-block;
            margin: 0 10px; 
            color: #666666; 
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        .social-link:hover {
            color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-box">
            <div class="header">
                <img src="https://res.cloudinary.com/do6z9mh8t/image/upload/v1749631220/catering-app-logo_wefrlf.png" alt="Catering App Logo" class="logo">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <p>Hello ${username},</p>
                <p>Thank you for registering with Nursery Bazar BD. Please use the following verification code to complete your registration:</p>
                <div class="otp-code">
                    ${otp}
                </div>
                <p>This code will expire in 5 minutes for security reasons.</p>
                ${verificationLink
    ? `<p>Alternatively, you can click the button below to verify your email:</p>
                       <div class="button-container">
                           <a href="${verificationLink}" class="button">Verify Email Address</a>
                       </div>`
    : ""
  }
                <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Nursery Bazar BD. All rights reserved.</p>
                <div class="social-links">
                    <a href="#" class="social-link">Facebook</a>
                    <a href="#" class="social-link">Twitter</a>
                    <a href="#" class="social-link">Instagram</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const sendEmail = async ({
  email,
  token,
  username,
  verificationLink,
}: {
  email: string;
  token: string;
  username?: string;
  verificationLink?: string;
}) => {
  try {
    const htmlContent = generateEmailTemplate({
      username: username || email.split("@")[0],
      otp: token,
      verificationLink,
    });

    await transporter.sendMail({
      from: `"Nursery Bazar BD" <${config.smtpUserName}>`,
      to: email,
      subject: "Verify Your Email - Nursery Bazar BD",
      text: `Your verification code is: ${token}`,
      html: htmlContent,
    });

    return {
      email,
      token,
    };
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
