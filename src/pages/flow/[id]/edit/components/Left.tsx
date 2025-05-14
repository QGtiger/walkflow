import classNames from 'classnames';
import { FlowDetailModel } from '../../model';
import { Image, Skeleton } from 'antd';

function StepCard(props: { cardInfo: ChapterStep | HotSpotStep }) {
  const { cardInfo } = props;
  const { stepUuid, setStepUuid } = FlowDetailModel.useModel();

  let content;
  if (cardInfo.type === 'chapter') {
    content = (
      <div className="w-full h-full flex items-center justify-center bg-white/80">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 92 32" className="w-2/3 text-gray-900">
          <rect width="56" height="6" x="18" fill="currentColor" opacity="0.3" rx="3"></rect>
          <rect width="26" height="10" x="33" y="22" fill="currentColor" opacity="0.2" rx="5"></rect>
          <rect width="92" height="4" y="10" fill="currentColor" opacity="0.25" rx="2"></rect>
        </svg>
      </div>
    );
  } else if (cardInfo.type === 'hotspot') {
    content = (
      <Image
        preview={false}
        className=" object-cover !h-full select-none"
        rootClassName="h-full"
        src={cardInfo.screenshotUrl}
        placeholder={<Skeleton.Image active className="!h-[148px] !w-full" />}
      />
    );
  }

  return (
    <div
      className={classNames(
        'h-[148px] transition-all hover:ring-4  ring-0.5 ring-gray-300 border-solid rounded-lg overflow-hidden cursor-pointer flex-shrink-0',
        {
          'ring-4 ring-[#8071f596] border-primary': stepUuid === cardInfo.uid,
        },
      )}
      onClick={() => {
        setStepUuid(cardInfo.uid);
      }}
    >
      {content}
    </div>
  );
}

export default function Left() {
  const {
    flowDetail: { schema: schemaJson },
  } = FlowDetailModel.useModel();
  const { version = '1.0' } = schemaJson;

  if (version === '1.0') {
    const {
      config: { steps, screenRecordingUrl },
    } = schemaJson;

    return (
      <div className="flex flex-col gap-4 h-full p-4 scroll-content">
        {steps.map((it) => {
          return <StepCard key={it.uid} cardInfo={it} />;
        })}
      </div>
    );
  }

  return '不支持版本';
}
