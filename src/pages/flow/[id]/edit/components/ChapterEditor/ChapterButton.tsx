import { Button, Input } from "antd";

export default function ChapterButton({
  defaultValue,
  onBlur,
}: {
  defaultValue?: string;
  onBlur?: (value: string) => void;
}) {
  return (
    <div className=" relative group">
      <div className=" rounded-md absolute -inset-[0.25rem] border border-solid border-gray-900  opacity-0 group-hover:opacity-100"></div>
      <Button size="large" type="primary">
        <Input
          className="px-6 text-white text-center"
          defaultValue={defaultValue}
          placeholder="请输入按钮文案"
          variant="borderless"
          onBlur={(e) => {
            onBlur?.(e.target.value);
          }}
        />
      </Button>
    </div>
  );
}
