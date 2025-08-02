# Backend Deployment on Render - Complete Guide

## 🎯 Goal
Deploy your Node.js backend on Render so it's accessible worldwide via HTTPS.

## 📋 Prerequisites
- GitHub repository with your code
- Render account (free)
- PostgreSQL database (Supabase/Neon)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is on GitHub
```bash
# If not already done, push your code to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Verify Backend Structure
Your `backend/` folder should contain:
- `server.js` (main file)
- `package.json` (dependencies)
- `config.js` (database config)
- All other backend files

---

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

---

## Step 3: Create Web Service

### 3.1 Start New Service
1. In Render dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect"** next to your GitHub repository

### 3.2 Configure Service Settings
Fill in these details:

| Setting | Value |
|---------|-------|
| **Name** | `store-ratings-backend` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 3.3 Advanced Settings (Optional)
- **Auto-Deploy**: ✅ Enabled (recommended)
- **Branch**: `main` (or your default branch)

---

## Step 4: Set Environment Variables

### 4.1 Add Database Variables
Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
DB_HOST=your-supabase-host.supabase.co
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=your-super-secure-jwt-secret-key-here
PORT=10000
```

### 4.2 Get Database Credentials
If using Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Create new project or use existing
3. Go to **Settings** → **Database**
4. Copy:
   - **Host**: `db.xxxxxxxxxxxxx.supabase.co`
   - **Password**: (from project settings)

### 4.3 Generate JWT Secret
Create a strong JWT secret:
```bash
# Option 1: Use online generator
# Go to: https://generate-secret.vercel.app/32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 5: Deploy

### 5.1 Create Service
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. You'll see build logs in real-time

### 5.2 Monitor Deployment
Watch the logs for:
- ✅ **Build successful**
- ✅ **Installation completed**
- ✅ **Service is live**

### 5.3 Get Your Backend URL
After successful deployment, you'll get:
```
https://your-app-name.onrender.com
```

---

## Step 6: Test Your Backend

### 6.1 Health Check
Visit: `https://your-app-name.onrender.com/api/health`
Should return: `{"status":"OK","timestamp":"..."}`

### 6.2 Test API Endpoints
Using curl or Postman:
```bash
# Test registration
curl -X POST https://your-app-name.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","address":"Test Address"}'

# Test login
curl -X POST https://your-app-name.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adi@gmail.com","password":"Adi@123"}'
```

---

## Step 7: Update Frontend Configuration

### 7.1 Update API URL
In your frontend deployment (Netlify), set environment variable:
```env
REACT_APP_API_URL=https://your-app-name.onrender.com/api
```

### 7.2 Update CORS (if needed)
In `backend/server.js`, ensure CORS includes your frontend domain:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.netlify.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

---

## Step 8: Verify Global Access

### 8.1 Test from Different Devices
- ✅ Mobile phone
- ✅ Different computer
- ✅ Different network
- ✅ Different country (if possible)

### 8.2 Test API Endpoints
```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Admin login
curl -X POST https://your-app-name.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adi@gmail.com","password":"Adi@123"}'
```

---

## Step 9: Monitor and Maintain

### 9.1 View Logs
- Go to Render dashboard
- Click on your service
- Click **"Logs"** tab
- Monitor for errors

### 9.2 Auto-Deploy
- Every push to GitHub triggers new deployment
- Monitor deployment status
- Check logs for any issues

### 9.3 Performance
- Free tier has limitations
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds

---

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check `package.json` has all dependencies
   - Verify Node.js version compatibility
   - Check build logs for specific errors

2. **Database Connection Error**
   - Verify database credentials
   - Check if database is accessible
   - Ensure SSL settings are correct

3. **Service Won't Start**
   - Check start command in `package.json`
   - Verify `server.js` is the main file
   - Check environment variables

4. **CORS Errors**
   - Update CORS origin to include frontend domain
   - Redeploy after changes

### Debug Commands:
```bash
# Test database connection
curl https://your-app-name.onrender.com/api/health

# Check service status
# Go to Render dashboard → Your service → Logs

# Test specific endpoint
curl -X POST https://your-app-name.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adi@gmail.com","password":"Adi@123"}'
```

---

## Success Checklist

- [ ] Repository connected to Render
- [ ] Web service created with correct settings
- [ ] Environment variables set
- [ ] Database credentials configured
- [ ] Service deployed successfully
- [ ] Health check endpoint working
- [ ] API endpoints responding
- [ ] Frontend can connect to backend
- [ ] Admin login working (`adi@gmail.com` / `Adi@123`)
- [ ] Service accessible from different devices

---

## Your Backend URL
After successful deployment, your backend will be accessible at:
```
https://your-app-name.onrender.com
```

**Anyone in the world can now access your API!** 🌍

---

## Next Steps
1. Deploy frontend to Netlify
2. Update frontend API URL
3. Test complete application
4. Share your app with users

Need help? Check the logs in Render dashboard or refer to the troubleshooting section above. 