import { useNavigate } from 'react-router-dom';
import ProductLogo from '../ProductLogo';

export default function CustomHeader(props: { rightContent?: React.ReactNode; leftContent?: React.ReactNode }) {
  const { rightContent, leftContent } = props;
  const nav = useNavigate();
  return (
    <header className="bg-white border-b border-solid border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div onClick={() => nav('/')} className="cursor-pointer">
          <ProductLogo />
        </div>
        {leftContent || <h1 className="text-xl font-semibold text-walkflow-darktext">Walkflows</h1>}
      </div>
      <div>{rightContent}</div>
    </header>
  );
}
