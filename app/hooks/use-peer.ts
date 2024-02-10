import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  connectionAtom,
  peerConsentAtom,
  myPeerIdAtom,
  myConsentAtom,
  peerDataAtom,
} from "../state";
import { MessageType, PeerConnection } from "../utils/peer";
import { useInternetConnection } from "./use-internet-connection";

export function usePeer() {
  const { online } = useInternetConnection();

  const myId = useAtomValue(myPeerIdAtom);
  const [connection, setConnection] = useAtom(connectionAtom);
  const setPeerConsent = useSetAtom(peerConsentAtom);
  const setMyConsent = useSetAtom(myConsentAtom);
  const setPeerData = useSetAtom(peerDataAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!myId || !online) return;

    PeerConnection.onIncomingConnection((conn) => {
      setConnection(conn);
      PeerConnection.onConnectionDisconnected(conn.peer, () => {
        setConnection(undefined);
        setPeerConsent(undefined);
      });
    });
  }, [myId, online]);

  useEffect(() => {
    if (!connection || !myId || !online) return;
    PeerConnection.onConnectionReceiveData(connection.peer, (msg) => {
      if (msg.type === MessageType.DATA) {
        console.info(
          `Receiving file ${msg.data.fileName} from ${connection.peer}`
        );

        setPeerData(msg.data);
      } else if (msg.type === MessageType.CONSENT_GRANT) {
        if (msg.data) {
          setPeerConsent(msg.data ? "yes" : "no");
        }
      } else if (msg.type === MessageType.CONSENT_REQUEST) {
        setMyConsent("pending");
      }
    });
  }, [connection, myId, online]);
}
