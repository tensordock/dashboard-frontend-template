import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { z } from 'zod';

import {
  addAutomationSchema,
  addAutomation as apiAddAutomation,
  deleteAutomation as apiDeleteAutomation,
  fetchAutomations as apiFetchAutomations,
} from '../util/api/automations';

export default function useAutomations() {
  const {
    data: automations,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR('/api/v0/client/whitelabel/customactions', apiFetchAutomations);

  const sortedAutomations = useMemo(
    () => automations?.sort((a, b) => b.threshold - a.threshold),
    [automations]
  );

  const addAutomation = useCallback(
    (values: z.infer<typeof addAutomationSchema>) =>
      mutate(async () => {
        await apiAddAutomation(values);
        return apiFetchAutomations();
      }),
    [mutate]
  );

  const deleteAutomation = useCallback(
    async (automationId: string) =>
      mutate(async () => {
        await apiDeleteAutomation(automationId);
        return apiFetchAutomations();
      }),
    [mutate]
  );

  return {
    automations: sortedAutomations,
    error,
    isLoading,
    isValidating,
    addAutomation,
    deleteAutomation,
  };
}
