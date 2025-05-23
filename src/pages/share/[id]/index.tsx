import { walkflowRequest } from "@/api/walkflowApi";
import CustomHeader from "@/components/CustomHeader";
import CustomLoading from "@/components/CustomLoading";
import PreviewCard from "@/components/PreviewCard";
import { useRequest } from "ahooks";
import classNames from "classnames";
import { useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function Share() {
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useRequest(() => {
    return walkflowRequest<WalkflowDetail>({
      url: "/openapi/detail/" + id,
      method: "GET",
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
        {loading || !data?.data?.schema ? (
          <CustomLoading />
        ) : (
          <div
            className={classNames(
              embed ? "" : "py-10",
              "w-full h-full relative"
            )}
          >
            <PreviewCard schema={data?.data?.schema} embed={embed} />
          </div>
        )}
      </main>
    </div>
  );
}
