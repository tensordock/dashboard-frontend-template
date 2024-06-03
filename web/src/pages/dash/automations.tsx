import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import { DashBlock } from '../../components/dash';
import { ROUTES } from '../../constants/pages';
import axios from '../../util/axios';
import fetcher from '../../util/fetcher';

export default function AutomationsPage() {
  const { data, isValidating, mutate } = useSWR(
    '/api/v0/client/whitelabel/customactions',
    fetcher<{
      custom_actions: {
        uuid: string;
        threshold: number;
        charge_amount: number;
        organization: string;
        payment_method: string;
        token_id: string;
        creation_time: string;
        note_private: string;
        action: 'email' | 'charge';
        message_target: string;
      }[];
    }>
  );

  const sortedActions = useMemo(
    () => data?.custom_actions.sort((a, b) => b.threshold - a.threshold),
    [data]
  );

  return (
    <>
      <DashBlock header="Manage Automations">
        <p className="mt-4 text-gray-500 font-400">
          Automatically get an alert or recharge your account funds when your
          balance reaches a threshold.
        </p>
      </DashBlock>
      {sortedActions && (
        <DashBlock>
          {sortedActions.length > 0 ? (
            <>
              When my account reaches...
              <ul className="mt-6 space-y-4">
                {sortedActions.map(
                  ({ threshold, action, message_target, uuid }) => (
                    <li key={uuid} className="flex">
                      <div>
                        <div
                          className={`mr-4 text-gray-400 inline-flex text-sm ${
                            {
                              email: 'i-tabler-bell',
                              charge: 'i-tabler-currency-dollar',
                            }[action]
                          }`}
                        />
                        <span className="font-semibold font-display">
                          ${threshold}
                        </span>
                        : <span>{action} </span>
                        {action === 'email' && (
                          <>
                            <span>{message_target}</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await axios.delete(
                            `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/customactions/${uuid}`
                          );
                          mutate();
                        }}
                        disabled={isValidating}
                        className="i-tabler-trash ml-auto text-red-500 disabled:text-red-300"
                      >
                        <div className="sr-only">button</div>
                      </button>
                    </li>
                  )
                )}
              </ul>
            </>
          ) : (
            <div className="max-w-prose">
              No custom actions found.{' '}
              <strong>
                We recommend creating an alert to ensure you don't run out of
                funds and lose data!
              </strong>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-4">
            <Link
              to={ROUTES.automationsAdd}
              className="flex items-center gap-2 rounded px-5 py-2 text-primary-500 font-display shadow-md ring-1 ring-gray-200"
            >
              <div className="i-tabler-plus" /> Add Automation
            </Link>
          </div>
        </DashBlock>
      )}
    </>
  );
}
