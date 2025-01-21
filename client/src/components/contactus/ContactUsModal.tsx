import emailjs from '@emailjs/browser';
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { closeContactUsModal, isContactUsModalOpen } from './contactus.utils';

interface ContactUsFormInputs {
  name: string;
  email: string;
  message: string;
}

export default function ContactUsModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form] = Form.useForm<ContactUsFormInputs>();

  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then((vals) => {
        // Not sure why this is passing validation when they are all unset...
        setSubmittable(!!(vals.name && vals.email && vals.message));
      })
      .catch(() => setSubmittable(false));
  }, [form, values]);

  function onFormSubmitError() {
    window.alert("Error submitting form! Please contact gordaneer@gmail.com");
    closeContactUsModal(location, navigate);
  }

  async function onSubmit(data: ContactUsFormInputs) {
    const serviceId = process.env.REACT_APP_EMAILJS_CONTACT_US_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_CONTACT_US_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_CONTACT_US_PUBLIC_KEY;

    // Keys must correspond to template fields set up in emailjs template
    const emailTemplate = {
      name: data.name,
      email: data.email,
      message: data.message,
    };
    if (!serviceId || !templateId) {
      onFormSubmitError();
      return;
    }
    try {
      const res = await emailjs.send(serviceId, templateId, emailTemplate, {
        publicKey,
      });
      if (res.status < 200 || res.status >= 300) {
        onFormSubmitError();
      } else {
        window.alert("Thank you! Your message has been sent.");
        closeContactUsModal(location, navigate);
      }
    } catch (e) {
      console.error(e);
      onFormSubmitError();
    }
  }

  return (
    <div>
      <Modal
        title="Contact us"
        open={isContactUsModalOpen(location)}
        onCancel={() => closeContactUsModal(location, navigate)}
        footer={null}
        width="min(800px, 100%)"
      >
        <Form
          className="m-10"
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{}}
        >
          <Form.Item
            name="name"
            label="Your Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'not a valid email',
              },
              {
                required: true,
                message: 'Email is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            className="contact-message"
            rules={[{ required: true, message: 'Message is required' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={!submittable}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}