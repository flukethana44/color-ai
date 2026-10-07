# AI Color Guide

Next.js application for creating department-specific color visual guides with OpenAI Images.

## Local development

1. Copy `.env.example` to `.env` and set `MODELARK_API_KEY` for ModelArk, or select another `IMAGE_PROVIDER` and set its matching key.
2. Run `npm install`.
3. Run `npm run dev` and open `http://localhost:3000`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel. The framework is detected automatically as Next.js.
3. Add the selected provider's API key in **Project Settings → Environment Variables**. For ModelArk, set `IMAGE_PROVIDER=modelark` and add `MODELARK_API_KEY`. Optionally set `MODELARK_BASE_URL`, `MODELARK_IMAGE_MODEL`, and `MODELARK_IMAGE_SIZE`.
4. Deploy.

Do not commit `.env`; it is already ignored. The image endpoint is implemented at `app/api/generate-image/route.js`, so the API key remains server-side.
"# color-ai" 
"# color-ai" 
"# color-ai" 
