import { useEffect, useState } from "react";
import { DataType, PeerConnection } from "../utils/peer";
import { useAtom, useSetAtom } from "jotai";
import { connectionAtom, peerIdAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";

export function PeerReceiver({ peerId }: { peerId: string }) {
  const myId = useAtom(peerIdAtom)[0];

  const setConnection = useSetAtom(connectionAtom);

  useEffect(() => {
    async function connect() {
      const conn = await PeerConnection.connectPeer(peerId);
      setConnection(conn);
      PeerConnection.onConnectionDisconnected(peerId, () => {
        console.info(`Connection closed: ${peerId}`);
        setConnection(undefined);
        // dispatch(removeConnectionList(id));
      });
      PeerConnection.onConnectionReceiveData(peerId, (file) => {
        console.info(`Receiving file ${file.fileName} from ${peerId}`);
        if (file.dataType === DataType.FILE) {
          console.log(
            file.file || "",
            file.fileName || "fileName",
            file.fileType
          );
        }
      });
      PeerConnection.onIncomingConnection((conn) => {
        setConnection(conn);
      });
    }
    if (!myId) return;
    connect();
  }, [peerId, myId]);

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <ConnectionStatus />
    </div>
  );
}
