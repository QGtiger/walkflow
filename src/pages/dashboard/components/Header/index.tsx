import CustomHeader from "@/components/CustomHeader";
import { UserModel } from "@/models/UserModel";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";

export default function Header() {
  const { userLogout, userInfo } = UserModel.useModel();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: userInfo?.nickName,
      disabled: true,
    },
    {
      type: "divider",
    },
    // {
    //   key: '2',
    //   label: 'Profile',
    //   extra: '⌘P',
    // },
    // {
    //   key: '3',
    //   label: 'Billing',
    //   extra: '⌘B',
    // },
    {
      key: "4",
      label: "退出账号",
      icon: <LogoutOutlined />,
      onClick: userLogout,
    },
  ];

  return (
    <CustomHeader
      rightContent={
        <div className="flex items-center space-x-4">
          <Dropdown menu={{ items }}>
            <Button>
              <UserOutlined />
            </Button>
          </Dropdown>
        </div>
      }
    />
  );
}
