import { Button, Modal } from 'antd';
import { useState } from 'react';

const TERMS_ACCEPTED_KEY = 'gordaneer_archive_terms_accepted';

export default function TermsAndConditionsModal() {
  const [open, setOpen] = useState(() => {
    return localStorage.getItem(TERMS_ACCEPTED_KEY) !== 'true';
  });

  function handleAgree() {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      closable={false}
      maskClosable={false}
      footer={null}
      width="min(600px, 100%)"
      centered
    >
      <div className="flex flex-col items-center text-center px-4 py-2">
        <div className="text-base font-semibold mb-1">The James Gordaneer Collection, Catalogue Raisonné, and Archive</div>
        <div className="text-lg font-bold mb-4">Terms & Conditions</div>
        <p className="text-sm text-gray-700 mb-6 leading-relaxed text-left">
          Documents, photographs, artwork, and other materials held by the Estate of James Gordaneer are protected by copyright and require permission for use. By accessing the digital collections of the James Gordaneer archive, you accept and acknowledge the terms set forth in our Terms & Conditions. Any unauthorized usage of materials accessed from the digital collections of the Estate of James Gordaneer is strictly prohibited.
        </p>
        <Button onClick={handleAgree} size="large" className="border-black text-black bg-white hover:!bg-gray-100 hover:!text-black hover:!border-black">
          Yes, I agree
        </Button>
      </div>
    </Modal>
  );
}
