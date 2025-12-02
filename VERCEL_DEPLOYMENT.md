# Vercel Deployment Guide for Rakshith360

## ✅ Pre-Deployment Checklist

### Files Verified:
- ✅ `vercel.json` - Updated for Vite
- ✅ `package.json` - Has build script
- ✅ `vite.config.ts` - Properly configured
- ✅ `.gitignore` - Excludes .env and node_modules
- ✅ All dependencies listed in package.json

## 🚀 Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended for Non-Coders)

1. **Prepare Your Code:**
   - Make sure all your code is committed to Git
   - Push to GitHub, GitLab, or Bitbucket

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account

3. **Import Your Project:**
   - Click "Add New Project"
   - Select your repository
   - Vercel will auto-detect it's a Vite project

4. **Configure Environment Variables:**
   - In Project Settings → Environment Variables
   - Add these variables:
     ```
     VITE_GEMINI_API_KEY = AIzaSyB7UWwFttX-8_E_p3RhmL6bqle525fZKLY
     VITE_GEOAPIFY_API_KEY = 2b8e5b5d63744b3383ef4215ecb21ec7
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development**

5. **Build Settings (Auto-detected, but verify):**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live! 🎉

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   vercel env add VITE_GEOAPIFY_API_KEY
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 🔧 Important Configuration

### Environment Variables Required:
- `VITE_GEMINI_API_KEY` - Your Google Gemini API key
- `VITE_GEOAPIFY_API_KEY` - Your Geoapify API key

### Build Configuration:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x or higher (auto-detected)

## 📝 Post-Deployment

1. **Test Your Live Site:**
   - Visit your Vercel URL
   - Test all features:
     - Login/Register
     - Chat functionality
     - Dynamic questions
     - Hospital search
     - Medical summaries

2. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Monitor:**
   - Check Vercel dashboard for build logs
   - Monitor API usage in Google AI Studio
   - Check Geoapify dashboard for API usage

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Environment Variables Not Working:
- Make sure variables start with `VITE_`
- Redeploy after adding environment variables
- Check variable names match exactly

### API Errors:
- Verify API keys are correct
- Check API quotas/limits
- Ensure CORS is not blocking requests

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Your Current API Keys (Keep Secure!)

```
VITE_GEMINI_API_KEY=AIzaSyB7UWwFttX-8_E_p3RhmL6bqle525fZKLY
VITE_GEOAPIFY_API_KEY=2b8e5b5d63744b3383ef4215ecb21ec7
```

**⚠️ IMPORTANT:** Never commit these keys to Git! Always use Vercel's Environment Variables.


