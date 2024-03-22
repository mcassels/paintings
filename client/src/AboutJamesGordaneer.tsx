import { zoomies } from "ldrs";
import { JIM_BIO_KEY } from "./constants";
import { useTextContent } from "./useTextContent";

function replaceWithBr(body: string): string {
  return body.replace(/\n/g, "<br />")
}

export default function AboutJamesGordaneer() { // TODO: generic component to reuse for other pages?
  const content = useTextContent(JIM_BIO_KEY);

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
    <div>
      <div className="text-lg font-bold pb-10">{content.title}</div>
      <div><p dangerouslySetInnerHTML={{__html: replaceWithBr(content.body)}} /></div>
    </div>
  );
}