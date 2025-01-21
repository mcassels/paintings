import { NavigateFunction, Location } from "react-router-dom";

const CONTACT_US_PARAM_KEY = 'contact_us';

export function isContactUsModalOpen(location: Location): boolean {
  const params = new URLSearchParams(location.search);
  return params.get(CONTACT_US_PARAM_KEY) === 'true';
}

function setContactUsModalOpen(
  location: Location,
  navigate: NavigateFunction,
  open: boolean,
): void {
  const searchParams = new URLSearchParams(location.search);
  if (open) {
    searchParams.set(CONTACT_US_PARAM_KEY, 'true');
  } else {
    searchParams.delete(CONTACT_US_PARAM_KEY);
  }
  navigate({
    search: searchParams.toString(),
  });
}

export function openContactUsModal(location: Location, navigate: NavigateFunction): void {
  setContactUsModalOpen(location, navigate, true);
}
export function closeContactUsModal(location: Location, navigate: NavigateFunction): void {
  setContactUsModalOpen(location, navigate, false);
}