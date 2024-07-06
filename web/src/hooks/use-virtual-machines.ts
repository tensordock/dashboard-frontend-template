import { useCallback } from 'react';
import useSWR from 'swr';

import {
  deleteVM as apiDeleteVM,
  startVM as apiStartVM,
  stopVM as apiStopVM,
  fetchVMList,
} from '../util/api/virtual-machines';

export default function useVirtualMachines() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/v0/client/list',
    fetchVMList,
    { refreshInterval: 2000 }
  );

  const stopVM = useCallback(
    (machineId: string, releaseGPU: boolean) =>
      mutate(async () => {
        await apiStopVM(machineId, releaseGPU);
        return fetchVMList();
      }),
    [mutate]
  );

  const startVM = useCallback(
    (machineId: string) =>
      mutate(async () => {
        await apiStartVM(machineId);
        return fetchVMList();
      }),
    [mutate]
  );

  const deleteVM = useCallback(
    (machineId: string) =>
      mutate(async () => {
        await apiDeleteVM(machineId);
        return fetchVMList();
      }),
    [mutate]
  );

  return {
    virtualmachines: data,
    error,
    isLoading,
    isValidating,
    stopVM,
    startVM,
    deleteVM,
  };
}
