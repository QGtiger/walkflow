import { FlowDetailModel } from "../model";
import PreviewCard from "@/components/PreviewCard";

export default function View() {
  const { schema, stepUuid } = FlowDetailModel.useModel();
  return (
    <div className="p-6 flex justify-center items-center h-full">
      <PreviewCard
        schema={schema}
        className="max-w-[1200px] mt-[-100px]"
        targetUuid={stepUuid}
      />
    </div>
  );
}
