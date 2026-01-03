# Avocado Tour Backend API

A Node.js/Express REST API for the Avocado Tour travel booking platform.

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
```

**Prerequisites:**
- Node.js 18+
- MongoDB running on `localhost:27017`

---

## 📁 Project Structure

```
backend/
├── config/db.js         # MongoDB connection
├── controllers/         # Route handlers (future)
├── middleware/auth.js   # JWT & role verification
├── models/
│   ├── Tour.js          # Tour schema
│   ├── User.js          # User schema with roles
│   └── Booking.js       # Booking schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── tours.js         # Tour CRUD routes
│   ├── bookings.js      # Booking routes
│   └── users.js         # User management routes
├── .env                 # Environment variables
└── server.js            # Express entry point
```

---

## 🔐 Authentication

All protected routes require a JWT token in the header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",          // Optional: "user" | "agent" | "admin"
  "phone": "+998901234567", // Optional
  "company": "Travel Co"    // Optional, for agents
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## 🗺️ Tours API

### Get All Tours (Public)
```http
GET /api/tours
GET /api/tours?tourType=B2C
GET /api/tours?status=Active
```

### Get Single Tour (Public)
```http
GET /api/tours/:id
```

### Create Tour (Admin Only)
```http
POST /api/tours
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Istanbul Magic",
  "fromCity": "Tashkent",
  "toCity": "Istanbul",
  "duration": "7 days",
  "description": "Experience the magic of Istanbul...",
  "flightVendors": ["Turkish Airlines", "Uzbekistan Airways"],
  "packageType": "Full",
  "tourType": "B2C",
  "priceAdult": 1200,
  "priceChild": 600,
  "capacity": 30,
  "status": "Active"
}
```

### Update Tour (Admin Only)
```http
PUT /api/tours/:id
Authorization: Bearer <admin_token>
```

### Delete Tour (Admin Only)
```http
DELETE /api/tours/:id
Authorization: Bearer <admin_token>
```

---

## 📅 Bookings API

### Create Booking (Public/Guest)
```http
POST /api/bookings
Content-Type: application/json

{
  "tour": "tour_id_here",
  "travelDate": "2024-03-15",
  "adults": 2,
  "children": 1,
  "rooms": 1,
  "travelers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-05-15",
      "gender": "Male",
      "passport": "AB1234567"
    }
  ],
  "addons": {
    "transfer": true,
    "hotelUpgrade": false,
    "guide": true,
    "meals": true,
    "insurance": true
  },
  "contact": {
    "phone": "+998901234567",
    "email": "john@example.com",
    "notes": "Early check-in requested"
  },
  "totalPrice": 2850,
  "paymentMethod": "Card"
}
```

**Response:**
```json
{
  "_id": "...",
  "bookingRef": "AT-123456",
  "status": "Pending",
  ...
}
```

### Get All Bookings (Admin)
```http
GET /api/bookings
Authorization: Bearer <admin_token>
```

### Get My Bookings (User)
```http
GET /api/bookings/my
Authorization: Bearer <user_token>
```

### Update Booking Status (Admin)
```http
PATCH /api/bookings/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Confirmed"  // "Pending" | "Confirmed" | "Cancelled" | "Completed"
}
```

---

## 👥 Users API (Admin Only)

### Get Pending Registrations
```http
GET /api/users/pending
Authorization: Bearer <admin_token>
```

### Approve User/Agent
```http
PATCH /api/users/:id/approve
Authorization: Bearer <admin_token>
```

### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## 🔧 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/avocado-tour
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
```

---

## 📊 Data Models

### Tour
| Field | Type | Required |
|-------|------|----------|
| title | String | ✅ |
| fromCity | String | ✅ |
| toCity | String | ✅ |
| duration | String | ✅ |
| priceAdult | Number | ✅ |
| priceChild | Number | ✅ |
| capacity | Number | ✅ |
| tourType | Enum: B2C, B2B | - |
| packageType | Enum: Full, Partial | - |
| flightVendors | [String] | - |
| status | Enum: Active, Paused, Draft | - |

### User
| Field | Type | Required |
|-------|------|----------|
| name | String | ✅ |
| email | String | ✅ (unique) |
| password | String | ✅ (hashed) |
| role | Enum: user, agent, admin | - |
| isApproved | Boolean | - |

### Booking
| Field | Type | Required |
|-------|------|----------|
| tour | ObjectId (ref: Tour) | ✅ |
| travelDate | Date | ✅ |
| adults | Number | ✅ |
| totalPrice | Number | ✅ |
| contact.phone | String | ✅ |
| contact.email | String | ✅ |
| bookingRef | String | Auto-generated |
| status | Enum | Default: Pending |

---

## 🧪 Testing

Health check endpoint:
```http
GET /api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Avocado Tour API is running"
}
```

---

## 📝 License

MIT
