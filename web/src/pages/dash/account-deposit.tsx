import { Link, useNavigate } from 'react-router-dom';
import { DashBlock } from '../../components/dash-block';
import DepositFundsForm from '../../components/forms/deposit-funds';
import { ROUTES } from '../../constants/pages';
import Head from '../../components/head';

export default function DepositFundsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Head title="Deposit Funds" />
      <Link
        to={ROUTES.account}
        className="inline-block pb-2 pt-4 text-sm text-gray-500 font-display dark:text-neutral-400"
      >
        <div className="i-tabler-arrow-left mr-1 h-[1ch] inline-flex items-center text-lg" />
        Back
      </Link>
      <DashBlock header="Deposit Funds">
        <div className="mt-4">
          <DepositFundsForm onSuccess={() => navigate(ROUTES.account)} />
        </div>
      </DashBlock>
    </>
  );
}
