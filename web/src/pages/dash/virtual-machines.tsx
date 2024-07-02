import { Link } from 'react-router-dom';
import { DashBlock } from '../../components/dash-block';
import Head from '../../components/head';
import VirtualMachinePanel from '../../components/virtual-machine-panel';
import useVirtualMachines from '../../hooks/use-virtual-machines';
import { ROUTES } from '../../constants/pages';
import Loader from '../../components/loader';

export default function VirtualMachinesPage() {
  const { virtualmachines, error, isLoading } = useVirtualMachines();

  const virtualMachineEntries = Object.entries(virtualmachines ?? {});

  return (
    <>
      <Head title="Your Virtual Machines" />
      <DashBlock header="Your Virtual Machines">
        <p className="mt-4 text-gray-500 font-400 dark:text-neutral-400">
          You can deploy a new virtual machine{' '}
          <Link
            to={ROUTES.deployForm}
            className="underline hover:text-gray-700"
          >
            here
          </Link>
          .
        </p>
        <p className="mt-2 text-gray-500 font-400 dark:text-neutral-400">
          If you release a VM's associated resources, you will only have to pay
          for{' '}
          <strong className="text-gray-800 font-medium dark:text-neutral-200">
            storage costs
          </strong>
          .
        </p>
      </DashBlock>
      {virtualMachineEntries.length > 0 && (
        <ul className="flex flex-col gap-4">
          {virtualMachineEntries.map(([id, vm]) => (
            <VirtualMachinePanel key={id} vm={{ ...vm, id }} />
          ))}
        </ul>
      )}
      {!error && !isLoading && virtualMachineEntries.length === 0 && (
        <DashBlock>
          <div className="h-40 flex flex-col items-center justify-center">
            <div className="i-tabler-zoom-exclamation mb-4 text-4xl" />
            No virtual machines registered.
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
