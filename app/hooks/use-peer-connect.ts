import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { connectionAtom, myPeerIdAtom } from "../state";
import { PeerConnection } from "../utils/peer";

export function usePeerConnect(peerId: string) {
  const myId = useAtomValue(myPeerIdAtom);
  const setConnection = useSetAtom(connectionAtom);

  useEffect(() => {
    // Not connected to peerjs ourselves yet
    if (!myId) return;
    async function connect() {
      const conn = await PeerConnection.connectPeer(peerId);
      if (conn) {
        setConnection(conn);
      }
    }
    connect();
  }, [peerId]);
}
