import useSWR from 'swr';

import axios from '../util/axios';

export default function useUserInfo() {
  const { data, error, isLoading, isValidating } = useSWR(
    '/api/vO/client/whitelabel/getUserInfo',
    async (url) => {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${url}`);
      return res.data as {
        balance: number;
        organization: string;
        email: string;
        uuid: string;
        organization_name: string;
        organization_type: string;
        members: string[];
      };
    }
  );

  return { info: data, error, isLoading, isValidating };
}
