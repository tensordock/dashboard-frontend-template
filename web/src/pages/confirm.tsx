import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '../constants/pages';
import * as api from '../util/api';

export default function ConfirmAccountPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const abortRef = useRef<AbortController | null>(null);

  if (!token) {
    navigate(ROUTES.account);
  }

  const confirmToken = useCallback(
    async (token: string, abort: AbortController) => {
      try {
        await api.confirmToken(token, { abortSignal: abort.signal });
        toast.success('Confirmed token');
        navigate(ROUTES.login, { replace: true });
      } catch (err) {
        toast.error(
          (err instanceof Error && err.message) || 'An unknown error occurred.'
        );
        navigate(ROUTES.home, { replace: true });
        return;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.home, { replace: true });
      return;
    }

    abortRef.current = new AbortController();
    confirmToken(token, abortRef.current);

    return () => {
      abortRef.current?.abort();
    };
  }, [token, confirmToken, navigate]);

  return (
    <div className="h-screen max-h-[600px] min-h-max flex flex-col items-center justify-center text-xl font-semibold font-display dark:text-white">
      Validating...
    </div>
  );
}
