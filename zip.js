const fs = require('fs');
const archiver = require('archiver-promise');

async function main() {
  // Verify we have all required email templates
  console.log('Checking for required email templates...\n');

  const emailTemplates = ['confirmation_email', 'deposit_confirmation_email'];
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
