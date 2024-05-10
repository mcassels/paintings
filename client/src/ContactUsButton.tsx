import { Button } from 'antd';
import { openContactUsModal } from './contactus.utils';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ContactUsButton() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Button type="link" onClick={() => openContactUsModal(location, navigate)}>Contact us</Button>
  );
}