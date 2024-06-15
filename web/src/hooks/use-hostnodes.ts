import useSWR from 'swr';

import * as api from '../util/api';

export default function useHostnodes(
  params: Omit<api.FetchHostnodesParams, 'subdomain'>
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [`/api/v0/client/deploy/hostnodes`, params],
    ([, p]: [string, Omit<api.FetchHostnodesParams, 'subdomain'>]) =>
      api.fetchHostnodeStock({
        ...p,
        subdomain: import.meta.env.VITE_WHITELABEL_SUBDOMAIN as string,
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
