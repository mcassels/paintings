import { captureMessage } from "@sentry/react";

interface LoadingErrorProps {
  message: string;
}

export default function LoadingError(props: LoadingErrorProps) {
  const { message: errorMsg } = props;

  let message = errorMsg;

  const userAgent = window.navigator.userAgent;
  if (userAgent.includes('Googlebot') || userAgent.includes('Google-InspectionTool')) {
    // TODO: This is a hack because the google web crawler gets an error when trying to retrieve airtable data.
    // The solution is to set up an API proxy to handle and cache the airtable results.
    // This is a quick fix for now to improve the google results.
    message = 'Gordaneer Painting Adoption Project: A fundraiser for Victoria Visual Arts Legacy Society. Supporting the James Gordaneer Legacy Award, given annually to a Camosun College Visual Arts student.';
  } else {
    const errorReportMsg = `Loading error: ${errorMsg}`;
    if (process.env.REACT_APP_DEACTIVATE_SENTRY !== 'true') {
      captureMessage(errorReportMsg);
    } else {
      console.error(errorReportMsg);
    }
  }

  return (
    <div className="loading">{message}</div>
  );
}