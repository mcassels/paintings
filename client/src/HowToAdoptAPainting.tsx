import { Anchor, Col, Row } from "antd";
import AdoptionForm from "./AdoptionForm";
import { HOW_TO_ADOPT_KEY } from "./constants";
import TextPage from "./TextPage";

export default function HowToAdoptAPainting() {
  return (
    <div>
      <Row>
        <Col span={16}>
          <div id="how-to">
            <TextPage textKey={HOW_TO_ADOPT_KEY} />
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