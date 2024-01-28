import { useEffect } from "react";
import { PeerConnection } from "../utils/peer";

export function PeerReceiver({ peerId }: { peerId: string }) {
  useEffect(() => {
    async function connect() {
      const myId = await PeerConnection.startPeerSession();
      PeerConnection.connectPeer(peerId);
    }
    connect();
  }, [peerId]);

  return <span>hello peerreceiver</span>;
}
