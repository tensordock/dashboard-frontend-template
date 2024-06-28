import { useCallback } from 'react';
import useSWR from 'swr';

import * as api from '../util/api';

const fetchAuth = () =>
  api.fetchAuth(import.meta.env.VITE_WHITELABEL_SUBDOMAIN);

export default function useAuth() {
  const {
    data: loginInfo,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR('/api/v0/client/whitelabel/token_verify', fetchAuth);

  const login = useCallback(
    (email: string, password: string) =>
      mutate(async () => {
        await api.login({ email, password });
        return fetchAuth();
      }),
    [mutate]
  );

  const signup = useCallback(
    (email: string, org_name: string, password: string, inviteUUID?: string) =>
      mutate(async () => {
        await api.signup({ email, org_name, password, inviteUUID });
        return fetchAuth();
      }),
    [mutate]
  );

  const logout = useCallback(
    () =>
      mutate(() => {
        api.logout();
        return fetchAuth();
      }),
    [mutate]
  );

  return { loginInfo, error, isLoading, isValidating, login, signup, logout };
}
