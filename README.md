# PrepSharp - Exam Preparation Platform

## Email Verification System

PrepSharp now includes an email verification system that allows users to:

1. Register with email verification
2. Login with either password or OTP
3. Verify their email address for first-time users

### Setup Instructions

1. Configure your email settings in the `.env` file:
   ```
   EMAIL_SERVICE=Gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   Note: For Gmail, use an App Password instead of your regular password.
   Generate one at https://myaccount.google.com/apppasswords

2. Install the required dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

### Login Methods

Users can login using two methods:
- **Password Login**: Traditional email and password login
- **OTP Login**: One-time password sent to their email

### Registration Flow

1. User enters registration details (name, email, mobile, password)
2. System sends a verification code to the user's email
3. User enters the verification code to complete registration
4. After verification, user is redirected to profile setup

### Security Features

- OTPs are hashed before storage
- OTPs expire after 10 minutes
- Rate limiting on resend functionality
- Email verification required for new accounts

## Admin Dashboard

### How to Access the Admin Dashboard

There are two ways to access the admin dashboard:

#### Option 1: Using the Fixed Version (Recommended)
1. Open `admin-dashboard-fixed.html` directly in your browser
2. This version works without requiring Firebase authentication
3. All data is pre-populated for demonstration purposes

#### Option 2: Using the Original Version
1. Open `admin-login.html` in your browser
2. Enter any email and password
3. You will be redirected to `admin-dashboard.html`