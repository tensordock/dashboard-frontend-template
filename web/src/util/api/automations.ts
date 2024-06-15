import { z } from 'zod';

import axios from '../axios';

export interface Automation {
  uuid: string;
  threshold: number;
  charge_amount: number;
  organization: string;
  payment_method: string;
  token_id: string;
  creation_time: string;
  note_private: string;
  action: 'email' | 'charge';
  message_target: string;
}

/**
 * Fetches the current organization's list of automations.
 */
export async function fetchAutomations() {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/customactions`,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true; custom_actions: Automation[] }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);

  return data.custom_actions;
}

const usdSchema = ({ min }: { min?: number } = {}) =>
  z
    .string()
    .transform((val) => parseFloat(val.replace(/[^0-9.-]/g, '')))
    .refine((val) => !isNaN(val), 'Amount must be a number')
    .transform((val) => val || 0)
    .refine(
      (val) => min === undefined || val >= min,
      `Must be at least $${min?.toFixed(2)}`
    )
    .transform((val) => val.toFixed(2));

/**
 * `zod` validation schema for adding a new automation.
 */
export const addAutomationSchema = z
  .object({
    threshold: usdSchema({ min: 1 }),
  })
  .and(
    z.discriminatedUnion('actionType', [
      z.object({
        actionType: z.literal('email'),
        emailTarget: z.string().email('Please enter a valid email'),
      }),
      z.object({
        actionType: z.literal('charge'),
        chargeAmount: usdSchema({ min: 5 }),
        chooseCard: z.string().min(1, 'Required'),
      }),
    ])
  );

/**
 * Adds a new automation to the organization.
 * Can be either an email alert or an automated charge.
 */
export async function addAutomation(
  values: z.infer<typeof addAutomationSchema>,
  validate?: boolean
) {
  if (validate) addAutomationSchema.parse(values);

  const formData = new FormData();
  formData.append('action', values.actionType);
  formData.append(
    'fundsThresholdAmount',
    parseFloat(values.threshold.replace(/[^0-9.-]/g, '')).toFixed(2)
  );

  if (values.actionType === 'email') {
    formData.append('emailInput', values.emailTarget);
  } else if (values.actionType === 'charge') {
    formData.append(
      'fundsChargeAmount',
      parseFloat(values.chargeAmount.replace(/[^0-9.-]/g, '')).toFixed(2)
    );
    formData.append('chooseCard', values.chooseCard);
  }

  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/customactions`,
    formData,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}

/**
 * Deletes an automation from the organization.
 */
export async function deleteAutomation(automationId: string) {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/customactions/${automationId}`,
    { validateStatus: (status) => status < 500 }
  );

  const data = res.data as
    | { success: true }
    | { success: false; error: string };

  if (!data.success) throw new Error(data.error);
}
