# Email Setup Guide for TaskMatrix

## Overview
TaskMatrix uses Nodemailer to send emails for password resets, welcome messages, and task notifications.

## Setup Instructions

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Create App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: Mail
   - Select device: Other (Custom name)
   - Enter name: "TaskMatrix"
   - Click Generate
   - Copy the 16-character password

3. **Update server/.env file**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   EMAIL_FROM=TaskMatrix <noreply@taskmatrix.com>
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account**
   - Sign up at https://sendgrid.com/
   - Verify your email
   - Create an API key

2. **Update server/.env file**
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your_sendgrid_api_key
   EMAIL_FROM=TaskMatrix <noreply@yourdomain.com>
   ```

### Option 3: AWS SES (Enterprise)

1. **Set up AWS SES**
   - Log in to AWS Console
   - Navigate to SES
   - Verify your domain
   - Create SMTP credentials

2. **Update server/.env file**
   ```env
   EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_USER=your_aws_smtp_username
   EMAIL_PASSWORD=your_aws_smtp_password
   EMAIL_FROM=TaskMatrix <noreply@yourdomain.com>
   ```

### Option 4: Outlook/Office365

1. **Use your Microsoft account**

2. **Update server/.env file**
   ```env
   EMAIL_HOST=smtp.office365.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@outlook.com
   EMAIL_PASSWORD=your_password
   EMAIL_FROM=TaskMatrix <your_email@outlook.com>
   ```

## Testing Email Setup

### Development Mode (No Configuration)
If email credentials are not configured, emails will be logged to the console instead of being sent. This is useful for development.

### Test Email Sending

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. Try the forgot password feature:
   - Go to http://localhost:5173/forgot-password
   - Enter a registered email
   - Check your email inbox or server console

## Email Templates

TaskMatrix includes three email templates:

1. **Password Reset** - Sent when user requests password reset
2. **Welcome Email** - Sent when new user registers
3. **Task Assignment** - Sent when a task is assigned to a user

All templates use the TaskMatrix red theme (#ef4444).

## Troubleshooting

### Emails not sending

1. **Check server logs** for error messages
2. **Verify credentials** in .env file
3. **Check spam folder** in your email
4. **Gmail users**: Make sure app password is used, not regular password
5. **Firewall**: Ensure port 587 is not blocked

### "Less secure app" error (Gmail)

Gmail no longer supports "less secure apps". You MUST use an App Password with 2FA enabled.

### Development vs Production

- **Development**: Emails log to console if not configured
- **Production**: Always configure real email service

## Security Best Practices

1. **Never commit .env file** to version control
2. **Use app-specific passwords**, not your main account password
3. **Rotate credentials** regularly
4. **Use environment variables** for sensitive data
5. **Enable 2FA** on your email account
6. **Use verified domains** in production

## Cost Considerations

- **Gmail**: Free (limited to 500 emails/day)
- **SendGrid**: Free tier: 100 emails/day
- **AWS SES**: Pay as you go (~$0.10 per 1000 emails)
- **Outlook**: Free with account

## Current Implementation

The password reset flow works as follows:

1. User enters email on forgot password page
2. Backend validates email and generates reset token
3. Token is hashed and stored in database (expires in 1 hour)
4. Email is sent with reset link
5. User clicks link and enters new password
6. Backend validates token and updates password
7. All user sessions are revoked

## Support

For issues or questions about email configuration, check:
- Server logs in `server/logs/`
- Nodemailer documentation: https://nodemailer.com/
- Your email provider's SMTP documentation
