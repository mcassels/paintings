import { useEffect } from "react";

export function NewsletterSignup() {
  const formId = process.env.REACT_APP_SENDER_FORM_ID;

  useEffect(() => {
    function render() {
      (window as any)?.senderForms?.render(formId);
    }

    if (!(window as any)?.senderFormsLoaded) {
      window.addEventListener("onSenderFormsLoaded", render, { once: true });
    } else {
      render();
    }

    return () => {
      (window as any)?.senderForms?.destroy?.(formId);
    };
  }, [formId]);

  return (
    <div
      style={{ textAlign: "left" }}
      className="sender-form-field"
      data-sender-form-id={formId}
    />
  );
}