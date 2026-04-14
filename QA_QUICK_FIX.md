# 🚨 QA QUICK REFERENCE - Critical Fixes Before Production

## 🔴 TOP 2 BLOCKERS (Fix First!)

### 1️⃣ NO RATE LIMITING = DDoS Vulnerability
**Time to Fix:** 10-15 minutes  
**Command:**
```bash
cd sprintify_backend/finalAPI
npm install express-rate-limit
```

**Add to `src/API/index.ts` setupMiddleware (after CORS):**
```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
  skipSuccessfulRequests: true,
});

// Add BEFORE setupRoutes():
this.app.use("/api/v1/user/login", authLimiter);
this.app.use("/api/v1", limiter);
```

**Test:** Try 101 requests - should get rate limited ✅

---

### 2️⃣ Race Condition in Token Loading
**Time to Fix:** 15-20 minutes  
**File:** `sprintify_frontend/src/api/config.js`

**Add response interceptor retry logic:**
```javascript
// After the request interceptor, add:
protectedApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Retry once on 401 if it's the first attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait a bit for token to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try with fresh token
      const freshToken = useAuthStore.getState().token;
      if (freshToken) {
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return protectedApi(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Test:** Refresh page and immediately drag issue - should work ✅

---

## 🟠 CRITICAL BEFORE PROD (Fix Before Deploying!)

### 3️⃣ No Project Access Authorization
**File:** `sprintify_backend/finalAPI/src/API/routes/issue.routes.ts`  
**Time to Fix:** 20-30 minutes

**Problem:** User can edit any issue by guessing ID
**Test:** Try updating issue from different project

---

### 4️⃣ No Pagination = Server Crash w/ Large Projects  
**File:** `sprintify_backend/finalAPI/src/API/controllers/issue.controller.ts`  
**Time to Fix:** 30-45 minutes

**Problem:** Returns 10,000+ issues at once
**Test:** Create project with 1000 issues - browser becomes sluggish

---

## 📝 Validation Checklist (Before Launch)

```
SECURITY
□ Rate limiting working (test with 101 requests)
□ No unauthorized access to other projects' issues
□ JWT_SECRET is strong (32+ chars, random)
□ CORS only allows frontend domain
□ HTTPS configured and redirects HTTP

PERFORMANCE  
□ Pagination returns max 100 issues
□ Connection pooling configured
□ WebSocket doesn't leak memory
□ No N+1 query problems

FUNCTIONALITY
□ Can create project and auto-join as admin
□ Can drag issue to sprint (persists)
□ Can update issue (doesn't revert)
□ Token loads on refresh (no 401)
□ Team members can be added/removed

ERRORS
□ Invalid requests return clear error messages
□ Failed API calls show user-friendly toast
□ Server startup fails if JWT_SECRET missing
□ Database connection errors are logged
```

---

## 🎯 Deployment Commands (Correct Order)

```bash
# 1. Add rate limiting
npm install express-rate-limit

# 2. Fix token race condition (edit config.js)

# 3. Build & test
cd sprintify_backend/finalAPI
npm run build

cd ../../../sprintify_frontend
npm run build

# 4. Set environment variables
cp .env.example .env
# Edit .env with real values

# 5. Deploy!
NODE_ENV=production npm start
```

---

## ⚠️ If Issues Revert in Production

**Symptom:** Issue moves to sprint, then reverts to backlog

**Causes (in order):**
1. ❌ Token being sent wrong → token race condition
2. ❌ Wrong response structure → update not processed  
3. ❌ Network timeout → API didn't actually save
4. ❌ Database issue → update rolled back

**Debug:**
```javascript
// Run in browser console during drag
localStorage.getItem("spritify-auth-token") // Should exist
useAuthStore.getState().token // Should match
// Then check Network tab for Authorization header
```

---

## 📞 Quick Fixes for Common Issues

**"Not authorizedtoken not found"**
- Solution: Refresh page wait 2s, try again
- Root: Token race condition (fixed above)

**"CORS error"**
- Solution: Check FRONTEND_URL in backend .env
- Should match exactly: `https://yourdomain.com`

**"Drag issue doesn't work"**
- Solution: Check Network tab → Authorization header exists
- If missing: Token not loading (fix #2)

**"Can't add team members"**
- Solution: User must be MODERATOR+ role
- Check Team page for user's role

---

## 🧪 5-Minute Test Before Launch

```
1. Login ✅
2. Create project ✅
3. Create issue ✅
4. Drag to sprint ✅ (most important)
5. Refresh page ✅
6. Issue still in sprint ✅
7. Try 101 API calls → blocked ✅
8. Try accessing other project's issue → blocked ✅
```

**If all ✅, you're ready to go live!**

---

**Status:** 🟡 **PRODUCTION READY** (after critical fixes)

For full details, see [QA_REPORT.md](QA_REPORT.md)
