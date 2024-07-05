import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import TextInput from '../../components/input/text-input';
import * as api from '../../util/api';

const inviteSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

export default function InviteUserForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<InviteFormValues> = async ({ email }) => {
    const toastId = toast.loading('Sending invite...');
    try {
      await api.inviteUser(email);
      toast.success(`Successfully invited ${email}!`, { id: toastId });
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}.`, { id: toastId });
    }
  };

  return (
    <form
      className="mb-2 mt-4 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        {...register('email')}
        type="email"
        label="Email"
        placeholder="johnny@appleseed.com"
        errorMessage={errors.email?.message}
      />
      <button
        type="submit"
        className="min-w-max self-end rounded bg-primary-500 px-6 py-2 text-white font-semibold font-display transition-colors disabled:cursor-default disabled:bg-primary-300 hover:bg-primary-600 lg:px-16 md:px-12"
        disabled={isSubmitting}
      >
        Invite
      </button>
    </form>
  );
}
