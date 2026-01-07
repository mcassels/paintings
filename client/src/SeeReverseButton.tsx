import { useState } from "react";
import { ArchivePainting } from "./archiveTypes";
import { Painting } from "./types";
import { Button, Image, Modal } from "antd";
import { reportPaintingButtonClick } from "./utils";
import { RetweetOutlined } from "@ant-design/icons";

export function SeeReverseButton(props: { painting: Painting|ArchivePainting; }) {
  const { painting } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal
        title={`"${painting.title}" reverse`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        <Image
          src={painting.backPhotoUrl}
          preview={false}
          loading='lazy'
        />
      </Modal>
      <Button
        type="link"
        onClick={() => {
          setIsModalOpen(true)
          reportPaintingButtonClick('see_painting_back', painting.id);
        }}
      >
        <RetweetOutlined />
        See the back
      </Button>
    </>
  );
}