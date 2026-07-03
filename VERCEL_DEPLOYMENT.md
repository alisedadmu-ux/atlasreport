# Vercel Deployment Guide

## Problem
Your project is showing an error on Vercel because the Supabase environment variables are not configured in the Vercel environment.

## Solution
You need to add your Supabase credentials to Vercel's environment variables.

## Steps to Fix

### 1. Get Your Supabase Credentials

You already have some credentials in your `.env.local` file! Here's what you have and what you need:

**Already in your `.env.local`:**
- ✅ `NUXT_PUBLIC_SUPABASE_URL` = `https://yukkhwtdwnnozqdbyiux.supabase.co`
- ✅ `NUXT_PUBLIC_SUPABASE_KEY` = `sb_publishable_lEK89hvaPnjER8lpmDS-Uw_K1SkrqIB`
- ✅ `NUXT_RSS_SECRET` = `atlas-rss-secret`

**Missing (needs to be added):**
- ❌ `SUPABASE_SERVICE_ROLE_KEY` = currently set to `"your-service-role-key-here"`

### Where to Find the Service Role Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/_/settings/api
2. Look for the **API Settings** page
3. Scroll down to the **Service Role Key** section
4. Click **Reveal** or **Show** to see the key
5. Copy the key (it starts with `sb_secret_`)

**Important:** The Service Role Key is different from the Publishable Key:
- **Publishable Key** (anon key) - starts with `sb_publishable_` - safe to use in frontend
- **Service Role Key** (secret key) - starts with `sb_secret_` - **keep this secret!** Only use in backend/server code

### About the RSS Secret

The `NUXT_RSS_SECRET` is **NOT from Supabase** - it's a custom secret you (or the developer) created for your application.

**What it is:**
- A custom password/secret used to protect the RSS news fetch API endpoint
- Used in `server/api/fetch-news.ts` to authenticate requests
- Currently set to `atlas-rss-secret` in your `.env.local`

**Where it's used:**
- File: `server/api/fetch-news.ts` (line 35)
- Purpose: Prevents unauthorized access to the RSS fetch endpoint
- Used in Vercel Cron: `vercel.json` calls `/api/fetch-news?key=atlas-rss-secret`

**You can:**
1. Use the existing value: `atlas-rss-secret`
2. Create a new custom secret (recommended for production):
   - Generate a random string: `openssl rand -hex 32` or use an online generator
   - Update both `.env.local` and `vercel.json` with the new value

### Complete List of Required Keys

| Variable | Where to Find It | Your Current Value |
|----------|-----------------|-------------------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | `https://yukkhwtdwnnozqdbyiux.supabase.co` |
| `NUXT_PUBLIC_SUPABASE_KEY` | Supabase Dashboard → Settings → API → Publishable Key | `sb_publishable_lEK89hvaPnjER8lpmDS-Uw_K1SkrqIB` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → Service Role Key | **NEEDS TO BE ADDED** |
| `NUXT_RSS_SECRET` | Already in your `.env.local` | `atlas-rss-secret` |

### 2. Add Environment Variables to Vercel

Since you already have most of the values in your `.env.local`, you just need to:

1. Get the **Service Role Key** from Supabase (see step 1 above)
2. Add all 4 environment variables to Vercel (see instructions below)

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NUXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
| `NUXT_PUBLIC_SUPABASE_KEY` | Your Supabase Publishable Key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key | Production, Preview, Development |
| `NUXT_RSS_SECRET` | Your RSS secret key (e.g., `atlas-rss-secret`) | Production, Preview, Development |

4. Click **Save** for each variable
5. **Redeploy** your application for changes to take effect

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add NUXT_PUBLIC_SUPABASE_URL production
vercel env add NUXT_PUBLIC_SUPABASE_KEY production
vercel env env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NUXT_RSS_SECRET production

# Pull environment variables to your local project
vercel env pull .env.local

# Deploy
vercel --prod
```

### 3. Verify Deployment
After adding the environment variables and redeploying:
1. Check your Vercel deployment logs for any errors
2. Visit your deployed site to ensure it's working correctly
3. Test that Supabase features are functioning (authentication, database queries, etc.)

## Important Notes

- **Never commit `.env.local` to version control** - It's already in `.gitignore`
- **Use `.env.example` as a template** - This file shows what variables are needed
- **Environment variables are case-sensitive** - Make sure to use the exact names
- **Redeploy after adding variables** - Changes only take effect after redeployment

## Current Configuration

Your `nuxt.config.ts` is already configured to use these environment variables:
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NUXT_RSS_SECRET`

## Troubleshooting

If you still see errors after deployment:
1. Double-check that all environment variables are added in Vercel
2. Ensure the values are correct (no extra spaces or quotes)
3. Verify the variables are enabled for the correct environments (Production/Preview/Development)
4. Check Vercel deployment logs for specific error messages
5. Make sure your Supabase project is active and not paused

## Need Help?

- Vercel Docs: https://vercel.com/docs/environment-variables
- Supabase Docs: https://supabase.com/docs/guides/getting-started/tutorials/with-vercel