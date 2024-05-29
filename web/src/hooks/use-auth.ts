import useSWR, { useSWRConfig } from 'swr';

import axios from '../util/axios';

type LoginInfo = { email: string; org_name: string };

export default function useAuth() {
  const {
    data: loginInfo,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR('/api/v0/client/whitelabel/token_verify', async (url) => {
    if (!localStorage.getItem('whitelabelToken')) throw new Error('No token');
    return axios
      .post(`${import.meta.env.VITE_API_BASE_URL}${url}`)
      .then((res) => res.data as LoginInfo);
  });

  return { loginInfo, error, isLoading, isValidating, mutate };
}

export function useLogin() {
  const { mutate } = useSWRConfig();

  return (email: string, password: string) =>
    mutate('/api/v0/client/whitelabel/token_verify', async () => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      let res;
      try {
        res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/login`,
          formData
        );
      } catch (err) {
        throw new Error('Something went wrong');
      }

      const { token, success } = res.data as {
        token?: string;
        success: boolean;
      };
      if (!success) throw new Error('Incorrect username or password');

      localStorage.setItem('whitelabelToken', token!);
    });
}

export function useSignup() {
  const { mutate } = useSWRConfig();

  return (email: string, organization_name: string, password: string) =>
    mutate('/api/v0/client/whitelabel/token_verify', async () => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('organization_name', organization_name);
      formData.append('password', password);
      formData.append('confirm_password', password);

      const res = await axios.postForm(
        `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/register`,
        formData
      );
      const { token } = res.data as { token: string };
      localStorage.setItem('whitelabelToken', token);
    });
}

export function useLogout() {
  const { mutate } = useSWRConfig();

  return () => {
    mutate('/api/v0/client/whitelabel/token_verify', () => {
      localStorage.removeItem('whitelabelToken');
    });
  };
}
