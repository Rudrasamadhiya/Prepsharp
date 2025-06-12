# PrepSharp - JEE Preparation Platform

## Project Overview
PrepSharp is a comprehensive JEE preparation platform with subscription-based access to practice papers, analytics, and personalized study plans. The platform offers three subscription tiers:

1. **Basic Plan (Monthly)** - ₹199/month
   - Access to JEE Main practice papers
   - Basic performance analytics
   - Limited question bank access

2. **Standard Plan (Quarterly)** - ₹499/quarter
   - Access to JEE Main & Advanced papers
   - Detailed performance analytics
   - Full question bank access
   - Personalized study plan

3. **Premium Plan (Yearly)** - ₹999/year
   - All features from Standard
   - Advanced analytics with AI recommendations
   - Personalized coaching interface
   - Mock interview preparation
   - Peer comparison statistics
   - Priority doubt solving
   - Offline content access

## Project Structure
```
prepsharp/
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── dashboards/
│   ├── basic/
│   ├── standard/
│   └── premium/
└── index.html
```

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Payment**: Razorpay API

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/prepsharp.git
   cd prepsharp
   ```

2. **Install backend dependencies**
   ```
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=prepsharp_db
   PORT=3000
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Set up the database**
   ```
   npm run setup-db
   ```

5. **Start the server**
   ```
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Password reset functionality

### Subscription Management
- Three subscription tiers (Basic, Standard, Premium)
- Razorpay payment integration
- Subscription lifecycle management

### Dashboard Features
- Plan-specific dashboards with different features
- Practice paper access based on subscription tier
- Performance analytics and tracking
- Personalized study plans (Standard and Premium)
- AI-powered recommendations (Premium)
- Peer comparison statistics (Premium)

### Backend API Endpoints
- `/api/auth` - Authentication routes
- `/api/subscriptions` - Subscription management
- `/api/papers` - Practice paper access
- `/api/analytics` - Performance analytics
- `/api/study-plan` - Personalized study plans

## Development Roadmap

### Phase 1: Core Functionality
- User authentication
- Basic dashboard
- Subscription management
- Practice paper access

### Phase 2: Enhanced Features
- Performance analytics
- Study plan generation
- Question bank integration

### Phase 3: Premium Features
- AI coach integration
- Peer comparison
- Mock interviews
- Offline access

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any questions or support, please contact support@prepsharp.com