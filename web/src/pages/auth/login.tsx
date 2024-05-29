import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useLogin } from '../../hooks/use-auth';
import { ROUTES } from '../router';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ email, password }) => {
    const toastId = toast.loading('Logging in...');
    try {
      await login(email, password);
      toast.success('Logged in!', { id: toastId });
      navigate(ROUTES.account, { replace: true });
    } catch (err) {
      toast.error('Failed to login.', { id: toastId });
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form>
        <input {...register('email')} />
        <input {...register('password')} />
        <button onClick={handleSubmit(onSubmit)}>Submit</button>
      </form>
    </>
  );
}
