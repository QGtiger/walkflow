import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";
import { setAccessToken } from ".";
import { navigate } from "../utils/navigation";
import { createMessage } from "../utils/customMessage";

export const commonApiConfig = (function () {
  const config: {
    headers: Record<string, string>;
  } = {
    headers: {},
  };
  return {
    getHeaders() {
      return config.headers;
    },
    setHeaders(headers: Record<string, string>) {
      config.headers = headers;
    },
  };
})();

const client = axios.create({
  baseURL: process.env.API_WALKFLOW_URL,
});

client.interceptors.request.use((config) => {
  Object.entries(commonApiConfig.getHeaders()).forEach(([key, value]) => {
    if (value) {
      (config.headers as AxiosRequestHeaders)[key] = value;
    }
  });
  return config;
});

client.interceptors.response.use(
  // @ts-expect-error
  (res) => {
    const { code, data, message } = res.data;
    if (code === 200) {
      return {
        success: true,
        data,
        code,
      };
    } else {
      if (code == 401) {
        // 未登录
        setAccessToken("");

        navigate("/login");
      }

      createMessage(
        {
          type: "error",
          content: message,
        },
        {
          hideOther: true,
        }
      );

      return {
        success: false,
        data,
        code,
        errorMsg: message,
      };
    }
  },
  (error) => {
    return {
      success: false,
      data: null,
      code: 500,
      errorMsg: error.message,
    };
  }
);

export function walkflowRequest<T = any>(
  options: AxiosRequestConfig,
  interceptConfig?: {
    hideMessage?: boolean;
  }
): Promise<{ success: boolean; data?: T; code: number; errorMsg?: string }> {
  return client({
    ...options,
    data: {
      ...options.data,
      interceptConfig,
    },
  });
}
