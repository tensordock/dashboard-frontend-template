import { useCallback } from 'react';
import useSWR from 'swr';

import * as api from '../util/api';

export default function useVirtualMachines() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/v0/client/list',
    api.fetchVMList,
    { refreshInterval: 2000 }
  );

  const stopVM = useCallback(
    async (machineId: string, releaseGPU: boolean) =>
      mutate(async () => {
        await api.stopVM(machineId, releaseGPU);
        return api.fetchVMList();
      }),
    [mutate]
  );

  const startVM = useCallback(
    async (machineId: string) =>
      mutate(async () => {
        await api.startVM(machineId);
        return api.fetchVMList();
      }),
    [mutate]
  );

  const deleteVM = useCallback(
    async (machineId: string) =>
      mutate(async () => {
        await api.deleteVM(machineId);
        return api.fetchVMList();
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
