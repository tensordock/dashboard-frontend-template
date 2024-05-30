import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import TextInput from '../../components/input/text-input';
import Head from '../../components/head';
import { useSignup } from '../../hooks/use-auth';
import { ROUTES } from '../../constants/pages';

const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email(),
    org_name: z
      .string()
      .trim()
      .min(1, 'Organization name is required')
      .min(3, 'Organization name must be at least 3 characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(4, 'Password must be at least 4 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const signup = useSignup();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', org_name: '', password: '' },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async ({
    email,
    org_name,
    password,
  }) => {
    try {
      await signup(email, org_name, password);
      navigate(ROUTES.account, { replace: true });
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}.`);
    }
  };

  return (
    <>
      <Head title="Sign Up" />
      <div className="flex items-center">
        <h1 className="text-2xl font-medium font-display">Sign Up</h1>
        <div className="ml-auto text-sm text-gray-500">
          Already joined?{' '}
          <Link
            to={ROUTES.login}
            replace
            className="text-primary-500 font-medium"
          >
            Log In
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
          {...register('org_name')}
          label="Organization Name"
          placeholder="John's Hosting LLC"
          errorMessage={errors.org_name?.message}
        />
        <TextInput
          {...register('password')}
          type="password"
          label="Password"
          placeholder="••••••••"
          errorMessage={errors.password?.message}
        />
        <TextInput
          {...register('confirm_password')}
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          errorMessage={errors.confirm_password?.message}
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
