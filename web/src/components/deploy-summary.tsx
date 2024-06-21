import { z } from 'zod';
import * as api from '../util/api';
import * as constants from '../constants';

export default function DeploySummary({
  selectedGPU,
  specs,
  hostnodeInfo,
}: {
  selectedGPU: constants.GpuModel;
  specs: z.infer<typeof api.deploySchema>['specs'];
  hostnodeInfo: api.HostnodeEntry;
}) {
  const { cpuTotal, gpuTotal, ramTotal, storageTotal, total } =
    api.calculateVMPrice(
      {
        cpuPrice: hostnodeInfo.specs.cpu.price,
        gpuPrice: hostnodeInfo.specs.gpu[selectedGPU]?.price ?? 0,
        ramPrice: hostnodeInfo.specs.ram.price,
        storagePrice: hostnodeInfo.specs.storage.price,
      },
      specs
    );
  return (
    <>
      <p className="flex items-center">
        <span className="i-tabler-map-pin mr-2 inline-block" />
        {hostnodeInfo.location.city}, {hostnodeInfo.location.region},{' '}
        {hostnodeInfo.location.country}
      </p>
      <p className="mt-4 flex items-center">
        <span className="i-tabler-server mr-2 inline-block" />
        {specs.gpu_count}x {constants.GPU_INFO[specs.gpu_model].displayName}
        <span className="ml-auto tabular-nums">
          ${gpuTotal.toFixed(4)}
          /hr
        </span>
      </p>
      <p className="mt-2 flex items-center">
        <span className="i-tabler-stack-2 mr-2 inline-block" />
        {specs.ram} GB RAM
        <span className="ml-auto tabular-nums">${ramTotal.toFixed(4)}/hr</span>
      </p>
      <p className="mt-2 flex items-center">
        <span className="i-tabler-cpu mr-2 inline-block" />
        {specs.vcpu}x {hostnodeInfo.specs.cpu.type} vCPUs
        <span className="ml-auto tabular-nums">${cpuTotal.toFixed(4)}/hr</span>
      </p>
      <p className="mt-2 flex items-center">
        <span className="i-tabler-database mr-2 inline-block" />
        {specs.storage}GB NVMe SSD
        <span className="ml-auto tabular-nums">
          ${storageTotal.toFixed(4)}/hr
        </span>
      </p>

      <p className="mt-8 flex font-bold font-display">
        Running Cost
        <span className="ml-auto font-sans tabular-nums">
          ${total.toFixed(4)}/hr
        </span>
      </p>
      <p className="mt-1 text-sm text-neutral-400">
        Cost per hour when the VM is running.
      </p>
      <p className="mt-6 flex font-bold font-display">
        Stopped Cost
        <span className="ml-auto font-sans tabular-nums">
          ${storageTotal.toFixed(4)}/hr
        </span>
      </p>
      <p className="mt-1 text-sm text-neutral-400">
        Stopped VMs incur reduced storage fees, but the availability of GPUs on
        the same node is not guaranteed.
      </p>
    </>
  );
}
