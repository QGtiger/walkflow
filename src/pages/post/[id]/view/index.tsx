import { FlowPostDetailModel } from "../model";
import CustomToastUIViewer from "@/components/CustomToastUIEditor/CustomToastUIViewer";

export default function PostView() {
  const { postSchema } = FlowPostDetailModel.useModel();

  return <CustomToastUIViewer content={postSchema.content} />;
}
