import axios from './axios';

/**
 * For use with SWR, simple GET routes
 */
export default async function fetcher<T extends { [key: string]: unknown }>(
  path: string
) {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    validateStatus: (status) => status < 500,
  });
  const data = res.data as
    | ({ success: true } & T)
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
  else return data;
}
