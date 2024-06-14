import useSWR from 'swr';

import * as api from '../util/api';

export default function useHostnodes(
  params: Omit<api.FetchHostnodesParams, 'domain'>
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/v0/client/deploy/hostnodes`,
    () =>
      api.fetchHostnodeStock({
        ...params,
        domain: import.meta.env.VITE_WHITELABEL_CUSTOM_DOMAIN as string,
      }),
    { revalidateOnFocus: false }
  );

  return {
    hostnodes: data?.hostnodes,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}
