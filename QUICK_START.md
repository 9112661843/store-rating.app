# Quick Start - Deploy Store Ratings App

## 🚀 Fast Deployment (30 minutes)

### 1. Database Setup (5 minutes)
- Go to [supabase.com](https://supabase.com)
- Create account → New project
- Note: Host, Password (from Settings > Database)

### 2. Backend Deployment (10 minutes)
- Go to [render.com](https://render.com)
- Sign up with GitHub → New Web Service
- Connect your repo
- Settings:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  DB_HOST=your-supabase-host
  DB_USER=postgres
  DB_PASSWORD=your-supabase-password
  DB_NAME=postgres
  DB_PORT=5432
  JWT_SECRET=your-secret-key
  PORT=10000
  ```

### 3. Frontend Deployment (10 minutes)
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub → New site from Git
- Settings:
  - **Base directory**: `frontend`
  - **Build command**: `npm run build`
  - **Publish directory**: `build`
- Environment Variable:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com/api
  ```

### 4. Update CORS (5 minutes)
In `backend/server.js`, update line 30:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend-url.netlify.app'] 
  : ['http://localhost:3000'],
```

## 🧪 Test Your App
- Visit your Netlify URL
- Register a new user
- Login as admin: `adi@gmail.com` / `Adi@123`

## 📚 Detailed Guide
See `COMPLETE_DEPLOYMENT_GUIDE.md` for full instructions.

## 🆘 Need Help?
- Check browser console for errors
- Verify environment variables
- Check deployment platform logs 