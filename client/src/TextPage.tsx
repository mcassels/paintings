import { zoomies } from "ldrs";
import Markdown from 'react-markdown'
import { useTextContent } from "./useTextContent";

interface TextPageProps {
  textKey: string;
}

export default function TextPage(props: TextPageProps) {
  const content = useTextContent(props.textKey);

  if (content === 'loading') {
    zoomies.register();
    return (
      <div className="loading">
        <l-zoomies/>
      </div>
    );
  }
  if (content === 'error') {
    return <div className="loading">Error loading bio</div>;
  }
  return (
    <div className="text-left">
      <div className="text-lg font-bold pb-2">{content.title}</div>
      <div className="flex-row justify-center">
        <div className="w-[650px]">
          <Markdown>{content.body}</Markdown>
        </div>
      </div>
    </div>
  );
}