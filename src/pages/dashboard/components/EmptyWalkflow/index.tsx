import ProductLogo from '@/components/ProductLogo';
import {
  PictureOutlined,
  PlayCircleOutlined,
  RightOutlined,
  SettingOutlined,
  StarOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Card, Select, Switch, Typography } from 'antd';
import { useState } from 'react';
const { Title, Text } = Typography;

export default function EmptyWalkflow() {
  const [activeTab, setActiveTab] = useState<string>('interactive');

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 p-6 rounded-3xl bg-white/80 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Left side - Onboarding */}
      <div className="flex-1 p-4">
        <Title level={1} className="text-5xl font-bold mb-12">
          Let's create your first Walkflow!
        </Title>

        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-lg font-medium">
              1
            </div>
            <Text className="text-xl">打开你的任意网站</Text>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-lg font-medium">
              2
            </div>
            <div className="flex items-center gap-2 text-xl">
              <span>点击插件程序</span>
              <ProductLogo classNames="w-9 h-9" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-lg font-medium">
              3
            </div>
            <Text className="text-xl">开始录制</Text>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-lg font-medium">
              4
            </div>
            <div className="flex items-center gap-2 text-xl">
              <span>点击插件，结束录制</span>
              <ProductLogo classNames="w-9 h-9" />
            </div>
          </div>
        </div>

        <Button
          type="default"
          size="large"
          icon={<PlayCircleOutlined />}
          className="px-6 py-3 h-auto flex items-center text-lg rounded-full shadow-sm border-gray-200"
        >
          Show me how
        </Button>
      </div>

      {/* Right side - Walkflow UI */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md rounded-2xl shadow-xl" bodyStyle={{ padding: 0 }}>
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b">
            <div className="flex items-center gap-2">
              <ProductLogo />
              <Text strong className="text-xl tracking-wide">
                WALKFLOW
              </Text>
            </div>
            <SettingOutlined className="text-xl" />
          </div>

          {/* Recording options */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                  activeTab === 'interactive' ? 'bg-gray-100' : ''
                }`}
                onClick={() => setActiveTab('interactive')}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <Text className="mt-2">Interactive</Text>
              </div>

              <div
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                  activeTab === 'video' ? 'bg-gray-100' : ''
                }`}
                onClick={() => setActiveTab('video')}
              >
                <VideoCameraOutlined style={{ fontSize: '24px' }} />
                <Text className="mt-2">Video</Text>
              </div>

              <div
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                  activeTab === 'screenshot' ? 'bg-gray-100' : ''
                }`}
                onClick={() => setActiveTab('screenshot')}
              >
                <PictureOutlined style={{ fontSize: '24px' }} />
                <Text className="mt-2">Screenshot</Text>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Text strong>Settings</Text>
              <RightOutlined />
            </div>

            {/* Record with Avery */}
            <div className="flex justify-between items-center mt-6 p-3">
              <div className="flex items-center gap-2">
                <StarOutlined className="text-blue-500" />
                <Text>Record with Avery</Text>
                <div className="px-2 py-0.5 bg-gray-100 rounded text-xs">Beta</div>
              </div>
              <Switch />
            </div>

            {/* Record button */}
            <Button type="primary" block size="large" className="mt-4 h-14 text-lg rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <span>Record interactive demo</span>
                <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded">
                  <span className="text-xs">E</span>
                </div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
