import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom, useSetAtom } from "jotai";
import { connectionAtom, peerIdAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Card } from "./ui/card.client";
import { Button } from "./ui/button.client";

export function PeerReceiver({ peerId }: { peerId: string }) {
  const [consent, setConsent] = useState<"pending" | "yes" | "no">();
  const myId = useAtom(peerIdAtom)[0];

  const [connection, setConnection] = useAtom(connectionAtom);

  async function consentToPeer() {
    if (!connection) return;

    await PeerConnection.sendConnection(connection.peer, {
      type: MessageType.SEND_GRANT,
      data: true,
    });
    setConsent("yes");
  }

  useEffect(() => {
    if (!connection) return;
    PeerConnection.onConnectionReceiveData(peerId, (msg) => {
      if (msg.type === MessageType.SEND_FILE) {
        const { data: file } = msg;
        console.info(`Receiving file ${file.fileName} from ${peerId}`);
        console.log(
          file.file || "",
          file.fileName || "fileName",
          file.fileType
        );
      } else if (msg.type === MessageType.SEND_REQUEST) {
        setConsent("pending");
      }
    });
    // PeerConnection.onConnectionReceiveData(peerId, (msg) => {
    //   if (msg.type === MessageType.SEND_FILE) {
    //     const { data: file } = msg;
    //     console.info(`Receiving file ${file.fileName} from ${peerId}`);
    //     console.log(
    //       file.file || "",
    //       file.fileName || "fileName",
    //       file.fileType
    //     );
    //   } else if (msg.type === MessageType.SEND_REQUEST) {
    //     setConsent("pending");
    //   }
    // });
    PeerConnection.onIncomingConnection((conn) => {
      console.log(conn);
      setConnection(conn);
      PeerConnection.onConnectionDisconnected(peerId, () => {
        console.info(`Connection closed: ${peerId}`);
        setConnection(undefined);
      });
    });
  }, [connection]);

  useEffect(() => {
    async function connect() {
      const conn = await PeerConnection.connectPeer(peerId);
      setConnection(conn);

      console.log(conn);
    }
    if (!myId) return;
    connect();
  }, [peerId, myId]);

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <Card className="w-[30vw] flex gap-10">
        <div className="flex justify-between w-full">
          <ConnectionStatus />
          {consent === "pending" && (
            <>
              <Button onClick={consentToPeer} intent="danger">
                No
              </Button>
              <Button onClick={consentToPeer}>Yes</Button>
            </>
          )}
        </div>
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
