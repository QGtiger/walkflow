import { NextStepKeyByUrl } from "@/common/step";
import { useDestination } from "@/hooks/useDestination";
import { Form, Input, Modal, type FormInstance } from "antd";
import classNames from "classnames";
import { createRef } from "react";

export default function DestinationSteps({
  className,
  steps,
  destinationAction,
  currStepUuid,
  onChange,
}: {
  steps: TourbitStep[];
  className?: string;
  destinationAction: NextDestinationAction;
  currStepUuid: string;

  onChange?: (opt: {
    destination?: string;
    url?: string; // 如果是 NextStepKeyByUrl，则需要传入 url
  }) => void;
}) {
  const { url } = destinationAction;
  const [modal, modalHolder] = Modal.useModal();

  const { targetUuid, detinationList } = useDestination({
    steps,
    destinationAction,
  });

  return (
    <div className={classNames("", className)}>
      {detinationList.map((step) => {
        const isCurrent = step.uid === currStepUuid;
        return (
          <div
            key={step.uid}
            className={classNames(
              "p-2 hover:bg-gray-200 cursor-pointer transition-all rounded-md flex items-center gap-1",
              {
                " bg-slate-200": step.uid === targetUuid,
              }
            )}
            onClick={() => {
              if (step.uid === NextStepKeyByUrl) {
                const formRef = createRef<FormInstance>();
                modal.confirm({
                  title: "设置跳转地址",
                  icon: null,
                  content: (
                    <Form
                      ref={formRef}
                      layout="vertical"
                      initialValues={{ url }}
                    >
                      <Form.Item
                        name="url"
                        label="地址"
                        rules={[
                          {
                            required: true,
                            message: "请输入跳转地址",
                          },
                          {
                            type: "url",
                            message: "请输入有效的 URL 地址",
                          },
                        ]}
                      >
                        <Input placeholder="请输入跳转地址" variant="filled" />
                      </Form.Item>
                    </Form>
                  ),
                  onOk() {
                    return formRef.current?.validateFields().then((values) => {
                      onChange?.({
                        destination: NextStepKeyByUrl,
                        url: values.url,
                      });
                    });
                  },
                });
              } else {
                onChange?.({
                  destination: step.uid,
                });
              }
            }}
          >
            <div className="line-clamp-1">{step.name}</div>
            {isCurrent && (
              <div
                className="text-xs"
                style={{
                  wordBreak: "keep-all",
                }}
              >
                (current)
              </div>
            )}
          </div>
        );
      })}
      {modalHolder}
    </div>
  );
}
