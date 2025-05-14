import { Button } from 'antd';
import classNames from 'classnames';

export default function Chapter(props: { data: ChapterStep; jump?: (uid: string) => void; className?: string }) {
  const { title, align, subtitle, actions } = props.data;
  return (
    <div
      className={classNames(
        ' relative backdrop-blur-md bg-[#ffffffb3] w-full h-full rounded-md overflow-hidden',
        props.className,
      )}
    >
      <div className="h-full  flex flex-col justify-center px-10 gap-2">
        <div
          className="p-0 text-2xl font-semibold"
          style={{
            textAlign: align,
          }}
        >
          {title}
        </div>
        <div
          className="p-0 whitespace-break-spaces text-sm mb-1"
          style={{
            textAlign: align,
          }}
        >
          {subtitle}
        </div>

        <div
          className="flex gap-2"
          style={{
            justifyContent: align,
          }}
        >
          {actions.map((it, index) => {
            if (it.type === 'button') {
              return (
                <Button size="large" type="primary" key={index} onClick={() => props.jump?.(it.destination)}>
                  <div className="px-6 text-white text-center">{it.text}</div>
                </Button>
              );
            }
            return '暂不支持类型:' + it.type;
          })}
        </div>
      </div>
    </div>
  );
}
