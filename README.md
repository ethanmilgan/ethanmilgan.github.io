# styleeditbyreena

Personal styling website and CMS for Style Edit by Reena. The app is built with Next.js, React, Tailwind CSS, MongoDB, PostgreSQL, and Vercel Analytics.

## Features

- Public pages for Home, About, Services, Contact, Login, Signup, and Account.
- Admin CMS for editing page text, page images, services/products, and uploaded images.
- MongoDB-backed content for services, page slides, uploaded image assets, and page copy.
- PostgreSQL-backed users, sessions, and account/order data.
- Admin-only CMS access.
- Vercel-ready dynamic Next.js deployment.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- MongoDB Atlas
- Neon/PostgreSQL
- Vercel Analytics

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
AUTH_SECRET=
MONGODB_URI=
MONGODB_DB=styleeditbyreena-prod
POSTGRES_URL=
```

Generate an `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Database Setup

Initialize PostgreSQL tables:

```bash
npm run db:init:postgres
```

Seed MongoDB with default services and homepage slides:

```bash
npm run db:seed:mongo
```

Create or update an admin account:

```bash
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="change-me" npm run user:create-admin
```

On Windows PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="change-me"
npm run user:create-admin
```

## CMS

The CMS is available at:

```text
/admin
```

Admins can edit:

- Page text and images
- Services
- Service images
- Uploaded image assets
- Featured service selection

Uploaded images are stored in MongoDB and served through:

```text
/api/assets/:id
```

## Routes

- `/` - Home
- `/about` - About Reena
- `/services` - Services
- `/services/[slug]` - Service detail
- `/contact` - Contact
- `/login` - Login
- `/signup` - Signup
- `/account` - Customer account
- `/admin` - Admin CMS

Legacy shop routes redirect:

- `/shop` -> `/services`
- `/shop/[slug]` -> `/services/[slug]`

## Scripts

```bash
npm run dev              # Start local Next.js dev server
npm run build            # Build production app
npm run start            # Start production Next.js server
npm run db:init:postgres # Create/update PostgreSQL tables
npm run db:seed:mongo    # Seed MongoDB content
npm run user:create-admin
npm run user:create-customer
```

## Deployment

This app requires a server runtime because it uses auth, admin APIs, MongoDB, PostgreSQL, and image upload routes. Deploy it to Vercel as a dynamic Next.js app.

Required Vercel environment variables:

```env
AUTH_SECRET=
MONGODB_URI=
MONGODB_DB=
POSTGRES_URL=
```

After adding or changing Vercel environment variables, redeploy the project.

For MongoDB Atlas, make sure Network Access allows Vercel to connect. On free/serverless Vercel deployments, this commonly means allowing:

```text
0.0.0.0/0
```

Use a strong MongoDB database password if allowing access from anywhere.

## Verification

Run:

```bash
npm run build
```

The build should complete successfully before deploying.
