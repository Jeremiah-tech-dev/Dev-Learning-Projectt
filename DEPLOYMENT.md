# Vercel Deployment Guide

## Deploy Backend (Flask API)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Backend Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `server` folder as root directory
   - Framework Preset: Other

3. **Configure Backend**
   - Root Directory: `server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `pip install -r requirements.txt`

4. **Add Environment Variables**
   ```
   SECRET_KEY=your-random-secret-key-here
   JWT_SECRET_KEY=your-random-jwt-secret-here
   GOOGLE_CLIENT_ID=547695762624-llaksg97e6n0gbutf03judckpppi3rho.apps.googleusercontent.com
   DATABASE_URL=sqlite:///lms.db
   ```

5. **Deploy**
   - Click "Deploy"
   - Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

---

## Deploy Frontend (React App)

1. **Import Frontend Project**
   - Click "Add New" → "Project"
   - Import the same GitHub repository
   - Select the `client` folder as root directory
   - Framework Preset: Create React App

2. **Configure Frontend**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Add Environment Variables**
   ```
   REACT_APP_GOOGLE_CLIENT_ID=547695762624-llaksg97e6n0gbutf03judckpppi3rho.apps.googleusercontent.com
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```
   ⚠️ Replace `your-backend.vercel.app` with your actual backend URL from step 1

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-frontend.vercel.app`

---

## Update Google OAuth Settings

After deployment, update your Google Cloud Console:

1. Go to https://console.cloud.google.com
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `https://your-frontend.vercel.app`
   - `https://your-backend.vercel.app`
5. Add to **Authorized redirect URIs**:
   - `https://your-frontend.vercel.app`

---

## Update Backend CORS

After getting your frontend URL, update `server/app.py`:

```python
CORS(app, resources={r"/api/*": {"origins": ["https://your-frontend.vercel.app"]}})
```

Then commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Vercel will automatically redeploy.

---

## Troubleshooting

### Backend Issues
- Check Vercel logs for errors
- Ensure all environment variables are set
- Verify `vercel.json` is in the server folder

### Frontend Issues
- Ensure `REACT_APP_API_URL` points to backend
- Check browser console for CORS errors
- Verify Google OAuth credentials

### Database
- For production, consider using PostgreSQL (Neon, Supabase)
- SQLite works but has limitations on Vercel

---

## Quick Deploy Commands

```bash
# Commit changes
git add .
git commit -m "Prepare for deployment"
git push

# Vercel will auto-deploy on push
```

---

## Test Your Deployment

1. Visit your frontend URL
2. Try registering a new account
3. Test Google OAuth login
4. Browse courses
5. Test enrollment

---

## Production Database (Optional)

For a production database, use PostgreSQL:

1. **Create Database** (e.g., on Neon.tech or Supabase)
2. **Update Backend Environment Variable**:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
3. **Update requirements.txt**:
   ```
   psycopg2-binary==2.9.9
   ```
4. **Commit and push**

---

## Success! 🎉

Your DevLearn LMS is now live on Vercel!
