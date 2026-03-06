import { useState } from "react";
import { ArchivePainting } from "./archiveTypes";
import { Painting } from "./types";
import { reportPaintingButtonClick } from "./utils";
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from "react-share";
import { Button, Popover } from "antd";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

export default function PaintingShareButton(props: { painting: Painting|ArchivePainting|undefined }) {
  const { painting } = props;
  const [open, setOpen] = useState(false);

  const afterShare = (shareDest: string) => {
    setOpen(false);
    reportPaintingButtonClick(`share`, painting?.id || '', { share_type: shareDest });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  if (!painting) {
    return null;
  }
  const shareUrl = window.location.href.replace("http://localhost:3000", "https://jamesgordaneer.com");
  const title = painting.title;

  const popoverContent = (
    <div className="flex flex-col Demo__some-network">
      <FacebookShareButton url={shareUrl} className="Demo__some-network__share-button">
        <FacebookIcon size={32} onClick={() => afterShare('facebook')}/>
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        onClick={() => afterShare('twitter')}
        className="Demo__some-network__share-button"
      >
        <XIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={shareUrl} className="Demo__some-network__share-button">
        <WhatsappIcon size={32} onClick={() => afterShare('whatsapp')} />
      </WhatsappShareButton>
      <LinkedinShareButton url={shareUrl} className="Demo__some-network__share-button">
        <LinkedinIcon size={32} round onClick={() => afterShare('linkedin')} />
      </LinkedinShareButton>
      <Button
        type="link"
        className="flex justify-center"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          afterShare('copy_link');
        }}
      >
        <CopyOutlined className="text-[20px]"/>
      </Button>
    </div>
  );
  return (
    <div className="w-fit">
      <Popover
        content={popoverContent}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="link">
          <ShareAltOutlined />
          Share
        </Button>
      </Popover>
    </div>
  );
}