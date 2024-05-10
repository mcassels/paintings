import { useLocation, useNavigate } from "react-router-dom";
import { openContactUsModal } from "./contactus.utils";

function AdoptionsAreCurrentlyClosed() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
      <p className="m-0">Adoptions are currently closed.<button onClick={() => openContactUsModal(location, navigate)} className="cursor-pointer bg-transparent border-none text-inherit font-bold hover:text-[#1677ff]">Contact us</button>for more information about the project.</p>
  );
}

export default AdoptionsAreCurrentlyClosed;