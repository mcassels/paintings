import Markdown from 'react-markdown'
import { useTextContent } from "./useTextContent";
import { Spin } from "antd";

interface TextPageProps {
  textKey: string;
}

export default function TextPage(props: TextPageProps) {
  const content = useTextContent(props.textKey);

  if (content === 'loading') {
    return (
      <div className="w-[650px] h-[500px] flex items-center justify-center">
        <Spin />
      </div>
    );
  }
  if (content === 'error') {
    return <div className="loading">Error loading bio</div>;
  }
  return (
    <div className="text-left mx-2 flex justify-center">
      <div style={{ width: "min(100%, 650px)"}}>
        <div className="text-lg font-bold pb-2">{content.title}</div>
        <div className="flex-row justify-center">
          <div>
            <Markdown>{content.body}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}