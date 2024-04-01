import { Anchor, Col, Row } from "antd";
import AdoptionForm from "./AdoptionForm";
import { HOW_TO_ADOPT_KEY } from "./constants";
import TextPage from "./TextPage";
import SelectAPainting from "./SelectAPainting";

export default function HowToAdoptAPainting() {
  return (
    <div>
      <Row>
        <Col span={16}>
          <div id="how-to">
            <TextPage textKey={HOW_TO_ADOPT_KEY} />
          </div>
          <div id="painting-selection">
            <SelectAPainting />
          </div>
          <div id="adoption-form">
            <AdoptionForm />
          </div>
        </Col>
        <Col span={8}>
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
                title: 'Painting selection',
              },
              {
                key: 'adoption-form',
                href: '#adoption-form',
                title: 'Adoption form',
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}