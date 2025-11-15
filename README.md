# 🎉 EventHub - Event Discovery Platform

<div align="center">

![EventHub Logo](https://via.placeholder.com/150x150/ea580c/ffffff?text=EventHub)

**Discover, Create, and Attend Amazing Local Events**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](https://eventhub.example.com) · [Report Bug](https://github.com/yourusername/eventhub/issues) · [Request Feature](https://github.com/yourusername/eventhub/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

EventHub is a modern, full-stack event discovery and management platform that connects event organizers with attendees. Built with cutting-edge technologies, it provides a seamless experience for discovering local events, creating and managing events, and building community connections.

### Why EventHub?

- 🔍 **Easy Discovery** - Find events by category, location, and interests
- 📱 **Progressive Web App** - Install and use like a native mobile app
- 🎨 **Modern UI/UX** - Clean, intuitive interface inspired by industry leaders
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 🗺️ **Location-Based** - Find events near you with PostGIS integration
- 💼 **Vendor Dashboard** - Comprehensive tools for event organizers

---

## ✨ Features

### For Event Seekers
- **Advanced Search & Filtering** - Search by keyword, category, location, and date
- **Event Calendar** - View upcoming events in your area
- **Save Favorites** - Bookmark events you're interested in
- **Reviews & Ratings** - Read and write event reviews
- **Notifications** - Get notified about events you're interested in
- **PWA Support** - Install on mobile devices for offline access

### For Event Organizers
- 🎫 **Event Creation** - Easy-to-use event creation form with rich media support
- 📊 **Analytics Dashboard** - Track attendees, revenue, and engagement
- 💰 **Payment Integration** - Accept payments through Stripe
- 📧 **Email Campaigns** - Communicate with attendees
- 🎯 **Service Marketplace** - Connect with vendors (catering, photography, etc.)
- 📈 **Bidding System** - Receive and manage service provider bids

### For Service Vendors
- 💼 **Service Listings** - Showcase your services and portfolio
- 🤝 **Bid on Events** - Submit proposals for event services
- 📱 **Vendor Dashboard** - Manage bids and track opportunities

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **UI Components:** Headless UI, Lucide React
- **PWA:** Vite PWA Plugin with Workbox
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL 15+ with PostGIS
- **ORM:** Prisma
- **Authentication:** JWT with bcrypt
- **Validation:** Express Validator
- **File Upload:** AWS S3 / Cloudinary
- **Payments:** Stripe
- **Email:** SendGrid / Mailgun
- **Real-time:** Socket.io

### DevOps & Tools
- **Version Control:** Git & GitHub
- **CI/CD:** GitHub Actions
- **Containerization:** Docker
- **Hosting:** Vercel (Frontend), AWS EC2 (Backend)
- **Database Hosting:** AWS RDS / Supabase
- **Monitoring:** Sentry (Error tracking)

---

## 🚀 Getting Started

Follow these steps to get EventHub running on your local machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v15 or higher)
- **Git**

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version
```

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/MoSam007/eventhub.git
cd eventhub
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup PostgreSQL with PostGIS
psql postgres
CREATE DATABASE event_discovery;
\c event_discovery
CREATE EXTENSION postgis;
\q

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed
```

#### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Install Tailwind CSS v4 Vite plugin
npm install -D @tailwindcss/vite
```

#### 4. Configure Environment Variables

**Backend** - Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/event_discovery?schema=public"

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

# Email (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Stripe (Optional for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AWS S3 (Optional for development)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

**Frontend** - Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EventHub
```

#### 5. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

#### 6. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/health

---

## 🔐 Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📂 Project Structure

```
eventhub/
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── pwa-icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── events/
│   │   │   ├── home/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Event Endpoints

#### Get All Events
```http
GET /api/events?search=concert&category=music&page=1&limit=20
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Vendor only)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tech Meetup 2024",
  "description": "Annual tech networking event",
  "categoryId": "uuid",
  "address": "123 Main St, Nairobi",
  "startDatetime": "2024-12-01T18:00:00Z",
  "endDatetime": "2024-12-01T22:00:00Z",
  "capacity": 100,
  "price": 1500,
  "images": ["url1", "url2"],
  "tags": ["tech", "networking"]
}
```

#### Update Event
```http
PUT /api/events/:id
Authorization: Bearer <token>
```

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile/:id
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

### Vendor Endpoints

#### Get Vendor Dashboard
```http
GET /api/vendor/dashboard
Authorization: Bearer <token>
```

For complete API documentation, visit: [API Docs](https://api.eventhub.example.com/docs)

---

## 🗺️ Roadmap

### Phase 1: MVP (Completed) ✅
- [x] User authentication and authorization
- [x] Event discovery and search
- [x] Event creation for vendors
- [x] Basic vendor dashboard
- [x] PWA implementation
- [x] Responsive design

### Phase 2: Enhanced Features (In Progress) 🚧
- [ ] Payment integration with Stripe
- [ ] Email notifications
- [ ] Image upload to S3/Cloudinary
- [ ] Google Maps integration
- [ ] Advanced filtering and sorting
- [ ] Event reviews and ratings

### Phase 3: Advanced Features (Planned) 📋
- [ ] Real-time notifications with Socket.io
- [ ] Social login (Google, Facebook)
- [ ] Event recommendations AI
- [ ] Multi-language support
- [ ] Video streaming for virtual events
- [ ] Advanced analytics dashboard
- [ ] Mobile apps (React Native)

### Phase 4: Scale & Optimize (Future) 🚀
- [ ] Microservices architecture
- [ ] Elasticsearch for advanced search
- [ ] Redis caching
- [ ] CDN integration
- [ ] Load balancing
- [ ] Kubernetes deployment

See the [open issues](https://github.com/yourusername/eventhub/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Contact

**Project Maintainer:** Sam Momanyi

- Email: samato.moma@gmail.com
- LinkedIn: [Sam Momanyi](http://www.linkedin.com/in/sam-momanyi-464581329)


**Project Link:** [https://github.com/yourusername/eventhub](https://github.com/MoSam007/eventhub)

---

## 🙏 Acknowledgments

Special thanks to the following resources and libraries:

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel](https://vercel.com/) for hosting
- [Unsplash](https://unsplash.com/) for images
- [Lucide Icons](https://lucide.dev/)
- [Eventbrite](https://www.eventbrite.com/) for design inspiration

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/MoSam007/eventhub?style=social)
![GitHub forks](https://img.shields.io/github/forks/MoSam007/eventhub?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/MoSam007/eventhub?style=social)
![GitHub issues](https://img.shields.io/github/issues/MoSam007/eventhub)
![GitHub pull requests](https://img.shields.io/github/issues-pr/MoSam007/eventhub)
![GitHub last commit](https://img.shields.io/github/last-commit/MoSam007/eventhub)

</div>

---

<div align="center">

**Built with ❤️ by the EventHub Team**

[⬆ Back to Top](#-eventhub---event-discovery-platform)

</div>