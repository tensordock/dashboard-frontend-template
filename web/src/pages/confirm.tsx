import { useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '../constants/pages';
import axios from '../util/axios';

export default function ConfirmAccountPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const abortRef = useRef<AbortController | null>(null);

  if (!token) {
    navigate(ROUTES.account);
  }

  const confirmToken = useCallback(
    async (token: string, abort: AbortController) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v0/client/whitelabel/confirmEmail`,
        undefined,
        {
          params: {
            confirmToken: token,
            hostname: window.location.hostname,
          },
          signal: abort.signal,
          validateStatus: (status) => status < 500,
        }
      );

      const data = res.data as
        | { success: true }
        | { success: false; error: string };

      if (!data.success) {
        toast.error(data.error || 'An unknown error occurred.');
        navigate(ROUTES.home, { replace: true });
        return;
      }

      toast.success('Confirmed token');
      navigate(ROUTES.account, { replace: true });
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
    <div className="h-screen max-h-[600px] min-h-max flex flex-col items-center justify-center text-xl font-semibold font-display">
      Validating...
    </div>
  );
}
