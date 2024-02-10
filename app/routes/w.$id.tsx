import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { PeerConnection } from "../utils/peer";
import { PeerReceiver } from "../components/peer-receiver.client";

export default function PeerId() {
  const params = useParams();

  if (!params.id) {
    return <span>loading?</span>;
  }

  return (
    <div>
      <PeerReceiver peerId={params.id} />
    </div>
  );
}
