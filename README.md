# JobTrack

A job application tracker built with Next.js that helps users organize and manage their job search in one place.

🔗 **Live App:** https://keepjobtrack.vercel.app

Built independently to put my frontend and Next.js skills into practice while gaining hands-on experience with authentication, databases, file storage, and production deployment.

## Features

- Google and GitHub authentication
- Add, edit, and delete job applications
- Track application status and dashboard statistics
- Search, filter, sort, and paginate applications
- Upload and manage a PDF CV for each application
- Private, authenticated CV storage
- Responsive and accessible interface

## Tech Stack

**Next.js 16 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Prisma 7 · PostgreSQL · Auth.js · Zod · Vercel Blob · Vitest**

## Running Locally

```bash
git clone https://github.com/AmityTobi/job-application-tracker.git
cd job-application-tracker
npm install
```

Create a `.env` file with the required database, OAuth, Auth.js, and Vercel Blob credentials.

Then:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Status

**JobTrack v1 is feature complete and deployed.**

## Author

**Amity Ekoyi**

[Portfolio](https://amitytobi.netlify.app/) · [GitHub](https://github.com/AmityTobi)
