import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { connectionAtom, myConsentAtom, myPeerIdAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Card } from "./ui/card.client";
import { Button } from "./ui/button.client";
import { usePeer } from "../hooks/use-peer";
import { usePeerConnect } from "../hooks/use-peer-connect";

export function PeerReceiver({ peerId }: { peerId: string }) {
  usePeer();
  usePeerConnect(peerId);

  const myId = useAtomValue(myPeerIdAtom);
  const [myConsent, setMyConsent] = useAtom(myConsentAtom);

  const [connection, setConnection] = useAtom(connectionAtom);

  async function consentToPeer() {
    if (!connection) return;

    await PeerConnection.sendConnection(connection.peer, {
      type: MessageType.CONSENT_GRANT,
      data: true,
    });
    setMyConsent("yes");
  }

  useEffect(() => {
    async function connect() {
      const conn = await PeerConnection.connectPeer(peerId);
      setConnection(conn);
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
          {myConsent === "pending" && (
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
