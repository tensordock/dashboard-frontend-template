import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import Button from '../../components/common/button';
import Head from '../../components/head';
import TextInput from '../../components/input/text-input';
import { ROUTES } from '../../constants/pages';
import * as api from '../../util/api';

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<ResetPasswordInput> = async ({ email }) => {
    const toastId = toast.loading('Sending reset email...');
    try {
      await api.resetPassword(email);
      toast.success(
        'Reset email sent. Check your inbox for further instructions.',
        { id: toastId }
      );
      navigate(ROUTES.login, { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? `${err.message}.` : 'An unknown error occurred',
        { id: toastId }
      );
    }
  };

  return (
    <>
      <Head title="Log In" />
      <div className="flex items-center">
        <h1 className="text-2xl font-medium font-display">Reset Password</h1>
        <div className="ml-auto text-sm">
          <Link
            to={ROUTES.signup}
            replace
            className="text-primary-500 font-medium"
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
          type="email"
          placeholder="john@appleseed.com"
          label="Registered Email"
          errorMessage={errors.email?.message}
        />
        <Button type="submit" disabled={isSubmitting} className="mt-4 self-end">
          Send Reset Email
        </Button>
      </form>
    </>
  );
}
