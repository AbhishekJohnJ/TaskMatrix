const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn('⚠️  Email service not configured. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

const transporter = createTransporter();

// Send email function
const sendEmail = async (options) => {
  try {
    if (!transporter) {
      // Email not configured, log to console for development
      console.log('\n📧 ===== EMAIL (Development Mode) =====');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML Content:', options.html ? 'HTML email body' : 'No HTML');
      console.log('=====================================\n');
      return { messageId: 'dev-mode-no-email' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'TaskMatrix <noreply@taskmatrix.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Password reset email
  passwordReset: (resetUrl, userName) => ({
    subject: 'Password Reset Request - TaskMatrix',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>You requested to reset your password for your TaskMatrix account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #ef4444; background: #fff; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <div class="warning">
              <p style="margin: 0;"><strong>⏰ This link will expire in 1 hour.</strong></p>
            </div>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskMatrix. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Welcome email
  welcome: (userName) => ({
    subject: 'Welcome to TaskMatrix! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ef4444; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TaskMatrix!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Thank you for joining TaskMatrix - your new productivity powerhouse!</p>
            <p>With TaskMatrix, you can:</p>
            <div class="feature">
              <strong>✅ Task Management</strong><br>
              Create and manage tasks efficiently with our intuitive interface
            </div>
            <div class="feature">
              <strong>📊 Analytics Dashboard</strong><br>
              Track your productivity with detailed analytics and insights
            </div>
            <div class="feature">
              <strong>👥 Team Collaboration</strong><br>
              Work together with your team in real-time
            </div>
            <div class="feature">
              <strong>🎯 Kanban Boards</strong><br>
              Organize tasks visually with drag-and-drop boards
            </div>
            <div class="feature">
              <strong>📅 Calendar View</strong><br>
              Plan your schedule with an integrated calendar
            </div>
            <p style="margin-top: 30px;">Get started by creating your first task!</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskMatrix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Task assignment notification
  taskAssigned: (userName, taskTitle, assignedBy) => ({
    subject: `New Task Assigned: ${taskTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p><strong>${assignedBy}</strong> has assigned you a new task:</p>
            <div class="task-box">
              <h3 style="margin: 0; color: #ef4444;">${taskTitle}</h3>
            </div>
            <p>Log in to TaskMatrix to view the full details and get started!</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskMatrix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
