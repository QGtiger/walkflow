import { getAccessToken } from '@/api';
import CustomLoading from '@/components/CustomLoading';
import { AuthLoginLayout } from '@/Layouts/AuthLogin';
import { useMount } from 'ahooks';

export default function AuthPage() {
  useMount(() => {
    window.open(`tourbitwebauth://auth?token=${getAccessToken()}`, '_self');
  });
  return (
    <AuthLoginLayout>
      <div className=" relative flex items-center justify-center h-[100vh]">
        <CustomLoading />
      </div>
    </AuthLoginLayout>
  );
}
