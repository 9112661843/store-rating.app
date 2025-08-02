# Quick Backend Deployment Guide

## The Problem
Your frontend is deployed on Netlify, but your backend (Node.js server) is not deployed. This is why login and registration are failing.

## Solution: Deploy Backend to Render.com (Free)

### Step 1: Prepare Your Code
1. Make sure your code is pushed to GitHub
2. Ensure your repository is public (for free tier)

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `store-ratings-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
In Render dashboard, go to Environment → Environment Variables and add:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here
DB_HOST=your-postgres-host
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_NAME=store_ratings
DB_PORT=5432
```

### Step 4: Add PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name it `store-ratings-db`
3. Copy the database credentials to your environment variables

### Step 5: Update Frontend
1. Get your backend URL from Render (e.g., `https://your-app.onrender.com`)
2. In Netlify dashboard, go to Site settings → Environment variables
3. Add: `REACT_APP_API_URL=https://your-app.onrender.com/api`
4. Redeploy your site

### Step 6: Test
1. Visit your Netlify site
2. Try to register a new user
3. Try to login

## Alternative: Railway.app
If Render doesn't work, try [railway.app](https://railway.app):
1. Connect GitHub repository
2. Deploy backend folder
3. Add PostgreSQL database
4. Set environment variables
5. Get the URL and update frontend

## Testing Your Deployment
After deployment, run this command to test:
```bash
cd backend
npm install
node test-deployment.js https://your-backend-url.com
```

## Admin Login
After successful deployment, you can login as admin:
- Email: `adi@gmail.com`
- Password: `Adi@123`

## Common Issues
- **"Build failed"**: Check if all dependencies are in package.json
- **"Database connection failed"**: Verify PostgreSQL credentials
- **"CORS error"**: Backend CORS is now fixed for your domain
- **"API not found"**: Make sure you're using the correct backend URL

## Need Help?
1. Check Render/Railway logs for errors
2. Verify all environment variables are set
3. Make sure PostgreSQL is running
4. Test the backend URL directly in browser 