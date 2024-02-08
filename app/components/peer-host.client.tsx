import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom, useAtomValue } from "jotai";
import { connectionAtom, myPeerIdAtom, peerConsentAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Button } from "./ui/button.client";
import { Card } from "./ui/card.client";
import { copyTextToClipboard } from "../utils/copy";
import { usePeer } from "../hooks/use-peer";
import { FileTabPanel, TransferTypeTabs } from "./transfer-type-tabs";

export function PeerHost() {
  usePeer();

  const myId = useAtomValue(myPeerIdAtom);
  const [peerConsent, setPeerConsent] = useAtom(peerConsentAtom);

  const connection = useAtomValue(connectionAtom);

  const [files, setFiles] = useState<File>();
  const [sig, setSig] = useState(() => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < 4; i++) {
      randomNumbers.push(Math.floor(Math.random() * 10));
    }
    return randomNumbers;
  });

  useEffect(() => {
    if (files) {
      request();
    }
  }, [files]);

  async function request() {
    // Not ready to ask for consent
    if (!files || !connection) return;

    // Peer has already consent, don't ask again
    if (peerConsent !== "yes") {
      console.log("requesting consent");

      await PeerConnection.sendConnection(connection.peer, {
        type: MessageType.CONSENT_REQUEST,
        data: undefined,
      });

      setPeerConsent("pending");
    }
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
          </div>
          <Button
            variant="tertiary"
            onPress={() =>
              copyTextToClipboard(`${window.location.href}w/${myId}`)
            }
          >
            Copy invite link
          </Button>
          {/* <code className="text-2xl">{sig.map((n) => n).join("")}</code> */}
        </div>
        {connection && (
          <>
            <TransferTypeTabs>
              <FileTabPanel
                onFileChange={(files) => {
                  setFiles(files[0]);
                  console.log(files);
                }}
              />
            </TransferTypeTabs>

            {files && (
              <Button
                onPress={send}
                className="w-full"
                intent={hasConsent ? undefined : "warning"}
                isDisabled={!hasConsent}
              >
                {hasConsent ? "Send file" : "Waiting for peer to accept"}
              </Button>
            )}
          </>
        )}
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
