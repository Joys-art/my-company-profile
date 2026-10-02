This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Admin dashboard

The admin dashboard is available at `/admin`. Before using it, configure these
server-side environment variables in the local environment and in the hosting
provider:

- `ADMIN_PASSWORD`: a strong, unique admin password with at least 16 characters.
- `ADMIN_SESSION_SECRET`: a random secret with at least 32 characters, used to
  sign the HTTP-only admin session cookie.
- `DATABASE_URL`: the Supabase transaction-mode pooler URL for application
  queries.
- `DIRECT_URL`: the Supabase session-mode pooler URL for Prisma schema changes.

Restart the application after changing environment variables. The dashboard
manages site settings, navigation, services, portfolio projects, testimonials,
and contact form messages.

For local setup, copy `.env.example` to `.env.local` and fill in all four
values. For production, set them in the hosting provider's environment-variable
settings; do not upload `.env.local`.

Get the PostgreSQL URLs from the Supabase project's **Connect** dialog. Replace
`[YOUR-PASSWORD]` locally with the database password, then add the URLs to the
root `.env.local` file. Do not commit or share `.env.local`. Before running
`npx prisma db push` against a database that already has data, verify its
contents and make a backup.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
