# Multi-User Todo Application - Phase 2

A secure, multi-user todo application with JWT-based authentication built using the Agentic Dev Stack.

## 🎯 MVP Features (Completed)

✅ **User Authentication**
- User signup with email/password validation
- User signin with JWT token issuance
- Protected routes with automatic redirect
- Sign out functionality
- Stateless authentication (no session storage)

## 🏗️ Technology Stack

### Frontend
- **Next.js 15+** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Better Auth** (JWT-based authentication)

### Backend
- **Python FastAPI**
- **SQLModel** (ORM)
- **Neon Serverless PostgreSQL**
- **python-jose** (JWT verification)
- **passlib** (password hashing)

## 📁 Project Structure

```
phase 2/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models (User, Task)
│   │   ├── middleware/      # JWT verification middleware
│   │   ├── api/            # API routes (tasks endpoints)
│   │   ├── core/           # Config and security utilities
│   │   └── db/             # Database session management
│   ├── schema.sql          # Database migration script
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Auth, API client, types
│   ├── package.json        # Node dependencies
│   └── .env.local.example  # Frontend environment template
└── specs/                  # Feature specifications & plans
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.11+
- **Neon PostgreSQL** account (free tier available at [neon.tech](https://neon.tech))

### Step 1: Clone & Navigate

```bash
cd "phase 2"
```

### Step 2: Database Setup

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy your connection string (it should look like: `postgresql://username:password@hostname/database?sslmode=require`)
3. Run the migration script:

```bash
# Option 1: Via Neon SQL Editor (recommended)
# - Open Neon dashboard
# - Go to SQL Editor
# - Paste contents of backend/schema.sql
# - Execute

# Option 2: Via psql
psql "your-neon-connection-string" < backend/schema.sql
```

### Step 3: Generate JWT Secret

```bash
# Generate a strong 32-character secret
openssl rand -base64 32
```

Copy the output - you'll use it in both backend and frontend.

### Step 4: Backend Setup

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env and add:
# - BETTER_AUTH_SECRET=<your-generated-secret>
# - DATABASE_URL=<your-neon-connection-string>
# - FRONTEND_URL=http://localhost:3000

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 5: Frontend Setup

```bash
cd ../frontend

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local and add:
# - BETTER_AUTH_SECRET=<same-secret-as-backend>
# - NEXT_PUBLIC_API_URL=http://localhost:8000

# Install dependencies
npm install
```

### Step 6: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Or venv\Scripts\activate on Windows
uvicorn src.main:app --reload

# Backend will run on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Frontend will run on http://localhost:3000
```

## 🧪 Testing the MVP

1. **Open browser** → `http://localhost:3000`
2. **Create account** → Click "create a new account" → Enter email & password
3. **Verify validation** → Try weak password, see error messages
4. **Sign up** → Account created, auto-redirected to tasks page
5. **Sign out** → Click "Sign Out" button
6. **Sign in** → Use same credentials, redirected to tasks page
7. **Verify JWT** → Open browser DevTools → Network tab → See `Authorization: Bearer <token>` header

## 📊 MVP Success Criteria

✅ Users can create accounts in under 60 seconds
✅ Users can sign in and view protected page in under 5 seconds
✅ Password validation (8+ chars, uppercase, lowercase, number)
✅ Email validation (proper format)
✅ Duplicate email prevention
✅ JWT-based stateless authentication
✅ Protected routes redirect unauthenticated users
✅ Sign out functionality works correctly

## 🔐 Security Features

- **Password Hashing**: Bcrypt via Better Auth
- **JWT Tokens**: HS256 algorithm, 24-hour expiration
- **Stateless Auth**: No server-side session storage
- **Protected Routes**: Middleware checks authentication
- **CORS**: Configured to allow only frontend origin
- **Generic Errors**: No user enumeration on signin failures

## 📝 Environment Variables

### Backend (.env)
```env
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### Frontend (.env.local)
```env
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters
NEXT_PUBLIC_API_URL=http://localhost:8000
```

⚠️ **CRITICAL**: `BETTER_AUTH_SECRET` must be identical in both files!

## 🐛 Troubleshooting

### "Module not found" errors (Frontend)
```bash
rm -rf node_modules package-lock.json
npm install
```

### "No module named 'src'" (Backend)
```bash
# Make sure you're running from backend/ directory
# And virtual environment is activated
cd backend
source venv/bin/activate
```

### Database connection errors
- Verify `DATABASE_URL` is correct in backend/.env
- Check Neon dashboard - database should be active
- Ensure `?sslmode=require` is in connection string

### JWT verification fails
- Ensure `BETTER_AUTH_SECRET` is the same in both .env files
- Secret must be at least 32 characters
- Restart both servers after changing .env files

### CORS errors
- Verify `FRONTEND_URL` in backend/.env matches your frontend URL
- Default should be `http://localhost:3000`

## 🎯 Next Steps

### User Story 2: Task CRUD (16 tasks)
- Create new tasks
- View task list (user-scoped)
- List tasks ordered by creation date
- User isolation enforcement

### User Story 3: Toggle Completion (9 tasks)
- Mark tasks complete/incomplete
- Visual indicators (strikethrough)
- Persist completion state

### User Story 4: Update Tasks (12 tasks)
- Edit task titles
- Validation on update
- Cancel edit functionality

### User Story 5: Delete Tasks (9 tasks)
- Delete with confirmation
- Permanent removal
- Persist deletion

## 📚 Documentation

- **Specification**: `specs/001-multi-user-todo-auth/spec.md`
- **Implementation Plan**: `specs/001-multi-user-todo-auth/plan.md`
- **Task List**: `specs/001-multi-user-todo-auth/tasks.md` (100 tasks total)
- **Data Model**: `specs/001-multi-user-todo-auth/data-model.md`
- **API Contracts**: `specs/001-multi-user-todo-auth/contracts/`
- **Technical Research**: `specs/001-multi-user-todo-auth/research.md`

## 🤝 Contributing

This project follows **Spec-Driven Development** (SDD):
1. All features defined in specifications
2. Implementation plans document architecture
3. Tasks broken into testable units
4. Code generated via Claude Code agents
5. No manual coding outside agent outputs

## 📄 License

Private project for Phase 2 Hackathon evaluation.

---

**Built with Claude Code + Spec-Kit Plus** 🚀
