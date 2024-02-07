import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom, useAtomValue } from "jotai";
import { connectionAtom, myPeerIdAtom, peerConsentAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Button } from "./ui/button.client";
import { Card } from "./ui/card.client";
import { Badge } from "./ui/badge.client";
import { copyTextToClipboard } from "../utils/copy";
import { usePeer } from "../hooks/use-peer";
import { TransferTypeTabs } from "./transfer-type-tabs";
import { DragAndDrop } from "./drag-and-drop";

export function PeerHost() {
  usePeer();

  const myId = useAtomValue(myPeerIdAtom);
  const peerConsent = useAtomValue(peerConsentAtom);

  const connection = useAtomValue(connectionAtom);

  const [files, setFiles] = useState<File>();
  const [sig, setSig] = useState(() => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < 4; i++) {
      randomNumbers.push(Math.floor(Math.random() * 10));
    }
    return randomNumbers;
  });

  async function request() {
    if (!files || !connection) return;

    await PeerConnection.sendConnection(connection.peer, {
      type: MessageType.CONSENT_REQUEST,
      data: undefined,
    });
  }

  async function send() {
    if (!files || !connection) return;

    const file = files;
    const blob = new Blob([file], { type: file.type });

    PeerConnection.sendConnection(connection.peer, {
      type: MessageType.FILE,
      data: {
        dataType: DataType.FILE,
        file: blob,
        fileName: file.name,
        fileType: file.type,
      },
    });
  }

  if (!myId) return <span>connecting...</span>;

  const hasConsent = peerConsent === "yes";

  return (
    <div className="host-container">
      <Card className="sm:w-[80vw] md:w-[50vw] flex gap-10">
        <div className="flex justify-between w-full">
          <div>
            <ConnectionStatus />
            {files && peerConsent === "pending" && (
              <Badge intent="info">Waiting for peer consent</Badge>
            )}
          </div>
          <Button
            variant="tertiary"
            onClick={() =>
              copyTextToClipboard(`${window.location.href}w/${myId}`)
            }
          >
            Copy invite link
          </Button>
          {/* <code className="text-2xl">{sig.map((n) => n).join("")}</code> */}
        </div>
        <TransferTypeTabs />
        {connection && (
          <>
            <DragAndDrop onFileChange={(files) => setFiles(files[0])} />

            {files && (
              // <Button onClick={send} className="w-full" disabled={!hasConsent}>
              <Button onClick={send} className="w-full">
                {hasConsent ? "Send to peer" : "Waiting for peer consent"}
              </Button>
            )}
          </>
        )}
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
