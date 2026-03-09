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
│  │  │  ├─ analysis
│  │  │  │  └─ run
│  │  │  │     └─ route.ts
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
│  │  ├─ analysis
│  │  │  └─ domain
│  │  │     ├─ analysis-result.types.ts
│  │  │     ├─ analysis.document.ts
│  │  │     ├─ analysis.processor.service.ts
│  │  │     ├─ analysis.queue.service.ts
│  │  │     ├─ analysis.repository.ts
│  │  │     └─ analysis.service.ts
│  │  ├─ auth
│  │  │  ├─ domain
│  │  │  │  ├─ auth.config.ts
│  │  │  │  ├─ auth.ts
│  │  │  │  └─ auth.types.ts
│  │  │  └─ ui
│  │  │     ├─ components
│  │  │     │  └─ GoogleSignInButton.tsx
│  │  │     └─ session-provider.tsx
│  │  ├─ job-description
│  │  │  ├─ domain
│  │  │  │  ├─ job-description.collection.ts
│  │  │  │  ├─ job-description.document.ts
│  │  │  │  ├─ job-description.mapper.ts
│  │  │  │  ├─ job-description.repository.ts
│  │  │  │  └─ job-description.service.ts
│  │  │  ├─ job-description.types.ts
│  │  │  ├─ job-description.validators.ts
│  │  │  └─ ui
│  │  │     ├─ components
│  │  │     │  ├─ CreateJobDescription.tsx
│  │  │     │  ├─ EditJobDescription.tsx
│  │  │     │  └─ ListJobDescription.tsx
│  │  │     └─ hooks
│  │  └─ resume
│  │     ├─ api
│  │     │  └─ resume.api.ts
│  │     ├─ domain
│  │     │  ├─ resume.model.ts
│  │     │  ├─ resume.repository.ts
│  │     │  └─ resume.service.ts
│  │     ├─ processing
│  │     │  ├─ resume.downloader.ts
│  │     │  └─ resume.parser.ts
│  │     ├─ resume.types.ts
│  │     └─ ui
│  │        ├─ components
│  │        │  ├─ ListJobResume.tsx
│  │        │  └─ ResumeUploadForm.tsx
│  │        ├─ hooks
│  │        │  └─ useResumeUpload.ts
│  │        └─ sample-data.ts
│  ├─ lib
│  │  ├─ api
│  │  │  └─ axios.ts
│  │  ├─ db
│  │  │  └─ mongodb.ts
│  │  ├─ env.ts
│  │  ├─ gcp
│  │  │  ├─ gcp.storage.service.ts
│  │  │  └─ storage.ts
│  │  ├─ llm
│  │  │  ├─ llm.connection.ts
│  │  │  └─ llm.constants.ts
│  │  ├─ queue
│  │  │  ├─ analysis.job.types.ts
│  │  │  └─ analysis.queue.ts
│  │  ├─ redis
│  │  │  └─ redis.connection.ts
│  │  └─ utils
│  │     ├─ cn.ts
│  │     └─ encryption.ts
│  ├─ middleware.ts
│  ├─ types
│  │  ├─ next-auth.d.ts
│  │  └─ paginated-response.d.ts
│  └─ workers
│     └─ analysis.worker.ts
├─ tailwind.config.ts
├─ tsconfig.json
└─ tsconfig.worker.json

```