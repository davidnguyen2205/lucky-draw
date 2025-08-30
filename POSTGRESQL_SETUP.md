# 🚀 Quick PostgreSQL Setup

Your Lucky Draw application now supports PostgreSQL! Here's how to get it running:

## ✅ Already Done
- ✅ PostgreSQL installed and running
- ✅ Database `lucky_draw` created
- ✅ User `lucky_user` created with password `lucky_password_2024`
- ✅ All tables created with proper schema
- ✅ Backend API ready to run
- ✅ Frontend updated with PostgreSQL support

## 🏃‍♂️ Start the Application

### 1. Start Backend (in a new terminal):
```bash
cd backend
npm run dev
```
This starts the API server on `http://localhost:3000`

### 2. Start Frontend (in another terminal):
```bash
npm run dev
```
This starts the UI on `http://localhost:6719` or `http://localhost:6720`

### 3. Test PostgreSQL Integration:
- Go to `http://localhost:6719/log-lottery/demo`
- You'll see the **PostgreSQL Backend Demo** panel
- Click "Check Health" to verify API connection
- Click "Add Default Persons" to test database insertion
- The data will persist in PostgreSQL!

## 🔧 What Changed?

### Before (Client-Side Only):
- Data stored in browser (localStorage/IndexedDB)
- No sharing between devices
- Data lost if browser cache cleared

### After (PostgreSQL):
- Data stored in PostgreSQL database
- Can access from any device with session ID
- Professional database with backups & reliability
- Multiple users can use the app simultaneously

## 📊 Database Schema

The following tables were created:
- **users** - Session management
- **persons** - Lottery participants  
- **prizes** - Prize configurations
- **lottery_results** - Winner history
- **global_configs** - App settings
- **uploaded_files** - File storage metadata

## 🔒 Session Management

Each user gets a unique session ID that isolates their data. You can:
- Use the app on multiple devices with the same session ID
- Each session has completely separate data
- No authentication required for demo purposes

## 🎯 Next Steps

1. **Test the demo** to see PostgreSQL in action
2. **Import your existing data** using the UI
3. **Run a lottery** and see results persist in the database
4. **Deploy to production** when ready

## 🐛 Troubleshooting

### Backend won't start:
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL if needed
brew services restart postgresql@14
```

### API connection errors:
- Verify backend is running on port 3000
- Check `.env` file has correct database credentials
- Ensure no firewall blocking port 3000

### Database errors:
```bash
# Test database connection
psql -U lucky_user -d lucky_draw -h localhost

# Check tables exist
\dt
```

Enjoy your new PostgreSQL-powered Lucky Draw application! 🎉
