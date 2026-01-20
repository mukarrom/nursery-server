# Vercel Deployment Guide

## Prerequisites

- ✅ Vercel account (sign up at <https://vercel.com>)
- ✅ Vercel CLI installed globally
- ✅ Environment variables ready

## Step 1: Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

## Step 3: Deploy to Vercel

### First-time deployment

```bash
vercel
```

When prompted:

- **Set up and deploy?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No
- **Project name?** → Press Enter (or type custom name)
- **Directory?** → Press Enter (current directory)
- **Override settings?** → No

This will create a preview deployment.

### Deploy to Production

```bash
vercel --prod
```

## Step 4: Configure Environment Variables

You need to add your environment variables to Vercel. You can do this in two ways:

### Option A: Using Vercel CLI

```bash
vercel env add DATABASE_URL
# Paste your MongoDB connection string when prompted
# Select Production, Preview, Development (use spacebar to select all)

vercel env add JWT_SECRET
# Paste your JWT secret

vercel env add JWT_EXPIRES_IN
# Type: 7d

vercel env add CLOUDINARY_CLOUD_NAME
# Paste your Cloudinary cloud name

vercel env add CLOUDINARY_API_KEY
# Paste your Cloudinary API key

vercel env add CLOUDINARY_API_SECRET
# Paste your Cloudinary API secret

vercel env add EMAIL_HOST
# Your email host (e.g., smtp.gmail.com)

vercel env add EMAIL_PORT
# Email port (e.g., 587)

vercel env add EMAIL_USER
# Your email username

vercel env add EMAIL_PASS
# Your email password

vercel env add EMAIL_FROM
# Your email sender address

vercel env add CLIENT_URL
# Your frontend URL (for email links)

vercel env add NODE_ENV
# Type: production
```

### Option B: Using Vercel Dashboard

1. Go to <https://vercel.com/dashboard>
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the appropriate values
5. Select environments (Production, Preview, Development)

## Step 5: Redeploy with Environment Variables

After adding environment variables:

```bash
vercel --prod
```

## Step 6: Verify Deployment

Your API will be available at:

```
https://your-project-name.vercel.app
```

Test your endpoints:

```
https://your-project-name.vercel.app/api/v1/auth/sign-up
https://your-project-name.vercel.app/api/v1/products
https://your-project-name.vercel.app/api/v1/categories
```

## Required Environment Variables

Make sure all these are set in Vercel:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=5000
```

## Useful Vercel Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Pull environment variables to local
vercel env pull

# Link local project to Vercel project
vercel link

# Open project in Vercel dashboard
vercel dashboard
```

## Continuous Deployment (Optional)

### Connect to GitHub for Auto-Deploy

1. Push your code to GitHub:

   ```bash
   git push origin dev
   git checkout main
   git merge dev
   git push origin main
   ```

2. In Vercel Dashboard:
   - Go to your project
   - Click **Settings** → **Git**
   - Click **Connect Git Repository**
   - Select your GitHub repository
   - Configure:
     - **Production Branch**: `main`
     - **Preview Branches**: `dev` and others

Now every push to `main` will trigger a production deployment, and pushes to `dev` will create preview deployments!

## Troubleshooting

### Build Fails

- Check Vercel logs: `vercel logs`
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Verify `vercel-build` script runs locally: `npm run vercel-build`

### Runtime Errors

- Check environment variables are set correctly
- Verify MongoDB connection string includes network access from anywhere (0.0.0.0/0)
- Check function timeout limits (Vercel has a 10s limit on Hobby plan)

### CORS Issues

- Update CORS origin in your Express app to include Vercel domain
- Check `src/app.ts` CORS configuration

### MongoDB Connection Issues

- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Or add Vercel's IP ranges
- Ensure connection string is correct

## Performance Tips

1. **Use MongoDB Atlas** (not local MongoDB)
2. **Enable connection pooling** in Mongoose
3. **Add database indexes** for frequently queried fields
4. **Optimize images** before uploading to Cloudinary
5. **Use Vercel Edge Network** for static assets

## Cost Considerations

- **Hobby Plan** (Free):
  - 100 GB bandwidth/month
  - Serverless function execution: 100 GB-Hrs
  - 10 second max function duration

- **Pro Plan** ($20/month):
  - 1 TB bandwidth/month
  - 1,000 GB-Hrs function execution
  - 60 second max function duration

## Next Steps After Deployment

1. ✅ Update Postman baseUrl to Vercel URL
2. ✅ Update Flutter app API endpoint
3. ✅ Configure custom domain (optional)
4. ✅ Set up monitoring and analytics
5. ✅ Enable Vercel Analytics
6. ✅ Set up error tracking (Sentry, etc.)

## Support

- Vercel Docs: <https://vercel.com/docs>
- Vercel Community: <https://github.com/vercel/vercel/discussions>
- Vercel Support: <https://vercel.com/support>

---

**Your deployment is ready! 🚀**

Run `vercel --prod` to deploy to production now!
