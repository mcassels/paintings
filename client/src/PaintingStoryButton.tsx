import { useState } from "react";
import { ArchivePainting } from "./archiveTypes";
import { Painting } from "./types";
import { Button, Modal } from "antd";
import { reportPaintingButtonClick } from "./utils";
import { ReadOutlined } from "@ant-design/icons";
import Markdown from "react-markdown";

export function PaintingStoryButton(props: { painting: Painting| ArchivePainting | undefined }) {
  const { painting } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!painting || !painting.story) {
    return null;
  }
  return (
    <div className="w-fit">
      <Button type="link" onClick={() => {
        setIsModalOpen(true);
        reportPaintingButtonClick('read_story', painting.id);
      }}>
        <ReadOutlined />
        Story
      </Button>
      <Modal
        title={`Story of "${painting.title}"`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="submit" type="primary" onClick={() => setIsModalOpen(false)}>
            Done
          </Button>,
        ]}
      >
        <Markdown>{painting.story}</Markdown>
      </Modal>
    </div>
  );
}