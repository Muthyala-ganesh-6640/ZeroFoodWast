# 🍱 ZeroFoodWaste

### 🌱 Save Food. Serve People. Waste Nothing.

**ZeroFoodWaste** is a full-stack MERN-based food rescue and redistribution platform that connects **Food Donors, Delivery Organizations, and Admins** to reduce surplus food wastage and help deliver safe food to people in need.

The platform enables donors to register surplus food from **functions, weddings, parties, restaurants, hotels, colleges, hostels, festivals, and other events**, while verified delivery organizations can collect and distribute it to suitable destinations.

---

## 🎯 Project Objective

The main objective of ZeroFoodWaste is to prevent safe surplus food from becoming waste by creating a transparent digital system for:

**Food Donation → Pickup → Transportation → Distribution → Verification**

> 🍱 Save Food → 🚚 Serve People → ❤️ Reduce Hunger → 🌱 Zero Food Waste

---

## 👥 User Roles

### 👨‍🍳 Food Donor

Food donors can:

* Register and login
* Add surplus food
* Enter food quantity and servings
* Add preparation and expiry date/time
* Upload food images
* Provide pickup location
* Track donation status
* View donation history
* Monitor completed donations

### 🚚 Delivery Partner / Organization

Delivery organizations can:

* Register and submit organization details
* Get verified by Admin
* View available food donations
* Find nearby donations
* Accept donation requests
* Pickup donated food
* Upload pickup proof
* Track delivery
* Select distribution destination
* Upload distribution proof
* Capture GPS location
* Record quantity distributed
* Record number of people served

### 🛡️ Admin

Administrators can:

* Manage users
* Manage food donors
* Verify delivery organizations
* Monitor all donations
* Track deliveries
* Monitor active and completed requests
* View food rescued
* Track meals/servings provided
* View daily and monthly analytics
* Monitor distribution locations
* Generate reports

---

## 🔄 System Workflow

```text
                 SURPLUS FOOD
                      │
                      ▼
                👨‍🍳 FOOD DONOR
                      │
                      ▼
             ZEROFOODWASTE PLATFORM
                      │
                      ▼
             🚚 DELIVERY PARTNER
                      │
                      ▼
                  PICKUP
                      │
                      ▼
                TRANSPORTATION
                      │
                      ▼
             VERIFIED DESTINATION
                      │
                      ▼
              ❤️ PEOPLE IN NEED
                      │
                      ▼
             📸 DISTRIBUTION PROOF
```

---

## 📦 Donation Lifecycle

```text
AVAILABLE
    ↓
REQUESTED
    ↓
ACCEPTED
    ↓
PICKUP SCHEDULED
    ↓
PICKED UP
    ↓
IN TRANSIT
    ↓
DELIVERED
    ↓
DISTRIBUTED
    ↓
COMPLETED
```

Additional states:

```text
CANCELLED
EXPIRED
```

---

## ✨ Key Features

* 🔐 Secure authentication
* 👥 Role-based dashboards
* 🍱 Surplus food donation management
* 📍 Pickup and distribution locations
* 🚚 Delivery tracking
* 📸 Pickup and distribution proof
* 🗺️ Map integration
* ⏰ Food expiry monitoring
* 🔔 Real-time notifications
* 📊 Admin analytics
* 📈 Daily and monthly reports
* 👥 People-served tracking
* ☁️ Cloud image storage
* 📱 Responsive design
* 🔒 Protected APIs
* ⚡ Real-time status updates

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Framer Motion
* Axios
* Recharts
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* Socket.IO

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcrypt
* Role-Based Authorization
* Protected Routes
* Input Validation
* CORS
* Helmet
* Rate Limiting

### External Services

* Cloudinary — Image Storage
* Leaflet
* OpenStreetMap
* Socket.IO — Real-time Communication

---

## 🗂️ Project Structure

```text
ZeroFoodWaste/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── dashboards/
│   │   │   ├── donor/
│   │   │   ├── partner/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── config/
│   │   └── utils/
│   │
│   └── package.json
│
├── README.md
└── package.json
```

---

## 🗄️ Main Database Collections

### User

Stores:

* Name
* Email
* Password
* Role
* Phone
* Address
* Account status

### Donation

Stores:

* Food name
* Category
* Quantity
* Servings
* Preparation time
* Expiry time
* Source/event
* Pickup location
* Images
* Donation status
* Donor
* Delivery partner

### Partner

Stores:

* Organization name
* Contact details
* Address
* Verification status
* Documents
* Location

### Delivery

Stores:

* Donation
* Partner
* Pickup details
* Delivery details
* Distribution details
* GPS coordinates
* Proof images
* People served

### Notification

Stores:

* Recipient
* Message
* Notification type
* Read status
* Timestamp

---

## 🔌 API Structure

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Donations

```text
GET    /api/donations
POST   /api/donations
GET    /api/donations/:id
PUT    /api/donations/:id
DELETE /api/donations/:id

POST /api/donations/:id/accept
POST /api/donations/:id/pickup
POST /api/donations/:id/deliver
POST /api/donations/:id/distribute
```

### Admin

```text
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/donations
GET /api/admin/deliveries
GET /api/admin/analytics
GET /api/admin/reports
```

### Partners

```text
GET  /api/partners
GET  /api/partners/:id
PUT  /api/partners/:id/verify
```

---

## 📊 Admin Analytics

The admin dashboard provides:

* Total donations
* Today's donations
* Monthly donations
* Food rescued
* Meals served
* Active deliveries
* Completed deliveries
* Active donors
* Verified partners
* Expired donations

Charts include:

* Daily donation trends
* Monthly food rescued
* Meals served
* Food categories
* Donation status
* Food source types

---

## 📍 Distribution Verification

Every completed donation can contain:

```text
📸 Distribution Photo
📍 GPS Location
🕐 Date & Time
🍱 Quantity Distributed
👥 People Served
🏢 Organization
📝 Notes
```

This creates a traceable journey from the original donor to the final distribution.

---

## 🔐 Security

The application implements:

* JWT authentication
* Password hashing with bcrypt
* Role-based access control
* Protected API routes
* Input validation
* File validation
* CORS configuration
* Helmet security headers
* Rate limiting
* Environment variables for sensitive credentials

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/ZeroFoodWaste.git
cd ZeroFoodWaste
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 5. Start backend

```bash
cd server
npm run dev
```

### 6. Start frontend

Open another terminal:

```bash
cd client
npm run dev
```

---

## 🌍 Future Scope

* 🤖 AI-based food demand prediction
* 🗺️ Smart delivery route optimization
* 📱 Android/iOS mobile application
* 💬 AI chatbot
* 📲 SMS and WhatsApp notifications
* 🌐 Multilingual support
* 🥗 AI-based food quality monitoring
* 👨‍👩‍👧 Volunteer management
* 📊 Advanced impact analytics
* 🤝 Integration with more NGOs and restaurants

---

## 🌱 Social Impact

ZeroFoodWaste aims to create a simple connection between:

```text
People With Surplus Food
          ↓
     ZeroFoodWaste
          ↓
Delivery Organizations
          ↓
     People in Need
```

The platform encourages responsible food usage while creating a measurable social impact through food rescue, redistribution, and transparent tracking.

---

## 📌 Project Information

| Category       | Details                    |
| -------------- | -------------------------- |
| Project Name   | ZeroFoodWaste              |
| Project Type   | Full-Stack Web Application |
| Domain         | Food Waste Reduction       |
| Stack          | MERN                       |
| Frontend       | React.js                   |
| Backend        | Node.js + Express.js       |
| Database       | MongoDB                    |
| Authentication | JWT                        |
| Real-Time      | Socket.IO                  |
| Maps           | Leaflet + OpenStreetMap    |
| Image Storage  | Cloudinary                 |

---

## ❤️ Mission

> **“One Extra Meal Can Make a Difference.”**

### 🍱 SAVE FOOD

### 🚚 SERVE PEOPLE

### ❤️ REDUCE HUNGER

### 🌱 ZERO FOOD WASTE

---

## 👨‍💻 Developer

**Muthyala Ganesh**

B.Tech — Artificial Intelligence & Machine Learning

---

⭐ If you find this project useful, consider giving the repository a **Star ⭐**.
