This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the install:

```bash
pnpm install
```

## Adding the env credentials

```bash
DATABASE_URL= #Your PostgreSQL connection string (e.g., postgresql://username:password@localhost:5432/database_name)
```

```bash
BETTER_AUTH_SECRET= #Your Better Auth Secret
BETTER_AUTH_URL=http://localhost:3000 #Your Base URL of your app
```

```bash
GOOGLE_CLIENT_ID= #Your Google Client ID
GOOGLE_CLIENT_SECRET= #Your Google Client Secret
```

```bash
GITHUB_CLIENT_ID= #Your Github Client ID
GITHUB_CLIENT_SECRET= #Your Github Client Secret
```

```bash
RESEND_API_KEY= #Your Resend API Key
```

## Running the Better auth cli to get our schema for drizzle

It will generate a auth-schema.ts that we need to copy to the drizzle schema

```bash
    npx @better-auth/cli generate
```

We need to copy the content of the auth-schema to the drizzle schema in the db folder.

## Pushing the schema to the PostgreSQL database

first we need to generate the schema

```bash
    npx db:generate
```

after that we need to push it to our PostgreSQL database

```bash
    npx db:push
```

## Starting the application

Now if we have done everything correct we can visit it on localhost:3000

```bash
pnpm run dev
```
