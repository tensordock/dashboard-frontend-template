import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
        <div className="mt-4 text-gray-500 font-400">
          <p className="md:inline">Manage your {SHORT_COMPANY_NAME} account.</p>
          <Link
            to={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-block select-none rounded px-3 py-1 text-primary-500 font-300 font-display ring-1 ring-gray-300 md:ml-4 md:mt-0"
          >
            Need help? Email support
          </Link>
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
              <label className="text-sm text-gray-500 font-400 tracking-wide font-display">
                {description}
              </label>
              <div className="mt-1 flex items-center rounded bg-gray-50/50 px-4 py-2 shadow-inner ring-1 ring-gray-200">
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
          <Link
            className="rounded px-5 py-2 text-primary-500 font-display shadow-md ring-1 ring-gray-200"
            to={ROUTES.accountDeposit}
          >
            Deposit Funds
          </Link>
          {/* <button
            className="rounded px-5 py-2 text-primary-500 font-display shadow-md ring-1 ring-gray-200"
            onClick={() => setMode('customaction')}
          >
            Add Custom Action
          </button> */}
        </div>
      </DashBlock>
    </>
  );
}
