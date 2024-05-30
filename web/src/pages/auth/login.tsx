import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import TextInput from '../../components/input/text-input';
import Head from '../../components/head';
import { useLogin } from '../../hooks/use-auth';
import { ROUTES } from '../../constants/pages';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async ({
    email,
    password,
  }) => {
    try {
      await login(email, password);
      navigate(ROUTES.account, { replace: true });
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}.`);
    }
  };

  return (
    <>
      <Head title="Log In" />
      <div className="flex items-center">
        <h1 className="text-2xl font-medium font-display">Login</h1>
        <div className="ml-auto text-sm text-gray-500">
          New user?{' '}
          <Link
            to={ROUTES.signup}
            replace
            className="text-primary-500 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <form className="mb-2 mt-4 flex flex-col gap-4">
        <TextInput
          {...register('email')}
          label="Email"
          placeholder="johnny@appleseed.com"
          errorMessage={errors.email?.message}
        />
        <TextInput
          {...register('password')}
          type="password"
          label="Password"
          placeholder="••••••••"
          errorMessage={errors.password?.message}
        />
        <button
          onClick={handleSubmit(onSubmit)}
          className="mt-6 inline-flex justify-center rounded bg-primary-500 py-3 text-white font-semibold font-display transition-colors disabled:cursor-default disabled:bg-primary-300 hover:bg-primary-600"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </>
  );
}
