import { FlowDetailModel } from '../model';
import Left from './components/Left';
import Main from './components/Main';
import Right from './components/Right';

export default function EditFlow() {
  const {
    flowDetail: { schema: schemaJson },
  } = FlowDetailModel.useModel();
  const { version } = schemaJson;
  // 先默认只做  version 1.0
  return (
    <div className="flex h-full">
      <div className="left w-[280px] flex-grow-0 flex-shrink-0 border-0 border-r border-gray-200 border-solid">
        <Left />
      </div>
      <div className="w-1 flex-1 bg-[#fbfbfb] scroll-content">
        <Main />
      </div>
      <div className=" flex-grow-0 flex-shrink-0 border-0 border-l border-gray-200 border-solid">
        <Right />
      </div>
    </div>
  );
}
