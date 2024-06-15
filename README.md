# TensorDock Whitelabel Template

## Updating content

Make sure to `npm install` in this folder. To update your whitelabel site, `npm run zip`. This will create `site.zip`, which you can upload to [dashboard.tensordock.com/organization/storefront/panel](https://dashboard.tensordock.com/organization/storefront/panel).

## React SPA Template

The `web` folder is a single-page React application. See the inner [README](./web/README.md) for more details.

This should be hosted at the domain you've set in your organization storefront dashboard.

## Email templates

Since emails can't fetch data dynamically, we instead use templating. All emails have the following base template variables, which you probably won't need but are here just in case:

- `whitelabel_site`: Whitelabel hostname, i.e. `gpufleet.com`
- `org_title`: Organization name

Templating uses `{{ variablename }}` format.

### `account_confirmation.html`

This email is sent when a user signs up for a new account.

- `"{{ app_base_url }}/confirm/{{ token }}"` will be the account creation confirmation link.

### `deposit_confirmation.html`

This email is sent to confirm a deposit into an organization's balance.

- `${{ amount }}` is the deposit amount, i.e. `$20.24`

### `account_low_balance_3.html`

Sent to notify a user that their balance is below $3.

### `account_low_balance_5.html`

Sent to notify a user that their balance is below $10.

### `account_low_balance_custom.html`

Sent when a user has set up a custom action to notify them of their balance being below a custom threshold.

- `${{ threshold }}` is the threshold they've set.

### `auto_charge`

Sent when an automated charge is made based on low threshold (user-configured).

- `{{ card_last4 }}`: Last 4 digits of card used for auto payment.
- `${{ charge }}`: Amount charged.
- `${{ threshold }}`: Threshold for auto charge set by user.

### `auto_charge_failed`

Sent when an automated charge based on low threshold fails (user-configured).

- `${{ charge }}`: Amount that would have been charged.
- `${{ threshold }}`: Threshold for auto charge set by user.

### `alert_servers_stopped`

Sent when an org's balance hits $1, and their servers are stopped.

- `${{ balance }}`: Organization's current balance

### `alert_servers_deleted`

Sent when an org's balance is negative, and their servers are deleted.

- `${{ balance }}`: Organization's current balance

### `forgot_password`

Sent when a user requests to reset their password.

- `{{ link }}`: link to reset password
