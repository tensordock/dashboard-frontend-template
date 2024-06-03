import { Link, useNavigate } from 'react-router-dom';
import { DashBlock } from '../../components/dash';
import DepositFundsForm from '../../components/forms/deposit-funds';
import { ROUTES } from '../../constants/pages';

export default function DepositFundsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Link
        to={ROUTES.account}
        className="inline-block pb-2 pt-4 text-sm text-gray-500 font-display"
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
