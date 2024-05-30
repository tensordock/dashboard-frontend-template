import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import { SHORT_COMPANY_NAME } from '../../constants/branding';
import axios from '../../util/axios';
import { useState } from 'react';
import DepositFundsForm from '../../components/forms/deposit-funds';
import { AnimatePresence, motion } from 'framer-motion';

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

  const [mode, setMode] = useState<'none' | 'deposit' | 'customaction'>('none');

  return (
    <>
      <Head title="Account Settings" />
      <DashBlock header="Account Settings">
        <div className="mt-4 text-gray-500 font-400">
          <p className="md:inline">Manage your {SHORT_COMPANY_NAME} account.</p>
          {/* TODO: make this variable */}
          <Link
            to={`mailto:support@tensordock.com`}
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
          <button
            className="rounded px-5 py-2 text-primary-500 font-display shadow-md ring-1 ring-gray-200"
            onClick={() => setMode('deposit')}
          >
            Deposit Funds
          </button>
          <button
            className="rounded px-5 py-2 text-primary-500 font-display shadow-md ring-1 ring-gray-200"
            onClick={() => setMode('customaction')}
          >
            Add Custom Action
          </button>
        </div>
      </DashBlock>
      <AnimatePresence mode="wait">
        {mode === 'deposit' && (
          <motion.div
            key="deposit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ease: 'easeInOut' }}
          >
            <DashBlock header="Deposit Funds">
              <div className="mt-4">
                <DepositFundsForm />
              </div>
            </DashBlock>
          </motion.div>
        )}
        {mode === 'customaction' && (
          <motion.div
            key="customaction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ease: 'easeInOut' }}
          >
            <DashBlock header="Add Custom Action">
              <div className="mt-4">
                <DepositFundsForm />
              </div>
            </DashBlock>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
