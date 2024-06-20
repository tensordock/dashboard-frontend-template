import toast from 'react-hot-toast';

import ButtonLink from '../../components/common/button-link';
import { DashBlock } from '../../components/dash-block';
import Head from '../../components/head';
import { SUPPORT_EMAIL } from '../../constants';
import { SHORT_COMPANY_NAME } from '../../constants/branding';
import { ROUTES } from '../../constants/pages';
import useUserInfo from '../../hooks/use-user-info';

export default function AccountPage() {
  const { info } = useUserInfo();

  const {
    balance,
    organization: organization_uuid,
    email,
    uuid: user_uuid,
    organization_name,
    organization_type,
  } = info ?? {};

  const formattedBalance =
    balance !== undefined ? `$${balance.toFixed(2)}` : undefined;

  return (
    <>
      <Head title="Account Settings" />
      <DashBlock header="Account Settings">
        <div className="mt-4 text-gray-500 font-400 dark:text-neutral-400">
          <p className="md:inline">Manage your {SHORT_COMPANY_NAME} account.</p>
          <ButtonLink
            to={`mailto:${SUPPORT_EMAIL}`}
            variant="secondary"
            scaleUp={false}
            className="md:ml-6"
          >
            Need help? Email support
          </ButtonLink>
        </div>
      </DashBlock>
      <DashBlock>
        <h3 className="text-xl font-display">Profile</h3>
        <ul className="grid mt-4 gap-x-4 gap-y-6 lg:grid-cols-2">
          {[
            { description: 'User ID', value: user_uuid },
            { description: 'Organization ID', value: organization_uuid },
            { description: 'Email', value: email },
            { description: 'Organization Name', value: organization_name },
            { description: 'Organization Type', value: organization_type },
            { description: 'Account Balance', value: formattedBalance },
          ].map(({ description, value }) => (
            <li key={description}>
              <label className="text-sm text-gray-500 font-400 tracking-wide font-display dark:text-neutral-400">
                {description}
              </label>
              <div className="mt-1 flex items-center rounded-input bg-gray-50/50 px-4 py-2 shadow-inner ring-1 ring-gray-200 dark:bg-neutral-800 dark:shadow-none dark:ring-none">
                {value ?? 'Loading...'}
                {value !== undefined && (
                  <button
                    className="i-tabler-copy ml-auto text-sm text-gray-400 transition-colors hover:text-gray-600"
                    onClick={() => {
                      navigator.clipboard.writeText(value.toString());
                      toast.success('Copied to clipboard!');
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <ButtonLink variant="secondary" to={ROUTES.accountDeposit}>
            Deposit Funds
          </ButtonLink>
        </div>
      </DashBlock>
    </>
  );
}
