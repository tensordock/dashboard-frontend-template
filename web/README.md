# TensorDock Storefront

This template uses TypeScript React in Vite with HMR and includes some ESLint rules.

## Tweaking Branding + Stock

There are a couple key places to modify across the template:

- `.env.production` and `.env.development` – set `VITE_WHITELABEL_SUBDOMAIN` to the subdomain you set in your storefront panel
- `src/constants/branding.ts` – add/remove GPUs you have in stock from `ALLOWED_GPUS`

And to update your branding:

- `src/constants/branding.ts` – be sure to update to match your branding
- `src/uno.config.ts` – feel free to tweak your branding to your needs. For different fonts, switch out `'Open Sans'` and `'Poppins'`. You can also update primary theme colors here.

## Deploying

Use `npm run build` to build a static export of the site in the `dist/` folder. This should be hosted at the domain you've set in your storefront panel.
