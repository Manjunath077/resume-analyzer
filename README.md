This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

```
resume-analyzer
├─ components.json
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ logo.png
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  ├─ analyse
│  │  │  │  └─ route.ts
│  │  │  ├─ analysis
│  │  │  │  ├─ run
│  │  │  │  └─ status
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  ├─ health
│  │  │  │  └─ route.ts
│  │  │  ├─ job-description
│  │  │  │  └─ user
│  │  │  │     └─ [userId]
│  │  │  │        ├─ job
│  │  │  │        │  └─ [jobId]
│  │  │  │        │     └─ route.ts
│  │  │  │        └─ route.ts
│  │  │  └─ resumes
│  │  │     ├─ metadata
│  │  │     │  └─ route.ts
│  │  │     └─ upload-url
│  │  │        └─ route.ts
│  │  ├─ dashboard
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ resumes
│  │  │     └─ [id]
│  │  │        └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ Navbar.tsx
│  │  ├─ ResumeUploadForm.tsx
│  │  └─ ui
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ progress.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ skeleton.tsx
│  │     └─ table.tsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ auth.config.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ auth.types.ts
│  │  │  └─ components
│  │  │     └─ GoogleSignInButton.tsx
│  │  ├─ job-description
│  │  │  ├─ components
│  │  │  │  ├─ CreateJobDescription.tsx
│  │  │  │  ├─ EditJobDescription.tsx
│  │  │  │  └─ ListJobDescription.tsx
│  │  │  ├─ job-description.mapper.ts
│  │  │  ├─ job-description.repository.ts
│  │  │  └─ job-description.service.ts
│  │  └─ resumes
│  │     └─ JobResumesPage.tsx
│  ├─ hooks
│  │  └─ useResumeUpload.ts
│  ├─ lib
│  │  ├─ api
│  │  │  ├─ axios.ts
│  │  │  └─ resume.api.ts
│  │  ├─ db
│  │  │  ├─ job-description.collection.ts
│  │  │  ├─ job-description.document.ts
│  │  │  └─ resume.repository.ts
│  │  ├─ gcp
│  │  │  └─ storage.ts
│  │  ├─ llm
│  │  │  ├─ llm.connection.ts
│  │  │  └─ llm.constants.ts
│  │  ├─ mongodb.ts
│  │  ├─ queue
│  │  ├─ utils
│  │  │  └─ encryption.ts
│  │  └─ utils.ts
│  ├─ middleware.ts
│  ├─ mocks
│  │  └─ sample-data.ts
│  ├─ models
│  │  └─ resume.model.ts
│  ├─ providers
│  │  └─ session-provider.tsx
│  ├─ services
│  │  ├─ llm.services.ts
│  │  └─ resume.service.ts
│  ├─ types
│  │  ├─ analysis-result.d.ts
│  │  ├─ jod-description.d.ts
│  │  ├─ next-auth.d.ts
│  │  ├─ paginated-response.d.ts
│  │  └─ resume.d.ts
│  └─ validators
│     └─ job-description.validators.ts
├─ tailwind.config.ts
└─ tsconfig.json

```