import { useCurrentShow } from "../hooks/useCurrentShow";
import { usePaintings } from "../hooks/usePaintings";

export default function CurrentShow() {
  const show = useCurrentShow();
  return (<>Show</>);
}