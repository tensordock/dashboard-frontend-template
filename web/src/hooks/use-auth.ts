import { useCallback } from 'react';
import useSWR from 'swr';

import * as api from '../util/api';

export default function useAuth() {
  const {
    data: loginInfo,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR('/api/v0/client/whitelabel/token_verify', () =>
    api.fetchAuth(import.meta.env.VITE_WHITELABEL_SUBDOMAIN)
  );

  const login = useCallback(
    (email: string, password: string) =>
      mutate(api.login({ email, password }).then(() => undefined)),
    [mutate]
  );

  const signup = useCallback(
    (email: string, org_name: string, password: string, org_uuid?: string) =>
      mutate(api.signup({ email, org_name, password }, org_uuid ?? "").then(() => undefined)),
    [mutate]
  );

  const logout = useCallback(
    () =>
      mutate(() => {
        api.logout();
        return undefined;
      }),
    [mutate]
  );

  return { loginInfo, error, isLoading, isValidating, login, signup, logout };
}
