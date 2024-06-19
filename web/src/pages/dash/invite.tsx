import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import Head from '../../components/head';
import TextInput from '../../components/input/text-input';
import { ROUTES } from '../../constants/pages';
import * as api from '../../util/api';
import useAuth from '../../hooks/use-auth';

type InviteFormValues = z.infer<typeof api.inviteSchema>;

export default function InvitePage() {
    const { loginInfo } = useAuth();

    const {
        register,
        handleSubmit,
    formState: { isSubmitting, errors },
    } = useForm<InviteFormValues>({
        resolver: zodResolver(api.inviteSchema),
        defaultValues: { email: '' },
    });

    const onSubmit: SubmitHandler<InviteFormValues> = async ({email}) => {
        try {
            await api.invite(
                {email: email}, 
                {email: loginInfo?.loggedIn ? loginInfo.email : ""},
                loginInfo?.loggedIn ? loginInfo.org_name : "",
            );
        } catch (err) {
            if (err instanceof Error) toast.error(`${err.message}.`);
        }
    };

    return (
    <>
        <Head title="Invite" />
        <div className="flex items-center">
            <h1 className="text-2xl font-medium font-display">Invite A User</h1>
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
            <button
                type="submit"
                className="mt-2 inline-flex justify-center rounded bg-primary-500 py-3 text-white font-semibold font-display transition-colors disabled:cursor-default disabled:bg-primary-300 hover:bg-primary-600"
                disabled={isSubmitting}
            >
                Submit
            </button>
        </form>
    </>
    );
}