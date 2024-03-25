import AdoptionForm from "./AdoptionForm";
import { HOW_TO_ADOPT_KEY } from "./constants";
import TextPage from "./TextPage";

export default function HowToAdoptAPainting() {
  return (
    <div>
      <TextPage textKey={HOW_TO_ADOPT_KEY} />
      <AdoptionForm />
    </div>
  );
}