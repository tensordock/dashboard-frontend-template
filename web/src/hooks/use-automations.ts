import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { z } from 'zod';

import * as api from '../util/api';

export default function useAutomations() {
  const {
    data: automations,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR('/api/v0/client/whitelabel/customactions', api.fetchAutomations);

  const sortedAutomations = useMemo(
    () => automations?.sort((a, b) => b.threshold - a.threshold),
    [automations]
  );

  const addAutomation = useCallback(
    (values: z.infer<typeof api.addAutomationSchema>) =>
      mutate(async () => {
        await api.addAutomation(values);
        return api.fetchAutomations();
      }),
    [mutate]
  );

  const deleteAutomation = useCallback(
    async (automationId: string) =>
      mutate(async () => {
        await api.deleteAutomation(automationId);
        return api.fetchAutomations();
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
