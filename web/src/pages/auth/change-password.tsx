import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import Button from '../../components/common/button';
import Head from '../../components/head';
import TextInput from '../../components/input/text-input';
import { ROUTES } from '../../constants/pages';
import { changePassword, passwordSchema } from '../../util/api/auth';

const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async ({
    password,
  }) => {
    const email = searchParams.get('email');
    if (!email || !token) {
      toast.error('Invalid link.');
      return;
    }

    const toastId = toast.loading('Changing password...');
    try {
      await changePassword(email, password, token);
      toast.success('Password changed successfully.', { id: toastId });
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
      <Head title="Change Password" />
      <h1 className="text-2xl font-medium font-display">Change Password</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
        Changing password for {searchParams.get('email')}
      </p>
      <form
        className="mb-2 mt-4 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          {...register('password')}
          type="password"
          label="New Password"
          errorMessage={errors.password?.message}
        />
        <TextInput
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          errorMessage={errors.confirmPassword?.message}
        />
        <Button type="submit" disabled={isSubmitting} className="mt-4 self-end">
          Change Password
        </Button>
      </form>
    </>
  );
}
