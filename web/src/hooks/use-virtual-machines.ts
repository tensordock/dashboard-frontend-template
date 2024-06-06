import { useCallback } from 'react';
import useSWR from 'swr';

import * as api from '../util/api';

export default function useVirtualMachines() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/v0/client/list',
    api.fetchVMList
  );

  const stopVM = useCallback(
    (machineId: string, releaseGPU: boolean) => {
      mutate(api.stopVM(machineId, releaseGPU).then(() => undefined));
    },
    [mutate]
  );

  const startVM = useCallback(
    (machineId: string) => mutate(api.startVM(machineId).then(() => undefined)),
    [mutate]
  );

  const deleteVM = useCallback(
    (machineId: string) =>
      mutate(api.deleteVM(machineId).then(() => undefined)),
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
