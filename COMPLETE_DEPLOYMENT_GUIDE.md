# Complete Store Ratings App Deployment Guide

## Overview
This guide will help you deploy your store ratings application with:
- **Frontend**: React app (deployed on Netlify)
- **Backend**: Node.js/Express API (deployed on Render/Railway/Heroku)
- **Database**: PostgreSQL (hosted on the same platform as backend)

## Prerequisites
- GitHub repository with your code
- Git installed on your computer
- Node.js and npm installed

---

## Step 1: Database Setup

### Option A: Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Go to Settings > Database
4. Note down your connection details:
   - Host: `db.xxxxxxxxxxxxx.supabase.co`
   - Database: `postgres`
   - Port: `5432`
   - User: `postgres`
   - Password: (from your project settings)

### Option B: Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create account and new project
3. Get connection string from dashboard

---

## Step 2: Backend Deployment

### Option A: Render.com (Recommended - Free)

1. **Sign up and connect repository**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Connect your repository

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Set configuration:
     - **Name**: `store-ratings-backend`
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   DB_HOST=your-supabase-host
   DB_USER=postgres
   DB_PASSWORD=your-supabase-password
   DB_NAME=postgres
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-app.onrender.com`

### Option B: Railway.app
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Create new project
4. Add PostgreSQL database
5. Deploy backend folder
6. Set environment variables

### Option C: Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Create new app
4. Add PostgreSQL addon
5. Deploy using Git

---

## Step 3: Frontend Deployment

### Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository

2. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.com/api`
   - Replace `your-backend-url.com` with your actual backend URL

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be available at: `https://your-app.netlify.app`

---

## Step 4: Update CORS Configuration

After deploying backend, update the CORS settings in `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

Replace `your-frontend-url.netlify.app` with your actual Netlify domain.

---

## Step 5: Database Initialization

Your backend will automatically create the database tables when it starts. The admin user will be created with:
- Email: `adi@gmail.com`
- Password: `Adi@123`

---

## Step 6: Testing Your Deployment

1. **Test Frontend**: Visit your Netlify URL
2. **Test Registration**: Try creating a new user account
3. **Test Login**: Login with admin credentials
4. **Test API**: Check browser console for any errors

---

## Step 7: Environment Variables Summary

### Backend Environment Variables (set in Render/Railway/Heroku):
```env
NODE_ENV=production
DB_HOST=your-database-host
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=your-secure-jwt-secret
PORT=10000
```

### Frontend Environment Variables (set in Netlify):
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Step 8: Troubleshooting

### Common Issues:

1. **"Network Error"**
   - Check if backend is deployed and running
   - Verify API URL in frontend environment variables
   - Check CORS configuration

2. **"Database Connection Error"**
   - Verify database credentials
   - Check if database is accessible from your backend platform
   - Ensure SSL settings are correct

3. **"CORS Error"**
   - Update CORS origin in backend to include your frontend domain
   - Redeploy backend after changes

4. **"JWT Error"**
   - Ensure JWT_SECRET is set in backend environment variables
   - Redeploy backend after adding environment variables

### Debugging Steps:
1. Check backend logs in your deployment platform
2. Check browser console for frontend errors
3. Use browser Network tab to see API requests
4. Test API endpoints directly using Postman or curl

---

## Step 9: Monitoring and Maintenance

### Health Check
Your backend includes a health check endpoint: `GET /api/health`

### Logs
- **Backend**: Check logs in your deployment platform dashboard
- **Frontend**: Check browser console and Netlify build logs

### Updates
To update your app:
1. Push changes to GitHub
2. Backend will auto-deploy (if using Render/Railway)
3. Frontend will auto-deploy (if using Netlify)

---

## Step 10: Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **JWT Secret**: Use a strong, random secret
3. **Database**: Use strong passwords
4. **HTTPS**: Both frontend and backend should use HTTPS
5. **CORS**: Only allow your frontend domain

---

## Quick Deployment Checklist

- [ ] Database created (Supabase/Neon)
- [ ] Backend deployed (Render/Railway/Heroku)
- [ ] Backend environment variables set
- [ ] Frontend deployed (Netlify)
- [ ] Frontend environment variables set
- [ ] CORS updated with frontend domain
- [ ] Test registration and login
- [ ] Test admin dashboard
- [ ] Test user functionality

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check deployment platform logs
4. Ensure database is accessible

Your app should now be fully deployed and accessible to users worldwide! 🚀 