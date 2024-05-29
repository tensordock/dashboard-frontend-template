import { Link } from 'react-router-dom';
import { DashBlock } from '../../components/dash';
import useSWR from 'swr';
import axios from '../../util/axios';

export default function AccountPage() {
  const { data } = useSWR(
    '/api/vO/client/whitelabel/getUserInfo',
    async (url) => {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${url}`);
      return res.data as {
        balance: number;
        organization: string;
        email: string;
        uuid: string;
        organization_name: string;
        organization_type: string;
        members: string[];
      };
    }
  );

  const {
    balance,
    organization: organization_uuid,
    email,
    uuid: user_uuid,
    organization_name,
    organization_type,
  } = data ?? {};

  const formattedBalance =
    balance !== undefined ? `$${balance.toFixed(2)}` : undefined;

  return (
    <>
      <DashBlock header="Account Settings">
        <p className="mt-4 text-gray-500 font-400">
          <div className="md:inline">Manage your H100cloud account.</div>
          {/* TODO: make this variable */}
          <Link
            to={`mailto:support@tensordock.com`}
            className="mt-2 inline-block select-none rounded px-3 py-1 text-blue-500 font-300 font-display ring-1 ring-gray-300 md:ml-4 md:mt-0"
          >
            Need help? Email support
          </Link>
        </p>
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
              <label className="text-sm text-neutral-500 font-400 tracking-wide font-display">
                {description}
              </label>
              <div className="mt-1 flex items-center rounded bg-neutral-50/50 px-4 py-2 shadow-inner ring-1 ring-neutral-200">
                {value ?? 'Loading...'}
                {value !== undefined && (
                  <button
                    className="i-tabler-copy ml-auto text-sm text-neutral-400 transition-colors hover:text-neutral-600"
                    onClick={() =>
                      navigator.clipboard.writeText(value.toString())
                    }
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <button className="ml-auto mt-6 rounded px-5 py-2 text-blue-500 font-display shadow-md ring-1 ring-neutral-200">
          Deposit Funds
        </button>
      </DashBlock>
    </>
  );
}
