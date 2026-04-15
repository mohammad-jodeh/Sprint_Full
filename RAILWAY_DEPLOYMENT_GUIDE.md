# RAILWAY.APP DEPLOYMENT - COMPLETE STEP BY STEP GUIDE

## **PART 1: SETUP RAILWAY ACCOUNT**

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Start Free"** button
3. Choose **"GitHub"** login
4. Authorize Railway app to access your GitHub account
5. Click **"Authorize"**
6. Your Railway account is created! ✅

---

## **PART 2: CREATE NEW PROJECT**

### Step 2: Start New Project
1. Go to https://railway.app/dashboard
2. Click **"+ New Project"** button (top right)
3. You'll see deployment options
4. Click **"Deploy from GitHub"** option

### Step 3: Select Your Backend Repository
1. Search for **"sprintify-backend"** repo
2. Click on it to select
3. Click **"Deploy"** button
4. Railway will clone your repo and start building

> **What happens next:**
> - Railway reads your `package.json`
> - Installs dependencies
> - Detects it's a Node.js project
> - Shows build progress

---

## **PART 3: ADD POSTGRESQL DATABASE**

### Step 4: Add Database to Your Project
1. In Railway dashboard, look for **"+ Add"** button (right side)
2. Click **"+ Add Service"** or **"Add Database"**
3. You'll see database options:
   - PostgreSQL ✅ (SELECT THIS)
   - MySQL
   - MongoDB
4. Click **"PostgreSQL"**
5. Railway will create PostgreSQL instance automatically!

> **What happens:**
> - PostgreSQL container is created
> - DATABASE_URL is generated automatically
> - You can see it in the variables

---

## **PART 4: SET ENVIRONMENT VARIABLES**

### Step 5: Configure Environment Variables
1. In your Railway project, click on the **"sprintify-backend"** service
2. Click **"Variables"** tab (top menu)
3. You'll see a list of variables
4. Look for **"DATABASE_URL"** - it should already be set! ✅

### Step 6: Add Manual Variables
Now add the remaining variables. For each one:

**Variable 1: NODE_ENV**
1. Click **"+ Add Variable"**
2. Key: `NODE_ENV`
3. Value: `production`
4. Click ✓ or press Enter

**Variable 2: JWT_SECRET**
1. Click **"+ Add Variable"**
2. Key: `JWT_SECRET`
3. Value: Generate a random secure string (use one of these):
   ```
   Option A: Use this: "your-super-secret-key-please-change-in-production-12345678"
   Option B: Generate online: https://generate-random.org/ (pick 32 character string)
   Option C: Terminal command: openssl rand -hex 32
   ```
4. Click ✓

**Variable 3: SENDGRID_API_KEY**
1. Click **"+ Add Variable"**
2. Key: `SENDGRID_API_KEY`
3. Value: 
   - Go to https://sendgrid.com (free tier available)
   - Sign up with email
   - Generate API key
   - Paste it here
4. Click ✓

**Variable 4: SENDGRID_FROM_EMAIL**
1. Click **"+ Add Variable"**
2. Key: `SENDGRID_FROM_EMAIL`
3. Value: `noreply@yourdomain.com` (or use your email for testing)
4. Click ✓

**Variable 5: PORT** (optional, but good to set)
1. Click **"+ Add Variable"**
2. Key: `PORT`
3. Value: `4000`
4. Click ✓

### Step 7: View All Variables
After adding, your variables should look like:
```
DATABASE_URL = postgresql://user:pass@host/db
JWT_SECRET = your-secret-key-here
SENDGRID_API_KEY = SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL = noreply@yourdomain.com
NODE_ENV = production
PORT = 4000
```

---

## **PART 5: DEPLOY YOUR BACKEND**

### Step 8: Trigger Deployment
1. Railway should auto-deploy after variables are set
2. Look for **"Deployments"** tab
3. You'll see build progress:
   - ⏳ Building...
   - ✅ Build complete
   - ✅ Running

### Step 9: Monitor Deployment
1. Click on the deployment in progress
2. Watch the logs scroll
3. Look for these success messages:
   ```
   ✓ Dependencies installed
   ✓ Build completed
   ✓ Server listening on port 4000
   ```

### Step 10: Get Your Backend URL
1. Go back to your project
2. Click on **"sprintify-backend"** service
3. Look for **"Domains"** section
4. Copy the URL (looks like: `https://sprintify-backend-prod.railway.app`)
5. This is your API endpoint! ✅

---

## **PART 6: VERIFY DEPLOYMENT**

### Step 11: Test Your API
1. Open a new browser tab
2. Go to your Railway URL + `/api/v1/health` 
   - Example: `https://sprintify-backend-prod.railway.app/api/v1/health`
3. You should see:
   ```json
   {
     "status": "ok",
     "message": "Server is running"
   }
   ```

If you see an error, check the logs:
1. Go back to Railway dashboard
2. Click **"Logs"** tab
3. Scroll down to see what went wrong
4. Most common issues:
   - DATABASE not connected → Check DATABASE_URL
   - Missing ENV variables → Add them
   - Port already in use → Railway handles this

---

## **PART 7: CONNECT FRONTEND TO BACKEND**

### Step 12: Update Frontend with Backend URL
Once your backend is deployed:

1. Go to Vercel dashboard
2. Open **"sprintify-frontend"** project
3. Click **"Settings"** → **"Environment Variables"**
4. Find or create: `VITE_API_BASE_URL`
5. Set value to your Railway backend URL:
   ```
   https://your-backend-url.railway.app/api/v1
   ```
6. Click "Save"
7. Go to "Deployments"
8. Click "Redeploy" on the latest deployment
9. Wait for build to complete
10. Your app will now connect to the production backend! ✅

---

## **PART 8: SENDGRID EMAIL SETUP** (Easy Step)

### Step 13: Setup SendGrid for Email Sending
Email verification needs SendGrid to send emails:

1. Go to https://sendgrid.com/free
2. Click "Sign Up"
3. Enter:
   - Email: your@email.com
   - Password: strong password
   - Company: Sprintify (or your name)
4. Click "Create Account"
5. Verify your email
6. Go to **"Settings"** → **"API Keys"**
7. Click **"Create API Key"**
8. Name it: `Sprintify_Backend`
9. Select **"Full Access"**
10. Click **"Create & Use"**
11. Copy the API Key
12. Paste in Railway `SENDGRID_API_KEY` variable ✅

---

## **COMMON ISSUES & SOLUTIONS**

### ❌ Issue: Build Failed
**Solution:**
1. Check the build logs in Railway
2. Look for errors like "npm install failed"
3. Most likely: dependency conflict (like we fixed earlier)
4. Update `package.json` in sprintify-backend repo
5. Push to GitHub
6. Railway will auto-redeploy

### ❌ Issue: Application crashed
**Solution:**
1. Go to Railway Logs
2. Scroll down to see error message
3. Common: Missing DATABASE_URL
4. Add missing env variables
5. Restart deployment

### ❌ Issue: Database connection error
**Solution:**
1. PostgreSQL service might be sleeping
2. Go to Railway → PostgreSQL service
3. Click "Restart" button
4. Wait 30 seconds
5. Restart your backend service too

### ❌ Issue: Frontend can't reach backend
**Solution:**
1. Check VITE_API_BASE_URL is set correctly
2. Make sure it includes `/api/v1` at the end
3. Example: `https://sprintify-backend.railway.app/api/v1`
4. Not: `https://sprintify-backend.railway.app` ❌
5. Redeploy frontend

---

## **YOUR PRODUCTION URLS WILL BE**

```
Frontend (Vercel):  https://your-app.vercel.app
Backend (Railway):  https://sprintify-backend.railway.app/api/v1
Database:          PostgreSQL on Railway (auto-connected)
```

---

## **FINAL CHECKLIST** ✅

- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] sprintify-backend deployed
- [ ] PostgreSQL database added
- [ ] All env variables set:
  - [ ] DATABASE_URL (auto)
  - [ ] JWT_SECRET
  - [ ] SENDGRID_API_KEY
  - [ ] SENDGRID_FROM_EMAIL
  - [ ] NODE_ENV = production
- [ ] Backend is running (check logs)
- [ ] API endpoint is accessible
- [ ] Frontend updated with backend URL
- [ ] Email verification working
- [ ] Test signup flow end-to-end

---

## **YOU'RE NOW LIVE!** 🚀

Your Sprintify app is running on:
- ✅ Frontend: Vercel (fast CDN)
- ✅ Backend: Railway (secure server)
- ✅ Database: PostgreSQL (reliable data)
- ✅ Email: SendGrid (production email)

**Share your app URL with users and start collecting feedback!**

---

## **MONITORING & UPTIME**

Railway shows:
- **Uptime**: How long your app has been running
- **CPU Usage**: Server load
- **Memory Usage**: App memory consumption
- **Network**: Bandwidth used

Free tier covers all of this! 🎉

---

**Any questions? Check the logs in Railway dashboard for detailed error messages.**
