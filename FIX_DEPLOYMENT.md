# Fix Vercel Deployment Error

## Problem
You're getting this error during Vercel deployment:
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: nuxt@undefined
npm error Found: vite@7.3.5
npm error   peer vite@">=6.0" from @nuxt/devtools@3.2.4
```

This is a **dependency version conflict** issue, not related to environment variables.

## Root Cause
The project has incompatible dependency versions:
- `nuxt: ^4.4.6` 
- `@tailwindcss/vite: ^4.3.0` (requires newer Nuxt)
- `@nuxtjs/tailwindcss: ^6.14.0` (incompatible with Nuxt 4)

## Solution

### Option 1: Quick Fix (Recommended)

Update your `package.json` to use compatible versions:

```json
{
  "dependencies": {
    "@nuxtjs/supabase": "^2.0.9",
    "autoprefixer": "^10.5.0",
    "nuxt": "^4.4.6",
    "rss-parser": "^3.13.0",
    "vue": "^3.5.34",
    "vue-router": "^5.0.7"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.14.0",
    "@tailwindcss/postcss": "^4.3.0",
    "@tailwindcss/vite": "^4.3.0",
    "@types/node": "^20.19.0 || >=22.12.0",
    "tailwindcss": "^4.3.0"
  }
}
```

**Changes needed:**
1. Remove `nuxt-vercel-analytics` (not needed and may cause conflicts)
2. Keep the rest as-is

### Option 2: Clean Install

If Option 1 doesn't work, try a clean install:

```bash
# 1. Delete lock file and node_modules
rm -rf node_modules package-lock.json .nuxt .output

# 2. Clean npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Test locally
npm run build

# 5. Commit and push
git add .
git commit -m "fix: resolve dependency conflicts"
git push
```

### Option 3: Pin Specific Versions

If the issue persists, pin to specific working versions:

```json
{
  "dependencies": {
    "@nuxtjs/supabase": "2.0.9",
    "autoprefixer": "10.4.19",
    "nuxt": "4.4.6",
    "rss-parser": "3.13.0",
    "vue": "3.4.21",
    "vue-router": "4.3.2"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "6.12.1",
    "@tailwindcss/postcss": "4.0.0",
    "@tailwindcss/vite": "4.0.0",
    "@types/node": "20.11.0",
    "tailwindcss": "4.0.0"
  }
}
```

## Steps to Fix

1. **Update package.json** (use Option 1 above)
2. **Delete and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. **Test locally:**
   ```bash
   npm run build
   ```
4. **Commit and push:**
   ```bash
   git add package.json package-lock.json
   git commit -m "fix: resolve dependency version conflicts"
   git push
   ```
5. **Vercel will automatically redeploy**

## Alternative: Use Nuxt 3 Instead

If Nuxt 4 continues to cause issues, you can downgrade to Nuxt 3:

```json
{
  "dependencies": {
    "@nuxtjs/supabase": "^2.0.9",
    "autoprefixer": "^10.5.0",
    "nuxt": "^3.13.0",
    "rss-parser": "^3.13.0",
    "vue": "^3.4.21",
    "vue-router": "^4.3.2"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.1",
    "@types/node": "^20.11.0",
    "tailwindcss": "^3.4.1"
  }
}
```

Then update `nuxt.config.ts` to remove Vite plugin (Nuxt 3 uses different config):
```typescript
export default defineNuxtConfig({
  css: ['~/app.css'],
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NUXT_PUBLIC_SUPABASE_URL,
        key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
        redirect: false
      }
    }
  }
})
```

## Verify the Fix

After redeploying, check:
1. Build logs show "Installing dependencies..." without errors
2. Build completes successfully
3. Site loads without errors

## Need More Help?

Share the full build log from Vercel if the error persists.