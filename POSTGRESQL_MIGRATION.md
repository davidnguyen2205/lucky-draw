# 🔄 PostgreSQL Migration Guide

This guide walks you through migrating your Lucky Draw application from client-side storage (LocalForage + localStorage) to PostgreSQL with a backend API.

## 📋 Prerequisites

Before starting the migration, ensure you have:

- **Node.js 18+** installed
- **PostgreSQL 14+** installed and running
- **Git** for version control

## 🗄️ Step 1: Install PostgreSQL

### On macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On Windows:
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

## 🏗️ Step 2: Set Up Database

1. **Create database and user:**
```sql
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database and user
CREATE DATABASE lucky_draw;
CREATE USER lucky_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE lucky_draw TO lucky_user;

# Exit psql
\q
```

2. **Test connection:**
```bash
psql -U lucky_user -d lucky_draw -h localhost
```

## 🚀 Step 3: Set Up Backend API

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp env.example .env
```

4. **Edit .env file:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lucky_draw
DB_USER=lucky_user
DB_PASSWORD=secure_password_here
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
```

5. **Run database migrations:**
```bash
npm run db:migrate
```

6. **Start backend server:**
```bash
npm run dev
```

The backend will start on `http://localhost:3000`

## 🖥️ Step 4: Update Frontend Configuration

The frontend has already been configured to work with the backend API. The key changes include:

### API Services (`src/api/services.ts`)
- Session management with `X-Session-Id` headers
- RESTful API calls for persons, prizes, and config
- Error handling and loading states

### Store Updates
- New API-based stores (`personConfigAPI.ts`)
- Async actions for all CRUD operations
- Loading and error state management

### Proxy Configuration (`vite.config.ts`)
- API requests are proxied to `http://localhost:3000`
- Maintains the `/api` prefix for backend routes

## 🔄 Step 5: Data Migration

To migrate existing localStorage data to PostgreSQL:

1. **Export existing data (if any):**
```javascript
// Run in browser console on the old version
const exportData = {
  persons: JSON.parse(localStorage.getItem('personConfig') || '{}'),
  prizes: JSON.parse(localStorage.getItem('prizeConfig') || '{}'),
  global: JSON.parse(localStorage.getItem('globalConfig') || '{}')
}
console.log('Export data:', JSON.stringify(exportData, null, 2))
```

2. **Import via new API:**
- Use the person and prize management interfaces
- Upload Excel files for person data
- Configure prizes through the UI

## 🧪 Step 6: Testing

1. **Test backend health:**
```bash
curl http://localhost:3000/api/health
```

2. **Test frontend connection:**
- Start frontend: `npm run dev` (in root directory)
- Access: `http://localhost:6719/log-lottery/`
- Create some test participants and prizes
- Run a test lottery

3. **Verify data persistence:**
- Refresh the page
- Data should persist across sessions
- Check PostgreSQL directly:
```sql
psql -U lucky_user -d lucky_draw
SELECT * FROM persons;
SELECT * FROM prizes;
```

## 🚀 Step 7: Production Deployment

### Backend Deployment Options:

#### Option A: Traditional VPS/Server
```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start src/server.js --name lucky-draw-api

# Set up nginx reverse proxy
# Add to nginx.conf:
location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

#### Option B: Docker Deployment
```bash
# Build backend image
cd backend
docker build -t lucky-draw-backend .

# Run with Docker Compose
docker-compose up -d
```

#### Option C: Cloud Services
- **Heroku**: Use Heroku Postgres add-on
- **Railway**: Deploy with built-in PostgreSQL
- **Vercel**: Use with PlanetScale or Supabase
- **AWS**: ECS + RDS or Elastic Beanstalk

### Frontend Deployment:
```bash
# Build for production
npm run build

# Deploy to:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - GitHub Pages
```

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong passwords and JWT secrets
   - Rotate secrets regularly

2. **Database Security:**
   - Limit database user permissions
   - Use SSL/TLS for connections
   - Regular backups

3. **API Security:**
   - CORS configuration for production domains
   - Rate limiting (consider adding)
   - Input validation (already implemented)

## 📊 Monitoring & Maintenance

1. **Database Monitoring:**
```sql
-- Check connection count
SELECT count(*) FROM pg_stat_activity;

-- Monitor table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation 
FROM pg_stats WHERE tablename = 'persons';
```

2. **Application Monitoring:**
- Set up logging (Winston, Pino)
- Monitor API response times
- Set up alerts for errors

3. **Backups:**
```bash
# Daily backup script
pg_dump -U lucky_user -h localhost lucky_draw > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U lucky_user -d lucky_draw < backup_20241225.sql
```

## 🆘 Troubleshooting

### Common Issues:

1. **Connection refused:**
   - Check PostgreSQL is running: `pg_isready`
   - Verify credentials in `.env`
   - Check firewall settings

2. **Migration fails:**
   - Ensure database exists and user has permissions
   - Check PostgreSQL version compatibility
   - Review error logs

3. **Frontend API errors:**
   - Verify backend is running on port 3000
   - Check browser network tab for 404/500 errors
   - Confirm proxy configuration in vite.config.ts

4. **Session not persisting:**
   - Check browser localStorage for session-id
   - Verify X-Session-Id header in requests
   - Check backend session middleware

### Performance Optimization:

1. **Database Indexes:**
   - Already included in schema.sql
   - Monitor slow queries: `EXPLAIN ANALYZE`

2. **Connection Pooling:**
   - Configured in connection.js
   - Adjust pool size based on load

3. **Caching:**
   - Consider Redis for session storage
   - Implement API response caching

## 🎉 Benefits After Migration

- ✅ **Multi-device access** - Data syncs across devices
- ✅ **Data reliability** - ACID transactions and backups
- ✅ **Scalability** - Handle multiple concurrent users
- ✅ **Advanced features** - User accounts, permissions, analytics
- ✅ **Enterprise ready** - Audit trails, data export/import
- ✅ **Performance** - Indexed queries and optimized storage

## 🔄 Rollback Plan

If issues arise, you can quickly rollback:

1. **Stop backend server**
2. **Revert frontend to localStorage version:**
   ```bash
   git checkout HEAD~1 -- src/store/
   ```
3. **Update vite.config.ts** to remove API proxy
4. **Restart frontend**

Your data in PostgreSQL will remain safe for future migration attempts.

---

🚀 **Ready to migrate?** Follow these steps in order, and you'll have a robust PostgreSQL-backed lottery system!
