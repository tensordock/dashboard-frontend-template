import { DashBlock } from '../../components/dash';
import Head from '../../components/head';
import useVirtualMachines from '../../hooks/use-virtual-machines';

export default function ListPage() {
  const { virtualmachines, startVM, stopVM, deleteVM } = useVirtualMachines();

  // console.log(virtualmachines);

  return (
    <>
      <Head title="Your Virtual Machines" />
      <DashBlock header="Your Virtual Machines">
        {/* TODO */}
        <p className="mt-4 text-gray-500 font-400">TODO</p>
      </DashBlock>
      {virtualmachines && (
        <DashBlock>
          {Object.entries(virtualmachines).map(([id, { name }]) => (
            <div key={id}>{name}</div>
          ))}
        </DashBlock>
      )}
    </>
  );
}
