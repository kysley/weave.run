import { Data, DataType } from "../utils/peer";

export function PeerSecretDisplay({ data }: { data: Data }) {
  if (data.dataType !== DataType.OTHER) return null;

  return <code>{data.message}</code>;
}
