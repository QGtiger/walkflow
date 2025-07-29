import { DownOutlined } from "@ant-design/icons";
import { FlowDetailModel } from "../../../model";
import { isBuildInStepKey, NextStepKey, NextStepKeyByUrl } from "@/common/step";
import { getStepByUid, getStepName } from "@/utils/walkflowUtils";
import { useBoolean, useCreation } from "ahooks";
import { Dropdown, Form, Input, Modal, type FormInstance } from "antd";
import { createRef, useRef } from "react";
import classNames from "classnames";

function getStepLabel(step: any, index: number) {
  return `${getStepName(step, index)}`;
}

export default function DestinationSelect({
  btnAction,
  onChange,
}: {
  btnAction: ChapterButtonAction;
  onChange?: (opt: {
    destination?: string;
    url?: string; // 如果是 NextStepKeyByUrl，则需要传入 url
  }) => void;
}) {
  const { destination, url } = btnAction;
  const { steps, stepUuid } = FlowDetailModel.useModel();
  const ref = useRef<HTMLDivElement>(null);
  const [active, activeAction] = useBoolean(false);
  const [modal, modalHolder] = Modal.useModal();

  const stepWithNext: {
    name?: string;
    uid: string;
  }[] = useCreation(() => {
    return [
      {
        name: "Next Step by URL",
        uid: NextStepKeyByUrl,
      },
      {
        name: "Next Step",
        uid: NextStepKey,
      },
    ].concat(steps as any[]);
  }, [steps]);

  const { nextUuid, label } = useCreation(() => {
    // @ts-expect-error 先这样吧 没想好怎么处理 类型问题
    const { step, index } = getStepByUid(destination, stepWithNext);
    if (step) {
      return {
        nextUuid: step.uid,
        label: getStepLabel(step, index),
      };
    }
    return {
      nextUuid: "",
      label: "未找到目标步骤",
    };
  }, [destination, stepWithNext]);

  return (
    <Dropdown
      trigger={["click"]}
      // overlayClassName="w-64"
      onOpenChange={activeAction.set}
      getPopupContainer={() => ref.current || document.body}
      popupRender={() => {
        return (
          <div className="flex  mt-1 items-start gap-1">
            <div className=" w-64 flex-shrink-0 p-1 flex gap-1 flex-col bg-white shadow-md rounded-md border border-gray-100 border-solid max-h-[400px] overflow-auto">
              {stepWithNext.map((step, index) => {
                const isCurrent = step.uid === stepUuid;
                return (
                  <div
                    key={step.uid}
                    className={classNames(
                      "p-2 hover:bg-gray-200 cursor-pointer transition-all rounded-md flex items-center gap-1",
                      {
                        " bg-slate-200": step.uid === nextUuid,
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
                                <Input
                                  placeholder="请输入跳转地址"
                                  variant="filled"
                                />
                              </Form.Item>
                            </Form>
                          ),
                          onOk() {
                            return formRef.current
                              ?.validateFields()
                              .then((values) => {
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
                    <div className="line-clamp-1">
                      {!isBuildInStepKey(step.uid) ? `${index}.  ` : ""}
                      {getStepLabel(step, index)}
                    </div>
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
            </div>
            {modalHolder}
          </div>
        );
      }}
    >
      <div
        className={classNames(
          "flex gap-2 group hover:bg-gray-300 rounded-md p-1 cursor-pointer min-w-[80px] max-w-[200px] justify-between",
          {
            "bg-gray-300": active,
          }
        )}
        ref={ref}
      >
        <div className=" line-clamp-1">{label}</div>
        <div>
          <DownOutlined />
        </div>
      </div>
    </Dropdown>
  );
}
