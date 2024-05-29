import axios, { AxiosRequestHeaders } from 'axios';

/**
 * Automatically adds `whitelabelToken` to header and `subdomain` to FormData.
 */
export default axios.create({
  transformRequest: (data: object, headers: AxiosRequestHeaders) => {
    headers.Authorization = localStorage.getItem('whitelabelToken');
    if (data instanceof FormData) {
      data.append('subdomain', import.meta.env.VITE_WHITELABEL_SUBDOMAIN);
    }
    return data;
  },
  withCredentials: true,
});
