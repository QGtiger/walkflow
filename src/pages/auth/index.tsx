import { getAccessToken } from "@/api";
import CustomLoading from "@/components/CustomLoading";
import { AuthLoginLayout } from "@/Layouts/AuthLogin";
import { useMount } from "ahooks";

export default function AuthPage() {
  useMount(() => {
    window.open(`tourbitwebauth://auth?token=${getAccessToken()}`, "_self");
  });

  return (
    <AuthLoginLayout>
      <div className=" relative flex items-center justify-center h-[100vh] ">
        <div className="flex flex-col justify-center items-center">
          <CustomLoading />
          <div className="mt-20 text-center">{getAccessToken()}</div>
        </div>
      </div>
    </AuthLoginLayout>
  );
}
