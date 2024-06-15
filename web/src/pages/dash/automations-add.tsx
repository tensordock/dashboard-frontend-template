import { Link, useNavigate } from 'react-router-dom';

import { DashBlock } from '../../components/dash-block';
import AddAutomationForm from '../../components/forms/add-automation';
import Head from '../../components/head';
import { ROUTES } from '../../constants/pages';

export default function AddAutomationPage() {
  const navigate = useNavigate();

  return (
    <>
      <Head title="Add Automation" />
      <Link
        to={ROUTES.automations}
        className="inline-block pb-2 pt-4 text-sm text-gray-500 font-display"
      >
        <div className="i-tabler-arrow-left mr-1 h-[1ch] inline-flex items-center text-lg" />
        Back
      </Link>
      <DashBlock header="Add Automation">
        <div className="mt-4">
          <AddAutomationForm onSuccess={() => navigate(ROUTES.automations)} />
        </div>
      </DashBlock>
    </>
  );
}
