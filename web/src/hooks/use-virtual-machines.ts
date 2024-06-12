import { useCallback } from 'react';
import useSWR from 'swr';

import * as api from '../util/api';

export default function useVirtualMachines() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/v0/client/list',
    api.fetchVMList
  );

  const stopVM = useCallback(
    async (machineId: string, releaseGPU: boolean) => {
      await api.stopVM(machineId, releaseGPU);
      return mutate();
    },
    [mutate]
  );

  const startVM = useCallback(
    async (machineId: string) => {
      await api.startVM(machineId);
      return mutate();
    },
    [mutate]
  );

  const deleteVM = useCallback(
    async (machineId: string) => {
      await api.deleteVM(machineId);
      return mutate();
    },
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
