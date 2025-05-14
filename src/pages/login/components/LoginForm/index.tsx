import { Input, Button, Checkbox, Form, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined, LoginOutlined } from '@ant-design/icons';
import { createMessage } from '@/utils/customMessage';
import { request } from '@/api/request';
import { encrypt } from '@/utils/crypto';
import { createNotification } from '@/utils/customNotification';
import { UserModel } from '@/models/UserModel';
import { useEffect } from 'react';

const { Title, Paragraph, Text, Link } = Typography;

const LoginCacheKey = 'login_cache';

export default function LoginForm() {
  const [form] = Form.useForm();
  const { userLogin } = UserModel.useModel();
  const cache = localStorage.getItem(LoginCacheKey);
  const initialValues = cache ? JSON.parse(cache) : undefined;

  const remember = Form.useWatch(['remember'], form) ?? initialValues?.remember;

  useEffect(() => {
    if (!remember) {
      localStorage.removeItem(LoginCacheKey);
    }
  }, [remember]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { success, data } = await request<{
        accessToken: string;
      }>({
        url: '/boss/api/v3/manager/login/ldap',
        method: 'POST',
        data: {
          ...values,
          password: encrypt(values.password),
        },
      });
      if (success && data) {
        const from = new URLSearchParams(window.location.search).get('from');
        if (values.remember) {
          localStorage.setItem(LoginCacheKey, JSON.stringify(values));
        }
        userLogin({
          token: data.accessToken,
          redirectUrl: from || '/',
        }).then((d) => {
          createNotification({
            type: 'success',
            message: '登录成功',
            description: '欢迎回来, ' + d.nickName,
          });
        });
      }
    } catch (error: any) {
      createMessage({
        type: 'error',
        content: error.message,
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <div className="mb-6">
        <Title level={3} className="mb-1">
          登录 Walkflow
        </Title>
        <Paragraph type="secondary">登录您的账户开始创建互动式产品演示</Paragraph>
      </div>

      <div className="space-y-4">
        <Form className="space-y-4" form={form} initialValues={initialValues}>
          <div className="">
            <Text className="block text-sm font-medium mb-3">用户名</Text>
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input
                placeholder="请输入用户名"
                prefix={<UserOutlined className="text-gray-400" />}
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="">
            <Text className="block text-sm font-medium mb-3">密码</Text>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password
                placeholder="请输入密码"
                prefix={<LockOutlined className="text-gray-400" />}
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-sm">记住我</Checkbox>
            </Form.Item>
            <Link className="text-primary hover:underline cursor-default">忘记密码?</Link>
          </div>
        </Form>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full mt-4"
          icon={<LoginOutlined />}
          size="large"
          onClick={onSubmit}
        >
          登录
        </Button>
      </div>

      <div className="text-center mt-6">
        <Text className="text-sm text-gray-600">
          还没有账号? <Link className="text-primary hover:underline">免费注册</Link>
        </Text>
      </div>
    </Card>
  );
}
