import { useMemo } from 'react';
import useSWR from 'swr';

import {
  fetchHostnodeStock,
  generateDeployConfigurations,
  getDisplayConfigurations,
} from '../util/api';

const stockRequestParams = {
  minGPUCount: 1,
  minRAM: 64,
  minvCPUs: 16,
  minStorage: 600,
  minVRAM: 80,
  requiresRTX: false,
  domain: 'h100cloud.com',
};

export default function useDeployConfigurations() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/v0/client/deploy/hostnodes`,
    () => fetchHostnodeStock(stockRequestParams),
    { revalidateOnFocus: false }
  );

  const configurations = useMemo(() => {
    const hostnodes = data?.hostnodes;
    if (!hostnodes) return undefined;

    return getDisplayConfigurations(generateDeployConfigurations(hostnodes));
  }, [data]);

  return { configurations, error, isLoading, isValidating, mutate };
}
