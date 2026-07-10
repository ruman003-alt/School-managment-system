# School Management SaaS

A production-ready multi-tenant School Management System built with modern technologies.

## Features

- 🏫 **Multi-Tenant Architecture** - Support unlimited schools with complete data isolation
- 👥 **7 Role-Based Access Control** - Super Admin, School Admin, Teacher, Accountant, Receptionist, Parent, Student
- 🔐 **Enterprise Authentication** - JWT with refresh tokens, Bcrypt encryption, RBAC
- 📊 **Complete School Management** - Students, Teachers, Classes, Sections, Attendance, Fees, Exams, Marks
- 🛡️ **Security First** - Helmet, Rate Limiting, Input Validation, Error Handling
- 📦 **Docker Ready** - Production deployment with Docker & Docker Compose
- ✅ **Database** - MySQL with Prisma ORM

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Backend
- **Node.js & Express.js** - Runtime & Framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database
- **MySQL** - Database
- **JWT** - Authentication
- **Zod** - Validation

## Project Structure

```
School-managment-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── App.tsx
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+
- Docker & Docker Compose

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Schools
- `POST /api/schools` - Create school (Super Admin only)
- `GET /api/schools` - Get schools
- `GET /api/schools/:id` - Get school details
- `PUT /api/schools/:id` - Update school

### Users
- `GET /api/users` - Get users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

### Students
- `GET /api/students` - Get students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student
- `PUT /api/students/:id` - Update student

## Database Schema

See `backend/prisma/schema.prisma` for complete database schema.

Key Tables:
- **schools** - School information
- **users** - User accounts with roles
- **students** - Student records
- **teachers** - Teacher records
- **classes** - Class definitions
- **sections** - Class sections
- **attendance** - Attendance records
- **fees** - Fee structures
- **fee_payments** - Payment records
- **exams** - Exam schedules
- **marks** - Student marks
- **subscriptions** - School subscriptions
- **audit_logs** - Audit trail

## Environment Variables

### Backend `.env`
```
DATABASE_URL=mysql://user:password@localhost:3306/school_management
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

## Security

- All APIs are protected with JWT authentication
- Every table contains `school_id` for multi-tenant isolation
- Every API automatically filters data by `school_id`
- Passwords hashed with Bcrypt
- Rate limiting enabled
- Helmet security headers
- Input validation with Zod
- CORS configured

## Development

### Running Tests
```bash
cd backend
npm run test
```

### Database Migration
```bash
cd backend
npx prisma migrate dev --name "migration-name"
```

### Prisma Studio
```bash
cd backend
npx prisma studio
```

## Deployment

See Docker and Docker Compose configuration for production deployment.

## License

Proprietary - School Management SaaS

## Support

For support, contact support@schoolmanagement.local
