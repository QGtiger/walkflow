import { CheckCircleOutlined, PlayCircleOutlined, AppstoreOutlined, CompassOutlined } from '@ant-design/icons';

import ZiyuUrl from './assets/ziyu.jpeg';
import { createNotification } from '@/utils/customNotification';
import ProductLogo from '@/components/ProductLogo';

const ProductFeatures = () => {
  const features = [
    '无代码制作互动式产品演示',
    '通过 Chrome 扩展快速录制演示',
    '支持市场营销、销售和客户成功团队',
    '比视频更具互动性和参与度',
    '简易更新和维护',
    '用户行为数据分析',
  ];

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        {/* <div className="bg-gradient-to-r from-primary to-purple-400 p-3 rounded-xl flex items-center justify-center">
          <CompassOutlined className="text-primary-foreground text-2xl" />
        </div> */}
        <ProductLogo classNames="w-12 h-12" />
        <h2 className="text-2xl font-bold text-slate-900">Walkflow</h2>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">交互式产品演示工具</h1>
        <p className="text-lg sm:text-xl text-slate-600">Walkflow = Walkthrough + Workflow</p>
        <p className="text-slate-600">让产品演示不只是停留在无聊的观看，而是充满互动的体验</p>
      </div>

      <div className="bg-gradient-to-r from-primary/30 to-purple-200 p-6 rounded-xl">
        <p className="text-slate-800 italic">
          "Walkflow 帮助我们将产品演示转变为互动式体验，客户参与度提升了50%，销售转化率显著增加。"
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-primary"
            style={{
              background: `url(${ZiyuUrl}) no-repeat center center / cover`,
            }}
          ></div>
          <div>
            <p className="font-medium text-slate-900">子鱼</p>
            <p className="text-sm text-slate-600">某科技公司 产品总监</p>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCircleOutlined className="text-green-500 text-lg" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pt-2 flex space-x-3">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1">
          <PlayCircleOutlined className="text-blue-700 mr-1" />
          <span className="text-xs font-medium text-blue-700">7 天免费试用</span>
        </div>
        <div
          className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 cursor-pointer"
          onClick={() => {
            createNotification({
              message: '在线演示',
              description: '请访问 https://walkflow.io 进行在线演示',
              placement: 'bottomRight',
            });
          }}
        >
          <AppstoreOutlined className="text-green-700 mr-1" />
          <span className="text-xs font-medium text-green-700">在线演示</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
