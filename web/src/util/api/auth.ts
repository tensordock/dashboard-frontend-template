import { z } from 'zod';

import axios from '../axios';

/**
 * Fetches the current user's authentication status. Uses localStorage to store the token.
 */
export async function fetchAuth(subdomain: string) {
  if (!localStorage.getItem('whitelabelToken'))
    return { loggedIn: false as const, detail: 'Not logged in' };

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/token_verify`,
    undefined,
    { params: { subdomain }, validateStatus: (status) => status < 500 }
  );

  if (res.status !== 200)
    return { loggedIn: false as const, detail: res.data.error as string };

  return {
    loggedIn: true as const,
    ...(res.data as {
      email: string;
      org_name: string;
    }),
  };
}

/**
 * `zod` validation schema for user login form.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Logs the user in and stores the token in localStorage.
 */
export async function login(
  values: z.infer<typeof loginSchema>,
  validate?: boolean
) {
  if (validate) loginSchema.parse(values);

  const formData = new FormData();
  formData.append('email', values.email);
  formData.append('password', values.password);

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/login`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true; token: string }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);

  localStorage.setItem('whitelabelToken', data.token);
}

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(4, 'Password must be at least 4 characters');

/**
 * `zod` validation schema for user signup form.
 */
export const signupSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  org_name: z
    .string()
    .trim()
    .min(1, 'Organization name is required')
    .min(3, 'Organization name must be at least 3 characters'),
  password: passwordSchema,
});

/**
 * Signs the user up and stores the token in localStorage.
 * To confirm their email, the user will also need to `confirmToken` with the token sent to their email.
 */
export async function signup(
  values: z.infer<typeof signupSchema>,
  validate?: boolean
) {
  if (validate) signupSchema.parse(values);

  const formData = new FormData();
  formData.append('email', values.email);
  formData.append('organization_name', values.org_name);
  formData.append('password', values.password);
  formData.append('confirm_password', values.password);

  const res = await axios.postForm(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/register`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true; token: string }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);

  localStorage.setItem('whitelabelToken', data.token);
}

/**
 * Confirms the user's email with the token sent to their email.
 */
export async function confirmToken(
  token: string,
  { abortSignal }: { abortSignal?: AbortSignal } = {}
) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/confirmEmail`,
    undefined,
    {
      params: {
        confirmToken: token,
        hostname: window.location.hostname,
      },
      signal: abortSignal,
      validateStatus: (status) => status < 500,
    }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

/**
 * Logs the user out by removing the token from localStorage.
 */
export function logout() {
  localStorage.removeItem('whitelabelToken');
}

/**
 * Requests an email with a password reset link.
 */
export async function resetPassword(email: string, validate?: boolean) {
  if (validate) z.string().email().parse(email);

  const formData = new FormData();
  formData.append('email', email);

  const res = await axios.postForm(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/reset_password`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

const changePasswordSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export async function changePassword(
  email: string,
  password: string,
  token: string,
  validate?: boolean
) {
  if (validate) changePasswordSchema.parse({ email, password });

  const formData = new FormData();
  formData.append('password', password);

  const res = await axios.postForm(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/change_password/${token}`,
    formData,
    { validateStatus: (status) => status < 500, params: { email } }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

/**
 * Attempts to send an invite email to a new user by email
 */
export async function inviteUser(receiverEmail: string, validate?: boolean) {
  if (validate) z.string().parse(receiverEmail);

  const formData = new FormData();
  formData.append('receiver', receiverEmail);

  const res = await axios.postForm(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/invite`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}
