import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  connectionAtom,
  myConsentAtom,
  myPeerIdAtom,
  peerDataAtom,
} from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Card } from "./ui/card.client";
import { Button } from "./ui/button.client";
import { usePeer } from "../hooks/use-peer";
import { usePeerConnect } from "../hooks/use-peer-connect";
import { Text } from "react-aria-components";
import { Badge } from "./ui/badge.client";
import { Spinner } from "./ui/spinner";

export function PeerReceiver({ peerId }: { peerId: string }) {
  usePeer();
  usePeerConnect(peerId);

  const myId = useAtomValue(myPeerIdAtom);
  const peerData = useAtomValue(peerDataAtom);
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

  const isWaitingForHost =
    (!myConsent && !peerData) || (myConsent === "yes" && !peerData);

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <Card className="w-[30vw] flex gap-10">
        <div className="flex justify-between w-full flex-col gap-4">
          <div className="flex gap-2">
            <ConnectionStatus />
            {myConsent === "yes" && <Badge>Waiting for file</Badge>}
          </div>
          <div>
            {myConsent === "pending" && (
              <div className="flex flex-col w-full gap-2">
                <Text className="font-bold">Accept file from peer?</Text>
                <div className="flex gap-4">
                  <Button onPress={consentToPeer} intent="danger">
                    No
                  </Button>
                  <Button onPress={consentToPeer} className="flex-grow">
                    Yes
                  </Button>
                </div>
              </div>
            )}
            {isWaitingForHost && (
              <div className="flex flex-col justify-center gap-2">
                <Spinner className="justify-center" />
                <Text className="text-center">Waiting for host...</Text>
              </div>
            )}
          </div>
        </div>
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
