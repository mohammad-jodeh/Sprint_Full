# RAILWAY.APP - QUICK ENVIRONMENT VARIABLES SETUP

## **WHAT RAILWAY AUTO-PROVIDES** ✅

When you add these services, Railway auto-creates variables:

### PostgreSQL Service → Auto Creates:
```
DATABASE_URL=postgresql://postgres:[TOKEN]@containers-us-west-123.railway.app:5432/railway
```
Just copy it - no manual setup needed!

---

## **WHAT YOU MUST MANUALLY SET** ⚠️

In Railway Dashboard → Your Project → Variables Panel:

### **1. NODE_ENV**
```
Key:   NODE_ENV
Value: production
```

### **2. JWT_SECRET** (REQUIRED - Security!)
```
Key:   JWT_SECRET
Value: Generate using one of these:
```

**Option A: Terminal Command**
```bash
openssl rand -hex 32
```
Outputs something like: `a8f3b2c9d5e1f4a7b3c2d5e1f4a7b3c2d5e1f4a7b3c2d5e1`

**Option B: Online Generator**
- Go to: https://generate-random.org/
- Set to 32 characters
- Copy the string

**Option C: Simple (less secure but works)**
```
my-super-secret-key-minimum-32chars-here123456789
```

### **3. SENDGRID_API_KEY** (For Email Verification)
```
Key:   SENDGRID_API_KEY
Value: SG.xxxxxxxxxxxxxxxxxxxxxx
```

**How to get it:**
1. Go to https://sendgrid.com/free
2. Sign up (free account)
3. Click "Create API Key"
4. Name it: "Sprintify Backend"
5. Set "Full Access"
6. Copy the key that starts with `SG.`
7. Paste in Railway

### **4. SENDGRID_FROM_EMAIL**
```
Key:   SENDGRID_FROM_EMAIL
Value: noreply@yourapp.com
```
(or use your actual email while testing)

### **5. FRONTEND_URL** (CORS)
```
Key:   FRONTEND_URL
Value: https://your-app.vercel.app
```
After Vercel deploys frontend, use that URL

### **6. PORT** (Optional but recommended)
```
Key:   PORT
Value: 4000
```

### **7. LOG_LEVEL** (Optional)
```
Key:   LOG_LEVEL
Value: info
```

---

## **COMPLETE SETUP CHECKLIST** ✅

**When on Railway → Your Project → Variables:**

- [ ] DATABASE_URL → (Auto from PostgreSQL - just copy)
- [ ] JWT_SECRET → (Generate with `openssl rand -hex 32`)
- [ ] NODE_ENV → `production`
- [ ] SENDGRID_API_KEY → (From SendGrid account)
- [ ] SENDGRID_FROM_EMAIL → `noreply@yourapp.com`
- [ ] FRONTEND_URL → `https://your-vercel-domain.vercel.app`
- [ ] PORT → `4000`
- [ ] LOG_LEVEL → `info`

---

## **STEP-BY-STEP: SET VARIABLES ON RAILWAY**

1. **Go to Railway Dashboard**
   - https://railway.app/dashboard

2. **Select Your Project**
   - Click "sprintify-backend" project

3. **Click Backend Service**
   - Click on "sprintify-backend" in the services list

4. **Go to Variables Tab**
   - Top menu should have: "Logs", "Deploy", "Variables"
   - Click "Variables"

5. **Click "+ Add Variable"**
   - New row appears
   - Fill in Key and Value

6. **Add Each Variable:**
   ```
   DATABASE_URL=<auto - just copy from PostgreSQL>
   JWT_SECRET=<generate random>
   SENDGRID_API_KEY=<from SendGrid>
   SENDGRID_FROM_EMAIL=noreply@yourapp.com
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   PORT=4000
   LOG_LEVEL=info
   ```

7. **After Each Variable:**
   - Press Tab or click away
   - Variable is saved automatically

8. **Railway Auto-Redeploys**
   - After variables are saved
   - New deployment starts
   - Check Logs tab to see deployment progress

---

## **SENDGRID - FREE EMAIL SETUP (5 MINUTES)**

### Get Your SendGrid API Key:
1. Go to https://sendgrid.com/free
2. Click "Sign Up Free"
3. Enter your email and password
4. Verify email
5. Search for "API Keys" in top search
6. Click "Settings" → "API Keys"
7. Click "Create API Key"
8. Name: "Sprintify Backend"
9. Select "Full Access"
10. Copy the key (starts with `SG.`)
11. Paste in Railway SENDGRID_API_KEY

Free tier includes:
- ✅ 100 emails per day
- ✅ Unlimited API calls
- ✅ Great for testing

---

## **VERIFY YOUR SETUP**

After setting all variables on Railway:

1. **Check Deployment Status**
   - Railway → Deployments tab
   - Should show "Running" with green checkmark

2. **Test API Endpoint**
   - Open: `https://your-railway-domain/api/v1/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

3. **Check Logs for Errors**
   - Railway → Logs tab
   - Scroll down
   - Look for error messages
   - No ERROR = Success! ✅

### Common Error Messages & Fixes:

**Error: "Cannot connect to database"**
- ✅ Fix: DATABASE_URL is in variables (should auto-appear)

**Error: "JWT_SECRET is undefined"**
- ✅ Fix: Add JWT_SECRET variable with 32+ characters

**Error: "Cannot send email"**
- ✅ Fix: Add SENDGRID_API_KEY from SendGrid

**Error: "CORS error from frontend"**
- ✅ Fix: Set FRONTEND_URL to match your Vercel domain

---

## **FINAL STEP: CONNECT FRONTEND TO BACKEND**

After backend is deployed on Railway:

1. **Get Your Backend URL**
   - Railway → Backend Service → Domains
   - Copy the URL (example: `https://sprintify-backend.railway.app`)

2. **Update Frontend on Vercel**
   - Vercel Dashboard → sprintify-frontend → Settings
   - Environment Variables
   - Add/Update: `VITE_API_BASE_URL`
   - Value: `https://your-railroad-url.railway.app/api/v1`
   - **IMPORTANT: Include `/api/v1` at the end!**

3. **Redeploy Frontend**
   - Vercel → Deployments
   - Click "Redeploy" on latest
   - Wait for build complete
   - Your app is now connected! ✅

---

## **PRODUCTION URLs**

After deployment:
```
Frontend:   https://your-app.vercel.app
Backend:    https://sprintify-backend.railway.app/api/v1
Database:   PostgreSQL on Railway (connected via DATABASE_URL)
Emails:     SendGrid (connected via SENDGRID_API_KEY)
```

---

## **TROUBLESHOOTING**

**"Build failed on Railway"**
→ Check Logs tab for error
→ Make sure package.json has correct dependencies
→ Rebuild: Railway → Deployments → Redeploy

**"Frontend shows 404 or blank page"**
→ Check VITE_API_BASE_URL is correct
→ Should be: `https://backend.railway.app/api/v1`
→ Open browser console (F12) → check for errors

**"Login/Signup doesn't work"**
→ Check backend logs on Railway
→ Verify JWT_SECRET is set
→ Check DATABASE_URL connection

**"Email not sending"**
→ Verify SENDGRID_API_KEY is correct
→ Check email domain is verified in SendGrid
→ SendGrid free tier: 100 emails/day max

---

**🎉 YOU'RE ALL SET! Your app is now LIVE on the internet!**

Share your Vercel URL with friends and start getting feedback!
