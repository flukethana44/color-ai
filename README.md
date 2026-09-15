# AI Color Guide

Next.js application for creating department-specific color visual guides with OpenAI Images.

## Local development

1. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel. The framework is detected automatically as Next.js.
3. Add `OPENAI_API_KEY` in **Project Settings → Environment Variables**. Optionally set `IMAGE_MODEL` and `IMAGE_SIZE`.
4. Deploy.

Do not commit `.env`; it is already ignored. The image endpoint is implemented at `app/api/generate-image/route.js`, so the API key remains server-side.
"# color-ai" 
"# color-ai" 
"# color-ai" 
