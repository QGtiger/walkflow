import { AuthLoginLayout } from '@/Layouts/AuthLogin';
import { useOutlet, useParams } from 'react-router-dom';

export default () => {
  const outlet = useOutlet();

  return <AuthLoginLayout>{outlet}</AuthLoginLayout>;
};
