# EazyVenue - Venue Booking Platform

A modern, full-stack venue booking platform that allows users to discover, book, and manage event venues. Built with React.js frontend and Node.js/Express backend with MongoDB database.

## 🚀 Features

### User Features
- **Venue Discovery**: Browse and search venues by name, location, and amenities
- **Advanced Filtering**: Filter venues by availability date and search criteria
- **Detailed Venue Information**: View comprehensive venue details including capacity, pricing, amenities, and images
- **Real-time Booking**: Book venues with instant availability checking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Venue Management**: Add, edit, and delete venue listings
- **Booking Management**: View and track all bookings with detailed customer information
- **Availability Control**: Block/unblock specific dates for maintenance or events
- **Dashboard Analytics**: Quick stats showing total venues, bookings, and revenue
- **Real-time Updates**: Instant updates when venues are booked or availability changes

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with CSS variables and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
eazyvenue/
├── frontend/                 # React.js frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Venuelistcomponent.jsx
│   │   │   ├── bookingfromcomponent.jsx
│   │   │   └── Admindashboard.jsx
│   │   ├── services/        # API service layer
│   │   │   └── VenueService.js
│   │   ├── App.js           # Main application component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Application entry point
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── database/            # Database models and connection
│   │   ├── Venue.js         # Venue schema
│   │   ├── Booking.js       # Booking schema
│   │   └── db.js            # Database connection
│   ├── routes/              # API route handlers
│   │   ├── venueroutes.js   # Venue-related endpoints
│   │   └── booking_routes.js # Booking-related endpoints
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eazyvenue
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/eazyvenue
   PORT=3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## 📊 API Endpoints

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get venue by ID
- `POST /api/venues` - Create new venue (Admin)
- `DELETE /api/venues/:id` - Delete venue (Admin)
- `PATCH /api/venues/:id/availability` - Update venue availability (Admin)
- `GET /api/venues/:id/availability` - Check venue availability

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `POST /api/bookings` - Create new booking
- `GET /api/venues/:venueId/bookings` - Get bookings for specific venue

## 🎯 Key Features Implementation

### Real-time Availability Checking
- Venues maintain an `unavailableDates` array with blocked dates
- Booking system checks availability before confirming reservations
- Admin can manually block dates for maintenance or special events

### Responsive Design
- Mobile-first CSS approach with flexible grid layouts
- Optimized for screens from 320px to 1920px+
- Touch-friendly interface elements

### Error Handling
- Comprehensive error handling on both frontend and backend
- User-friendly error messages with retry functionality
- Input validation and sanitization

## 🔮 Advanced Features - Future Enhancements

### 1. Capturing User Search Activity

**Approach:**
- **Event Tracking System**: Implement a comprehensive analytics service to capture user interactions
- **Data Points to Collect**:
  - Search queries (keywords, filters applied)
  - Venue views and time spent on each venue
  - Booking funnel progression (view → details → booking attempt → completion)
  - Geographic data (user location vs venue searches)
  - Device and browser information
  - Session duration and bounce rates


### 2. Admin Analytics Dashboard

**Approach:**
- **Comprehensive Metrics Dashboard**: Create a data-driven admin interface with key performance indicators
- **Key Metrics to Display**:
  - Revenue analytics (daily, weekly, monthly trends)
  - Booking conversion rates and funnel analysis
  - Popular venues and peak booking times
  - User demographics and geographic distribution
  - Search trends and popular amenities
  - Venue performance comparisons

### 3. Calendar View for Venue Availability

**Approach:**
- **Interactive Calendar Interface**: Implement a comprehensive calendar system for both users and admins
- **Multi-view Calendar**: Month, week, and day views with different use cases

**Advanced Features:**
- **Smart Suggestions**: Recommend alternative dates for unavailable slots
- **Seasonal Pricing**: Automatic price adjustments based on demand
- **Waitlist Management**: Queue system for popular dates
- **Calendar Sync**: Two-way sync with popular calendar applications


### 4. Basic Authentication for Admin and Venue Owners

**Approach:**
- **Role-Based Access Control (RBAC)**: Implement a comprehensive authentication system with multiple user roles
- **JWT-Based Authentication**: Secure, stateless authentication mechanism

**Security Features:**
- **Multi-Factor Authentication (MFA)**: SMS/Email OTP for sensitive operations
- **Session Management**: Secure session handling with automatic logout
- **Password Policies**: Strong password requirements and periodic updates
- **Audit Logging**: Track all user actions for security monitoring
- **Rate Limiting**: Prevent brute force attacks and API abuse

**Implementation Strategy:**
1. **Phase 1**: Basic JWT authentication with role separation
2. **Phase 2**: Email verification and password reset
3. **Phase 3**: Multi-factor authentication and advanced security
4. **Phase 4**: OAuth integration (Google, Facebook, LinkedIn)

## 🔧 Development Assumptions

### Technical Decisions Made:
1. **MongoDB Choice**: Selected for flexible schema design and easy scaling
2. **React Architecture**: Component-based structure for maintainability
3. **RESTful API**: Standard REST endpoints for clear API contracts
4. **CSS Variables**: Used for consistent theming and easy customization
5. **Error Handling**: Comprehensive error boundaries and user feedback

### Business Logic Assumptions:
1. **Booking Model**: Single-day bookings (can be extended for multi-day events)
2. **Payment Integration**: Placeholder for future payment gateway integration
3. **Venue Ownership**: Single admin model (can be extended to multi-owner)
4. **Availability Logic**: Simple blocked/available states (can add partial availability)

### Scalability Considerations:
1. **Database Indexing**: Prepared for search optimization
2. **API Structure**: Designed for easy microservices migration
3. **Frontend Architecture**: Component isolation for team development
4. **Caching Strategy**: Ready for Redis implementation

## 🚀 Deployment

### Production Deployment Steps:
1. **Environment Setup**: Configure production environment variables
2. **Database Migration**: Set up MongoDB Atlas or production database
3. **Build Process**: Create optimized production builds
4. **Server Configuration**: Deploy backend with PM2 or similar process manager
5. **CDN Setup**: Serve static assets through CDN for better performance

### Recommended Hosting:
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, or DigitalOcean
- **Database**: MongoDB Atlas or AWS DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact [your-email@example.com] or create an issue in the GitHub repository.

---

**Built with ❤️ for seamless venue booking experiences**
