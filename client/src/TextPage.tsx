import { zoomies } from "ldrs";
import { useTextContent } from "./useTextContent";

function replaceWithBr(body: string): string {
  return body.replace(/\n/g, "<br />")
}

interface TextPageProps {
  textKey: string;
}

export default function TextPage(props: TextPageProps) {
  const content = useTextContent(props.textKey);

  // TODO: reusable component for this?
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
      <div className="text-lg font-bold pb-10">{content.title}</div>
      <div className="flex-row justify-center">
        <p className="w-[650px]" dangerouslySetInnerHTML={{__html: replaceWithBr(content.body)}} />
      </div>
    </div>
  );
}