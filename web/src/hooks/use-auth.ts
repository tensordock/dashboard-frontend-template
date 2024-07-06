import { useCallback } from 'react';
import useSWR from 'swr';

import {
  fetchAuth as apiFetchAuth,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
} from '../util/api/auth';

const fetchAuth = () => apiFetchAuth(import.meta.env.VITE_WHITELABEL_SUBDOMAIN);

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
        await apiLogin({ email, password });
        return fetchAuth();
      }),
    [mutate]
  );

  const signup = useCallback(
    (email: string, org_name: string, password: string, inviteUUID?: string) =>
      mutate(async () => {
        await apiSignup({ email, org_name, password, inviteUUID });
        return fetchAuth();
      }),
    [mutate]
  );

  const logout = useCallback(
    () =>
      mutate(() => {
        apiLogout();
        return fetchAuth();
      }),
    [mutate]
  );

  return { loginInfo, error, isLoading, isValidating, login, signup, logout };
}
