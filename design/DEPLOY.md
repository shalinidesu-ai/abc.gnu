# Deploy the frontend to Vercel

This is a static HTML/CSS/JavaScript site and does not need a build command.

## Vercel dashboard

1. Import this repository into Vercel.
2. Set **Root Directory** to `design`.
3. Select **Other** as the framework preset and leave the build command blank.
4. Deploy. Vercel serves `index.html` from this directory.

## Vercel CLI

From the repository root, run:

```sh
cd design
vercel
```

The frontend calls `https://abc-gnu.onrender.com`. The backend must be running and permit cross-origin requests from the Vercel site.
