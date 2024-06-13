const fs = require('fs');
const archiver = require('archiver-promise');

const emailTemplates = [
  'account_confirmation',
  'deposit_confirmation',
  'account_low_balance_3',
  'account_low_balance_5',
  'account_low_balance_custom',
  'auto_charge',
  'auto_charge_failed',
  'alert_servers_stopped',
  'alert_servers_deleted',
  'forgot_password',
];

async function main() {
  // Verify we have all required email templates
  console.log('Checking for required email templates...\n');

  emailTemplates.forEach(async (template) => {
    if (fs.existsSync(`./content/email/${template}.html`)) {
      console.log(`✅ Found ${template}.html`);
    } else {
      console.log(
        `❌ Missing ${template}.html - please add it to the email folder!`
      );
      process.exit(1);
    }
  });

  console.log('\nAll required email templates found!');

  // Zip `content` folder
  console.log('\nCreating a new ZIP file...');

  const archive = archiver('site.zip', { zlib: { level: 9 } });
  archive.directory('content/', false);

  await archive.finalize();
  console.log('🎉 ZIP file "site.zip" created successfully!');
}

main();
