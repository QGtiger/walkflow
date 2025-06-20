import { walkflowRequest } from "@/api/walkflowApi";
import CustomHeader from "@/components/CustomHeader";
import CustomLoading from "@/components/CustomLoading";
import { AuthLoginLayout } from "@/Layouts/AuthLogin";
import { UploadModel } from "@/models/UploadModel";
import { useLatest } from "ahooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const { countNum, schema, isUploading } = UploadModel.useModel();
  const nav = useNavigate();
  const schemaLatestRef = useLatest(schema);

  useEffect(() => {
    console.log(schemaLatestRef.current, isUploading);
    if (!isUploading && schemaLatestRef.current) {
      walkflowRequest<{
        flowId: string;
      }>({
        url: "/create",
        method: "POST",
        data: {
          schema: schemaLatestRef.current,
        },
      }).then(({ data }) => {
        if (data) {
          nav(`/flow/${data.flowId}`, {
            replace: true,
          });
        }
      });
    }
  }, [isUploading]);

  return (
    <AuthLoginLayout>
      <div className="flex flex-col h-screen">
        <CustomHeader />
        <main className="flex-1 flex justify-center items-center bg-walkflow-gray">
          <div className="flex flex-col items-center">
            <CustomLoading />
            <div className="mt-24 space-y-2 text text-gray-500">
              <div className="text text-gray-500">
                Wating for upload data...
              </div>
              <div className=" text-center">{countNum}%</div>
            </div>
          </div>
        </main>
      </div>
    </AuthLoginLayout>
  );
}
