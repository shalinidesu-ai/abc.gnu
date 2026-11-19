# UniPulse frontend

React + Vite frontend for the public event API at `https://abc-gnu.onrender.com`.
There is no sign-in or authorization flow. Registration and ticket lookup use a
user UUID supplied by the visitor and saved in that browser's local storage.

## Run locally

```sh
npm install
npm run dev
```

Set `VITE_API_URL` in `.env.local` only if you want to use a different API URL.
The default is the deployed Render backend.

## Build

```sh
npm run build
```

## Deploy to Vercel

Import the repository and set the Vercel project **Root Directory** to `frontend`.
The included `vercel.json` sets the build command to `npm run build` and output
directory to `dist`. Set `VITE_API_URL` to `https://abc-gnu.onrender.com` in the
Vercel project environment variables if overriding the default.
