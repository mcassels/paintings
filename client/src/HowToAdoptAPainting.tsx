import { Anchor, Col, Divider, Row } from "antd";
import AdoptionForm from "./AdoptionForm";
import { HOW_TO_ADOPT_KEY } from "./constants";
import TextPage from "./TextPage";
import SelectAPainting from "./SelectAPainting";

export default function HowToAdoptAPainting() {
  return (
    <div>
      <Row className="space-x-8">
        <Col>
          <div id="how-to">
            <TextPage textKey={HOW_TO_ADOPT_KEY} />
          </div>
          <div className="w-[650px] pt-4" id="painting-selection">
            <Divider className="border-slate-400" orientation="left">Select a painting</Divider>
          </div>
          <div className="">
            <SelectAPainting />
          </div>
          <div className="w-[650px]" id="adoption-form">
            <Divider className="border-slate-400" orientation="left">Contact details</Divider>
          </div>
          <div>
            <AdoptionForm />
          </div>
        </Col>
        <Col>
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
        </Col>
      </Row>
    </div>
  );
}