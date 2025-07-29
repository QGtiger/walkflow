import { Form, Input, Segmented, Select } from "antd";
import { FlowDetailModel } from "../../model";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import { useDestination } from "@/hooks/useDestination";
import { useCreation } from "ahooks";
import DestinationSteps from "@/components/DestinationSteps";

export function HotStepConfig() {
  const { stepInfo, updateWalkflow, steps } = FlowDetailModel.useModel();

  const { detinationList } = useDestination({
    steps,
    destinationAction: stepInfo as HotSpotStep,
  });

  if (!stepInfo || stepInfo.type !== "hotspot") return;

  console.log(detinationList);

  return (
    <Form
      onValuesChange={(changeValues) => {
        Object.assign(stepInfo, changeValues);
        updateWalkflow();
      }}
      initialValues={stepInfo}
      layout="vertical"
    >
      <Form.Item name="title" label="显示文案">
        <Input.TextArea placeholder="请补充文案" autoSize variant="filled" />
      </Form.Item>
      <Form.Item name="align" label="对齐方式">
        <Segmented
          options={[
            { value: "left", icon: <AlignLeftOutlined /> },
            { value: "center", icon: <AlignCenterOutlined /> },
            { value: "right", icon: <AlignRightOutlined /> },
          ]}
          block
        />
      </Form.Item>
      <Form.Item label="跳转步骤">
        <Select
          variant="filled"
          value={stepInfo.destination}
          fieldNames={{
            value: "uid",
            label: "name",
          }}
          options={detinationList}
          popupRender={() => {
            return (
              <DestinationSteps
                destinationAction={stepInfo}
                currStepUuid={stepInfo.uid}
                steps={steps}
                onChange={(opt) => {
                  Object.assign(stepInfo, opt);
                  updateWalkflow();
                }}
              />
            );
          }}
        />
      </Form.Item>
    </Form>
  );
}
