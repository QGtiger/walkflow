import { walkflowRequest } from '@/api/walkflowApi';
import CustomHeader from '@/components/CustomHeader';
import CustomLoading from '@/components/CustomLoading';
import PreviewCard from '@/components/PreviewCard';
import { useRequest } from 'ahooks';
import { useParams } from 'react-router-dom';

export default function Share() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useRequest(() => {
    return walkflowRequest<WalkflowDetail>({
      url: '/openapi/detail/' + id,
      method: 'GET',
    });
  });

  console.log('data', data);

  return (
    <div className="flex flex-col h-screen">
      <CustomHeader />
      <main className="flex-1 flex items-center justify-center">
        {loading || !data?.data?.schema ? (
          <CustomLoading />
        ) : (
          <div className="w-[80%]">
            <PreviewCard schema={data?.data?.schema} />
          </div>
        )}
      </main>
    </div>
  );
}
