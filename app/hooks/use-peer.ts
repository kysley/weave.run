import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  connectionAtom,
  peerConsentAtom,
  myPeerIdAtom,
  myConsentAtom,
} from "../state";
import { MessageType, PeerConnection } from "../utils/peer";

export function usePeer() {
  const myId = useAtomValue(myPeerIdAtom);
  const [connection, setConnection] = useAtom(connectionAtom);
  const setPeerConsent = useSetAtom(peerConsentAtom);
  const setMyConsent = useSetAtom(myConsentAtom);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!myId) return;

    PeerConnection.onIncomingConnection((conn) => {
      setConnection(conn);
      // dispatch(addConnectionList(peerId));
      PeerConnection.onConnectionDisconnected(conn.peer, () => {
        setConnection(undefined);
        // dispatch(removeConnectionList(peerId));
      });
    });
  }, [myId]);

  useEffect(() => {
    if (!connection) return;
    PeerConnection.onConnectionReceiveData(connection.peer, (msg) => {
      if (msg.type === MessageType.FILE) {
        console.info(
          `Receiving file ${msg.data.fileName} from ${connection.peer}`
        );
        console.log(
          msg.data.file || "",
          msg.data.fileName || "fileName",
          msg.data.fileType
        );
      } else if (msg.type === MessageType.CONSENT_GRANT) {
        if (msg.data) {
          setPeerConsent(msg.data ? "yes" : "no");
        }
      } else if (msg.type === MessageType.CONSENT_REQUEST) {
        setMyConsent("pending");
      }
    });
  }, [connection]);
}