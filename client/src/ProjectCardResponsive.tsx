import { Card, Image } from "antd";
import { getIsMobile } from "./utils";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  extraContent?: React.ReactNode;
}

function ProjectCardMobile(props: ProjectCardProps) {
  const { title, description, imageUrl, imageAlt, extraContent } = props;
  return (
    <Card key={title} style={{ maxWidth: "calc(100vw - 2rem)", borderRadius: "unset" }}>
      <div className="text-lg font-semibold pb-2">{title}</div>
      <div className="flex flex-col flex-shrink-0 space-y-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={imageUrl}
            style={{
              height: "30vw",
              width: "auto",
              objectFit: "contain",
            }}
          />
          <div>{description}</div>
          {extraContent}
      </div>
    </Card>
  );
}

function ProjectCardMobileVertical(props: ProjectCardProps) {
  const { title, description, imageUrl, imageAlt, extraContent } = props;
  return (
    <Card key={title} style={{ maxWidth: "calc(100vw - 2rem)", borderRadius: "unset" }}>
      <div className="text-lg font-semibold py-2">{title}</div>
      <div className="flex flex-shrink-0 space-x-4">
          <Image
            title={imageAlt}
            alt={imageAlt}
            preview={false}
            src={imageUrl}
            style={{
              height: "40vw",
              width: "auto",
              objectFit: "contain",
            }}
          />
        <div className="flex flex-col space-y-4">
          <div>{description}</div>
          {extraContent}
        </div>
      </div>
    </Card>
  );
}

function ProjectCard(props: ProjectCardProps) {
  const { title, description, imageUrl, imageAlt, extraContent } = props;
  return (
    <Card key={title} style={{ maxWidth: "950px", borderRadius: "unset" }}>
      <div className="h-full flex flex-shrink-0 space-x-4 py-4">
        <Image
          title={imageAlt}
          alt={imageAlt}
          preview={false}
          src={imageUrl}
          style={{
            height: "150px",
            width: "auto",
            objectFit: "contain",
          }}
        />
        <div className="pt-2 pl-1 flex flex-col space-y-2">
          <div className="text-lg font-semibold">{title}</div>
          <div>{description}</div>
          {extraContent}
        </div>
      </div>
    </Card>
  );
}

interface ProjectCardResponsiveProps extends ProjectCardProps {
  orientation?: 'horizontal' | 'vertical';
}

export default function ProjectCardResponsive(props: ProjectCardResponsiveProps) {
  const isMobile = getIsMobile();
  if (isMobile && props.orientation === 'vertical') {
    return <ProjectCardMobileVertical {...props} />;
  } else if (isMobile) {
    return <ProjectCardMobile {...props} />;
  } else {
    return <ProjectCard {...props} />;
  }
}