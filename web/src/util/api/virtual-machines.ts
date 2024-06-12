import axios from '../axios';

export interface VirtualMachineEntry {
  status: string;
  cost: number;
  location: string;
  specs: {
    gpu: {
      type?: string;
      amount: number;
    };
    vcpus: string;
    ram: string;
    storage: string;
  };
  type: string;
  port_forwards: Record<string, string>;
  timestamp_creation: string;
  name: string;
  operating_system: string;
  hostnode: string;
  hostname: string;
  compute_price: string;
  storage_price: string;
  total_price: string;
  default_user: string;
  country: string;
  state: string;
  city: string;
  cpu_threadscount: string;
  ip_address?: string;
  dedicated_ip_address?: string;
}

export async function fetchVMList() {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/list`,
    undefined,
    { validateStatus: (status) => status < 500 }
  );
  const data = res.data as
    | {
        success: true;
        virtualmachines: Record<string, VirtualMachineEntry>;
      }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
  else return data.virtualmachines;
}

export async function stopVM(machineId: string, releaseGPU: boolean) {
  const formData = new FormData();
  formData.append('server', machineId);
  formData.append('disassociate_resources', releaseGPU ? 'true' : 'false');

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/stop/single`,
    formData
  );
  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

export async function startVM(machineId: string) {
  const formData = new FormData();
  formData.append('server', machineId);

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/start/single`,
    formData
  );
  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

export async function deleteVM(machineId: string) {
  const formData = new FormData();
  formData.append('server', machineId);

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/delete/single`,
    formData
  );
  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}
