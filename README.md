# Job Tracker

A small, focused job application tracker built with Next.js, to reinforce and apply what I learned in Stephen Grider's _Next JS: The Complete Developer's Guide_, this time without a course guiding the build.

This project is intentionally scoped small: one page, no unnecessary routes, built to be finished rather than to be impressive.

## Stack

- Next.js (App Router)
- TypeScript
- Prisma 7 + SQLite
- NextAuth (v5) with GitHub OAuth
- Tailwind CSS + shadcn/ui
- Zod for validation

## Planned Features (v1)

- Sign in with GitHub
- Add a job application (company, role, role description, link, date applied, status)
- View all applications in a list
- Update an application's status inline
- No separate routes for create/edit, both are modal-based on a single page

## Status

- ✅ Prisma schema designed and migrated (Application model + NextAuth-required models)
- 🔄 Setting up authentication
- ⏳ Building UI
- ⏳ Wiring server actions

## Notes

This README is updated as the project progresses, treat it as a running log of decisions, not just a final description.
