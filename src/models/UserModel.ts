import { getAccessToken, setAccessToken } from "@/api";
import { request } from "@/api/request";
import { commonApiConfig } from "@/api/walkflowApi";
import { createCustomModel } from "@/common/createModel";
import { useMount, useReactive, useRequest } from "ahooks";
import { useLocation, useNavigate } from "react-router-dom";

interface UserInfo {
  nickName: string;
  uuid: string;
}

export const UserModel = createCustomModel(() => {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const userViewModel = useReactive<UserInfo>({
    nickName: "",
    uuid: "",
  });

  const { loading: queryUserInfoLoading, runAsync: queryUserInfo } = useRequest(
    async (token: string) => {
      setAccessToken(token);
      if (!token) {
        // 清空登录信息
        Object.assign(userViewModel, {
          nickName: "",
          uuid: "",
        });
      } else if (!userViewModel.uuid) {
        const { data } = await request<UserInfo>({
          url: "/boss/api/v1/sys/user/detail",
          method: "get",
        });

        if (data) {
          Object.assign(userViewModel, data);

          // 设置walkflow的请求头
          commonApiConfig.setHeaders({
            walkflowuserid: data.uuid,
          });
        }
      }
      return userViewModel;
    },
    {
      manual: true,
    }
  );

  useMount(() => {
    const token = getAccessToken();
    if (token) {
      queryUserInfo(token);
    }
  });

  return {
    queryUserInfoLoading,
    userInfo: userViewModel,

    userLogin: (opt: { token: string; redirectUrl?: string }) => {
      const { token, redirectUrl = "/" } = opt;
      return queryUserInfo(token).then((r) => {
        nav(redirectUrl, {
          replace: true,
        });
        return r;
      });
    },
    userLogout() {
      queryUserInfo("");
      nav(`/login?from=${encodeURIComponent(pathname + search)}`, {
        replace: true,
      });
    },
  };
});
