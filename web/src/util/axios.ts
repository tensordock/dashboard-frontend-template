import axios, { AxiosRequestHeaders } from 'axios';

/**
 * Automatically adds `whitelabelToken` to header and `subdomain` to FormData.
 */
export default axios.create({
  transformRequest: (data: object, headers: AxiosRequestHeaders) => {
    const token = localStorage.getItem('whitelabelToken');
    if (token) headers.Authorization = token;
    if (data instanceof FormData) {
      data.append('subdomain', import.meta.env.VITE_WHITELABEL_SUBDOMAIN);
    }
    return data;
  },
  withCredentials: true,
});
