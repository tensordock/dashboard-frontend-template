import useSWR from 'swr';
import { FetchHostnodesParams, fetchHostnodeStock } from '../util/api/deploy';

export default function useHostnodes(
  params: Omit<FetchHostnodesParams, 'subdomain'>
) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [`/api/v0/client/deploy/hostnodes`, params],
    ([, p]: [string, Omit<FetchHostnodesParams, 'subdomain'>]) =>
      fetchHostnodeStock({
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
