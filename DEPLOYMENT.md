# Store Ratings App Deployment Guide

## Current Issues and Solutions

### 1. Backend Deployment Required
Your backend needs to be deployed separately. Netlify only hosts static files (frontend), but your backend is a Node.js server.

### 2. Recommended Backend Deployment Options:

#### Option A: Render.com (Recommended - Free)
1. Go to [render.com](https://render.com)
2. Create account and connect your GitHub repository
3. Create a new Web Service
4. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (deploy from root)
5. Add environment variables:
   ```
   NODE_ENV=production
   DB_HOST=your-postgres-host
   DB_USER=your-postgres-user
   DB_PASSWORD=your-postgres-password
   DB_NAME=store_ratings
   JWT_SECRET=your-secret-key
   ```

#### Option B: Railway.app
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend folder
4. Add PostgreSQL database
5. Configure environment variables

#### Option C: Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Create new app
4. Add PostgreSQL addon
5. Deploy using Git

### 3. Database Setup
You need a PostgreSQL database. Options:
- **Render**: Built-in PostgreSQL
- **Railway**: Built-in PostgreSQL  
- **Heroku**: PostgreSQL addon
- **Supabase**: Free PostgreSQL hosting
- **Neon**: Serverless PostgreSQL

### 4. Frontend Configuration
After deploying backend, update the API URL:

1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add: `REACT_APP_API_URL=https://your-backend-url.com/api`
3. Redeploy the site

### 5. Environment Variables for Backend
Set these in your backend deployment platform:

```env
NODE_ENV=production
DB_HOST=your-postgres-host
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_NAME=store_ratings
DB_PORT=5432
JWT_SECRET=your-secure-secret-key
PORT=5000
```

### 6. Quick Fix Steps:

1. **Deploy Backend** (choose one platform above)
2. **Get Backend URL** (e.g., https://your-app.onrender.com)
3. **Update Frontend API URL** in Netlify environment variables
4. **Redeploy Frontend** on Netlify

### 7. Testing the Fix:

1. Visit your Netlify site
2. Try to register a new user
3. Try to login with existing credentials
4. Check browser console for any errors

### 8. Common Error Messages and Solutions:

- **"Network Error"**: Backend not deployed or wrong API URL
- **"CORS Error"**: Backend CORS not configured for your domain
- **"Database Connection Error"**: PostgreSQL not set up or wrong credentials
- **"JWT Error"**: Missing or wrong JWT_SECRET

### 9. Admin Login Credentials:
After deployment, you can login as admin with:
- Email: `adi@gmail.com`
- Password: `Adi@123`

### 10. Monitoring:
- Check backend logs in your deployment platform
- Check browser console for frontend errors
- Use browser Network tab to see API requests

## Need Help?
If you're still having issues after following this guide, please:
1. Check the backend logs in your deployment platform
2. Check browser console for specific error messages
3. Verify all environment variables are set correctly
4. Ensure the database is properly connected 