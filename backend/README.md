# Lucky Draw Backend API

A Node.js/Express backend with PostgreSQL for the Lucky Draw application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE lucky_draw;
   CREATE USER lucky_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE lucky_draw TO lucky_user;
   ```

5. **Set up database with demo data:**
   ```bash
   npm run db:setup  # Runs migrations + imports demo data
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 🎯 Demo Data

The system includes comprehensive demo data:

**Demo Session ID:** `demo-session-default`

**Included Data:**
- **25 sample employees** across different departments (Executive, Management, Staff, Support, Administration, Consulting)
- **5 prize categories** (Third Prize, Second Prize, First Prize, Grand Prize, Special Prize)
- **Music configuration** with sample audio files
- **Image configuration** with prize images
- **Global settings** (colors, patterns, etc.)

**Usage in Frontend:**
```javascript
// Use this session ID in your API calls
const SESSION_ID = 'demo-session-default'

fetch('/api/persons', {
  headers: { 'X-Session-Id': SESSION_ID }
})
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check server and database status

### Session Management
- Sessions are automatically created/managed via `X-Session-Id` header

### Persons (Participants)
- `GET /api/persons` - Get all persons for session
- `POST /api/persons/bulk` - Bulk import persons
- `PUT /api/persons/:id` - Update person (mark as winner, etc.)
- `DELETE /api/persons/:id` - Delete person
- `POST /api/persons/reset-lottery` - Reset all lottery results

### Prizes
- `GET /api/prizes` - Get all prizes for session
- `POST /api/prizes` - Create or update prize
- `PUT /api/prizes/:id` - Update prize
- `DELETE /api/prizes/:id` - Delete prize
- `POST /api/prizes/reset` - Reset all prizes

### Global Configuration
- `GET /api/config/:key` - Get configuration value
- `POST /api/config/:key` - Save configuration value

## 🗄️ Database Schema

### Tables
- **users** - Session management
- **persons** - Lottery participants
- **prizes** - Prize configurations
- **lottery_results** - Winner records
- **global_configs** - App settings
- **uploaded_files** - File metadata

### Key Features
- **Session-based isolation** - Each user session has separate data
- **ACID transactions** - Ensure data consistency
- **Automatic timestamps** - Created/updated tracking
- **UUID primary keys** - Globally unique identifiers

## 🔄 Frontend Integration

### Update vite.config.ts proxy:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

### Use API services in stores:
```typescript
import { personAPI, prizeAPI, configAPI } from '@/api/services'

// Replace localStorage calls with API calls
const persons = await personAPI.getAll()
await prizeAPI.save(prizeData)
await configAPI.save('theme', themeConfig)
```

## 🐳 Docker Deployment

### Using Docker Compose:
```bash
# Copy environment file
cp env.example .env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run db:migrate
```

## 🔒 Security Features

- **CORS protection** - Configurable origins
- **Helmet security headers** - XSS protection
- **Input validation** - express-validator
- **SQL injection protection** - Parameterized queries
- **Session isolation** - User data separation

## 🚀 Production Deployment

1. **Set environment variables:**
   ```bash
   NODE_ENV=production
   DB_HOST=your-postgres-host
   DB_PASSWORD=strong-password
   JWT_SECRET=random-secret-key
   ```

2. **Use process manager:**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start src/server.js --name lucky-draw-api
   
   # Using Docker
   docker build -t lucky-draw-backend .
   docker run -d -p 3000:3000 lucky-draw-backend
   ```

3. **Set up reverse proxy (Nginx):**
   ```nginx
   location /api {
     proxy_pass http://localhost:3000;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
   }
   ```

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Database connection pooling with monitoring
- Error logging and handling
- Graceful shutdown handling

## 🔧 Development

### Database Operations:
```bash
# Run migrations only
npm run db:migrate

# Import demo data only
npm run db:import

# Full database setup
npm run db:setup

# View logs
npm run dev

# Test API with demo data
curl -H "X-Session-Id: demo-session-default" http://localhost:3000/api/persons
curl -H "X-Session-Id: demo-session-default" http://localhost:3000/api/prizes
```

### Adding New Features:
1. Add database schema changes to `schema.sql`
2. Create route files in `src/routes/`
3. Update API services in frontend
4. Test with frontend integration
