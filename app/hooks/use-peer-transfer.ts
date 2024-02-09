import { useAtom, useAtomValue } from "jotai";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { connectionAtom, peerConsentAtom } from "../state";

export function usePeerTransfer() {
  const connection = useAtomValue(connectionAtom);
  const [peerConsent, setPeerConsent] = useAtom(peerConsentAtom);

  async function requestPeerConsent() {
    // Not ready to ask for consent
    if (!connection) return;

    // Peer has already consent, don't ask again
    if (peerConsent !== "yes") {
      await PeerConnection.sendConnection(connection.peer, {
        type: MessageType.CONSENT_REQUEST,
        data: undefined,
      });

      setPeerConsent("pending");
    }
  }

  async function sendToPeer(data: File | string) {
    if (!connection) {
      throw new Error("Cannot transfer without an active connection");
    }

    if (data instanceof File) {
      const blob = new Blob([data], { type: data.type });
      await PeerConnection.sendConnection(connection.peer, {
        type: MessageType.DATA,
        data: {
          dataType: DataType.FILE,
          file: blob,
          fileName: data.name,
          fileType: data.type,
        },
      });
    } else {
      await PeerConnection.sendConnection(connection.peer, {
        type: MessageType.DATA,
        data: {
          dataType: DataType.OTHER,
          message: data,
        },
      });
    }
  }

  return { sendToPeer, requestPeerConsent };
}
