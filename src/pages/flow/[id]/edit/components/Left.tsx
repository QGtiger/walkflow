import classNames from "classnames";
import { FlowDetailModel } from "../../model";
import { Dropdown, Image, type MenuProps, Skeleton, theme } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function StepCard(props: {
  cardInfo: ChapterStep | HotSpotStep;
  index: number;
}) {
  const { cardInfo, index } = props;
  const { stepUuid, setStepUuid, removeStep } = FlowDetailModel.useModel();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  let content;
  if (cardInfo.type === "chapter") {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-white/80">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 92 32"
          className="w-2/3 text-gray-900"
        >
          <rect
            width="56"
            height="6"
            x="18"
            fill="currentColor"
            opacity="0.3"
            rx="3"
          ></rect>
          <rect
            width="26"
            height="10"
            x="33"
            y="22"
            fill="currentColor"
            opacity="0.2"
            rx="5"
          ></rect>
          <rect
            width="92"
            height="4"
            y="10"
            fill="currentColor"
            opacity="0.25"
            rx="2"
          ></rect>
        </svg>
      </div>
    );
  } else if (cardInfo.type === "hotspot") {
    content = (
      <div>
        <Image
          preview={false}
          className=" object-cover !h-full select-none pointer-events-none"
          rootClassName="h-full"
          src={cardInfo.screenshotUrl}
          placeholder={<Skeleton.Image active className="!h-[148px] !w-full" />}
        />
      </div>
    );
  }

  const active = stepUuid === cardInfo.uid;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label:
        cardInfo.name || cardInfo.type === "chapter" ? "Chapter" : "Hotspot",
      disabled: true,
    },
    {
      key: "4",
      label: "删除",
      extra: <DeleteOutlined />,
      onClick() {
        removeStep(cardInfo.uid);
      },
    },
  ];

  return (
    <div
      className={classNames(
        "h-[148px] transition-all hover:ring-4  ring-0.5 ring-gray-300 border-solid rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative",
        {
          "ring-4 ring-[#8071f596] border-primary": active,
        }
      )}
      onClick={() => {
        setStepUuid(cardInfo.uid);
      }}
    >
      {content}
      <div className=" absolute bottom-0 p-2 flex justify-between text-xs items-center w-full">
        <div
          className={classNames(
            "flex items-center justify-center w-5 h-5 rounded-full",
            {
              " text-white": active,
              " text-gray-700": !active,
            }
          )}
          style={{
            background: active ? colorPrimary : "rgba(229, 231, 235, 1)",
          }}
        >
          {index}
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={{ items }} rootClassName="w-48">
            <div className="flex gap-[1px] w-5 h-5 items-center justify-center bg-gray-500 rounded-full border border-solid border-gray-500 group hover:bg-white transition-all">
              {[0, 1, 2].map((it) => {
                return (
                  <div
                    key={it}
                    className="dot w-[3px] h-[3px] rounded-full bg-white group-hover:bg-gray-500 transition-all"
                  ></div>
                );
              })}
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default function Left() {
  const {
    flowDetail: { schema: schemaJson },
  } = FlowDetailModel.useModel();
  const { version = "1.0" } = schemaJson;

  if (version === "1.0") {
    const {
      config: { steps },
    } = schemaJson;

    return (
      <div className="flex flex-col gap-4 h-full p-4 scroll-content">
        {steps.map((it, index) => {
          return <StepCard key={it.uid} cardInfo={it} index={index + 1} />;
        })}
      </div>
    );
  }

  return "不支持版本";
}
