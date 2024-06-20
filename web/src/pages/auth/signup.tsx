import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import Button from '../../components/common/button';
import Head from '../../components/head';
import TextInput from '../../components/input/text-input';
import { ROUTES } from '../../constants/pages';
import useAuth from '../../hooks/use-auth';
import * as api from '../../util/api';

const signupSchema = api.signupSchema
  .and(
    z.object({
      confirm_password: z.string().min(1, 'Please confirm your password'),
    })
  )
  .refine(({ password, confirm_password }) => password === confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
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
      toast.success('Check your email to verify your account!');
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}.`);
    }
  };

  return (
    <>
      <Head title="Sign Up" />
      <div className="flex items-center">
        <h1 className="text-2xl font-medium font-display">Sign Up</h1>
        <div className="ml-auto text-sm text-gray-500 dark:text-neutral-400">
          Already joined?{' '}
          <Link
            to={ROUTES.login}
            replace
            className="text-primary-500 font-medium dark:text-primary-300"
          >
            Log In
          </Link>
        </div>
      </div>
      <form
        className="mb-2 mt-4 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          {...register('email')}
          label="Email"
          placeholder="johnny@appleseed.com"
          errorMessage={errors.email?.message}
        />
        <TextInput
          {...register('org_name')}
          label="Organization Name"
          placeholder="JohnML LLC"
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
        <Button type="submit" disabled={isSubmitting} className="mt-4 self-end">
          Submit
        </Button>
      </form>
    </>
  );
}
