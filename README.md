# PrepSharp Admin Dashboard

## Security Notice

This project previously contained hardcoded Firebase API keys and credentials in the source code, which posed a security risk. The code has been updated to use a more secure approach.

## Setup Instructions

1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Firebase configuration values:
   ```
   FIREBASE_API_KEY=your-api-key-here
   FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. For production deployment, consider using environment variables or a secure API endpoint to provide Firebase configuration.

## Security Best Practices

1. Never commit API keys or credentials to version control
2. Use environment variables for sensitive configuration
3. Implement proper authentication and authorization
4. Set up Firebase Security Rules to restrict access to your data
5. Regularly rotate API keys and credentials
6. Monitor your Firebase project for unusual activity

## Firebase Security Rules

Make sure to set up proper security rules in your Firebase console to restrict access to your data. Here's an example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read and write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // More specific rules for collections
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin access
    match /{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

## Contact

If you discover any security issues, please contact the administrator immediately.