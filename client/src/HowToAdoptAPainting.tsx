import { Anchor, Divider } from "antd";
import AdoptionForm from "./AdoptionForm";
import { HOW_TO_ADOPT_KEY } from "./constants";
import TextPage from "./TextPage";
import SelectAPainting from "./SelectAPainting";
import { getIsMobile } from "./utils";

export default function HowToAdoptAPainting() {

  // if (!areAdoptionsOpen()) {
  //   return (
  //     <div>
  //       <div className="pb-4">
  //         Thank you for your interest!
  //       </div>
  //       <AdoptionsAreCurrentlyClosed />
  //     </div>
  //   );
  // }

  const isMobile = getIsMobile();
  return (
    <div className="flex justify-center flex-wrap">
      <div className="gap-x-8 flex justify-center">
        <div style={{ width: isMobile ? 'min(650px, 100%)' : 'min(650px, 50%)'}}>
          <div id="how-to">
            <TextPage textKey={HOW_TO_ADOPT_KEY} />
          </div>
          <div className="pt-4" style={{ width: "min(650px, 100%)" }} id="painting-selection">
            <Divider className="border-slate-400" orientation="left">Select a painting</Divider>
          </div>
          <div style={{ width: "min(650px, 100%)" }}>
            <SelectAPainting />
          </div>
          <div style={{ width: "min(650px, 100%)" }} id="adoption-form">
            <Divider className="border-slate-400" orientation="left">Contact details</Divider>
          </div>
          <div className="mx-2">
            <AdoptionForm />
          </div>
        </div>
        {
          !getIsMobile() && (
            <div style={{ width: 'min(650px, 50%)'}} className="max-w-fit">
              <Anchor
                items={[
                  {
                    key: 'how-to',
                    href: '#how-to',
                    title: 'How to adopt a painting',
                  },
                  {
                    key: 'painting-selection',
                    href: '#painting-selection',
                    title: 'Select a painting',
                  },
                  {
                    key: 'adoption-form',
                    href: '#adoption-form',
                    title: 'Contact',
                  },
                  {
                    key: 'donation',
                    href: '#donation',
                    title: 'Adoption fee',
                  },
                  {
                    key: 'pickup',
                    href: '#pickup',
                    title: 'Pickup / shipping',
                  },
                  {
                    key: 'acknowledgement',
                    href: '#acknowledgement',
                    title: 'Acknowledgement',
                  },
                ]}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}