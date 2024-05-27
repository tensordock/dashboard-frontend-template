# TensorDock Whitelabel Template

## Deploying

Make sure to `npm install` in this folder. To update your whitelabel site, `npm run zip`. This will create `site.zip`, which you can upload to [dashboard.tensordock.com/organization/storefront/panel](https://dashboard.tensordock.com/organization/storefront/panel).

## Static pages

All remote info is dynamically fetched client-side. You can see a good example of this in `list.html`, line 272. All intended functionality per-page is already in our templates, so they are great for reference.

## Email templates

Since emails can't fetch data dynamically, we instead use templating. All emails have the following base template variables, which you probably won't need but are here just in case:

- `whitelabel_site`: Whitelabel hostname, i.e. `h100cloud.com`
- `org_title`: Organization name

Templating uses `{{ variablename }}` format.

### `confirmation_email.html`

This email is sent when a user signs up for a new account.

- `"{{ app_base_url }}/confirm/{{ token }}"` will be the account creation confirmation link.

### `deposit_confirmation_email.html`

This email is sent to confirm a deposit into an organization's balance.

- `${{ amount }}` is the deposit amount, i.e. `$20.24`

### MORE EMAILS COMING
