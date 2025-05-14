import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AreaChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Form, Input, Segmented, Tooltip } from "antd";
import { FlowDetailModel } from "../../model";
import { type PropsWithChildren, useEffect, useState } from "react";
import classNames from "classnames";
import BackgroundSelect from "./BackgroundSelect";

function Panel({
  title,
  children,
}: {
  title: string;
} & PropsWithChildren) {
  return (
    <div className="w-[260px]">
      <div className="h px-6 py-3 border-0 border-b border-border border-solid font-semibold">
        {title}
      </div>
      <div className="px-6 py-3">{children}</div>
    </div>
  );
}

function StepConfig() {
  const { stepInfo, updateWalkflow } = FlowDetailModel.useModel();

  if (stepInfo?.type === "chapter") {
    return (
      <Form
        onValuesChange={(changeValues) => {
          Object.assign(stepInfo, changeValues);
          updateWalkflow();
        }}
        initialValues={stepInfo}
        layout="vertical"
      >
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
      </Form>
    );
  }

  if (stepInfo?.type === "hotspot") {
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
      </Form>
    );
  }
}

function Designer() {
  const { designerConfig, updateWalkflow } = FlowDetailModel.useModel();
  if (!designerConfig) return null;
  return (
    <Form
      onValuesChange={(changeValues) => {
        Object.assign(designerConfig, changeValues);
        updateWalkflow();
      }}
      initialValues={designerConfig}
      layout="vertical"
    >
      <Form.Item name="background" label="背景">
        <BackgroundSelect />
      </Form.Item>
    </Form>
  );
}

export default function Right() {
  const { stepUuid } = FlowDetailModel.useModel();
  const [activeKey, setActiveKey] = useState<"card" | "setting">("card");

  useEffect(() => {
    setActiveKey("card");
  }, [stepUuid]);

  return (
    <div className="flex h-full">
      {activeKey === "setting" && (
        <Panel title="Walkflow 总览配置">
          <Designer />
        </Panel>
      )}
      {activeKey === "card" && (
        <Panel title="Card 配置">
          <StepConfig key={stepUuid} />
        </Panel>
      )}
      <div className="flex flex-col gap-2 p-2 border-0 border-l border-border border-solid h-full">
        <Tooltip title="当前配置" placement="left">
          <div
            className={classNames(
              "p-2 rounded-sm hover:bg-[#dbd4fa] cursor-pointer flex items-center justify-center",
              {
                "bg-[#dbd4fa]": activeKey === "card",
              }
            )}
            onClick={() => {
              setActiveKey("card");
            }}
          >
            <AreaChartOutlined />
          </div>
        </Tooltip>

        <Tooltip title="总览配置" placement="left">
          <div
            className={classNames(
              "p-2 rounded-sm hover:bg-[#dbd4fa] cursor-pointer flex items-center justify-center",
              {
                "bg-[#dbd4fa]": activeKey === "setting",
              }
            )}
            onClick={() => {
              setActiveKey("setting");
            }}
          >
            <SettingOutlined />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
