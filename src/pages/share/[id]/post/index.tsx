import { walkflowRequest } from "@/api/walkflowApi";
import CustomHeader from "@/components/CustomHeader";
import CustomLoading from "@/components/CustomLoading";
import CustomToastUIViewer from "@/components/CustomToastUIEditor/CustomToastUIViewer";
import { useRequest } from "ahooks";
import { useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function SharePostPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useRequest(() => {
    return walkflowRequest<WalkflowDetail>({
      url: "/openapi/detail/" + id,
      method: "GET",
    }).then(async (res) => {
      return res.data?.postSchema;
    });
  });
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "true";
  const mainRef = useRef<HTMLDivElement>(null);

  console.log(embed);

  return (
    <div className="flex flex-col h-screen">
      {!embed && <CustomHeader />}
      <main
        className="flex-1 flex items-center justify-center overflow-hidden"
        ref={mainRef}
      >
        {loading || !data ? (
          <CustomLoading />
        ) : (
          <CustomToastUIViewer content={data.content} />
        )}
      </main>
    </div>
  );
}
