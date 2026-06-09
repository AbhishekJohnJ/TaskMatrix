// Email configuration - Disabled for now to avoid startup errors
// TODO: Configure email service properly

// Mock email functions for development
const sendEmail = async (options) => {
  console.log('📧 Email would be sent to:', options.to);
  console.log('   Subject:', options.subject);
  return { messageId: 'email-disabled' };
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
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
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
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2024 TaskMatrix. All rights reserved.</p>
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
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
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
            <ul>
              <li>✅ Create and manage tasks efficiently</li>
              <li>📊 Track your productivity with analytics</li>
              <li>👥 Collaborate with your team in real-time</li>
              <li>🎯 Organize tasks with Kanban boards</li>
              <li>📅 Plan with calendar view</li>
            </ul>
            <p>Get started by creating your first task!</p>
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
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
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
              <h3>${taskTitle}</h3>
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
