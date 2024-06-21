import ButtonLink from '../../components/common/button-link';
import { DashBlock } from '../../components/dash-block';
import Head from '../../components/head';
import Loader from '../../components/loader';
import { ROUTES } from '../../constants/pages';
import useAutomations from '../../hooks/use-automations';

export default function AutomationsPage() {
  const { automations, error, isLoading, isValidating, deleteAutomation } =
    useAutomations();

  return (
    <>
      <Head title="Automations" />
      <DashBlock header="Manage Automations">
        <p className="mt-4 text-neutral-400 font-400">
          Automatically get an alert or recharge your account funds when your
          balance reaches a threshold.
        </p>
      </DashBlock>
      {automations && (
        <DashBlock>
          {automations.length > 0 ? (
            <>
              When my account reaches...
              <ul className="mt-6 space-y-4">
                {automations.map(
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
                        onClick={async () => deleteAutomation(uuid)}
                        disabled={isValidating}
                        className="i-tabler-trash ml-auto text-red-500 disabled:text-red-300"
                      >
                        <div className="sr-only">Delete Automation</div>
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
            <ButtonLink to={ROUTES.automationsAdd} variant="secondary">
              <div className="i-tabler-plus inline-block translate-y-[0.125em]" />{' '}
              Add Automation
            </ButtonLink>
          </div>
        </DashBlock>
      )}
      {isLoading && !error && (
        <DashBlock>
          <Loader />
        </DashBlock>
      )}
    </>
  );
}
