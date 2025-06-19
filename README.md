# Pr-Sismakel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## Authentication

- Uses **JWT Bearer Token** for authentication.
- Token is set as a **httpOnly cookie** after login for browser security.
- All protected API endpoints accept token from either:
  - `Authorization: Bearer <token>` header (for Swagger UI, Postman, curl, etc)
  - or from `accessToken` httpOnly cookie (for browser/client-side fetch).

### Endpoints

| Method | Endpoint                | Description                                 |
|--------|-------------------------|---------------------------------------------|
| POST   | `/api/auth/login`       | Login, set JWT as httpOnly cookie           |
| POST   | `/api/auth/token`       | Generate JWT Bearer token (no cookie)       |
| GET    | `/api/auth/me`          | Get current user info (from JWT)            |
| POST   | `/api/auth/logout`      | Logout, clear cookie                        |

See [README_SWAGGER_AUTH.md](./README_SWAGGER_AUTH.md) for Swagger UI usage and more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
