import { useEffect, useState } from "react";
import { DataType, MessageType, PeerConnection } from "../utils/peer";
import { useAtom } from "jotai";
import { connectionAtom, peerIdAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Button } from "./ui/button.client";
import { Card } from "./ui/card.client";
import { Badge } from "./ui/badge.client";
import { copyTextToClipboard } from "../utils/copy";

export function PeerHost() {
  const [peerConsent, setPeerConsent] = useState<"pending" | "yes" | "no">(
    "pending"
  );
  const myId = useAtom(peerIdAtom)[0];
  const [files, setFiles] = useState<FileList | null>();
  const [sig, setSig] = useState(() => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < 4; i++) {
      randomNumbers.push(Math.floor(Math.random() * 10));
    }
    return randomNumbers;
  });

  const [connection, setConnection] = useAtom(connectionAtom);

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

      PeerConnection.onConnectionReceiveData(conn.peer, (msg) => {
        if (msg.type === MessageType.SEND_FILE) {
          console.info(`Receiving file ${msg.data.fileName} from ${conn.peer}`);
          console.log(
            msg.data.file || "",
            msg.data.fileName || "fileName",
            msg.data.fileType
          );
        } else if (msg.type === MessageType.SEND_GRANT) {
          if (msg.data) {
            setPeerConsent("yes");
            return;
          }
          setPeerConsent("no");
        }
      });
    });
  }, [myId]);

  async function request() {
    if (!files || !connection) return;

    await PeerConnection.sendConnection(connection.peer, {
      type: MessageType.SEND_REQUEST,
      data: undefined,
    });
  }

  async function send() {
    if (!files || !connection) return;

    const file = files[0];
    const blob = new Blob([file], { type: file.type });

    PeerConnection.sendConnection(connection.peer, {
      type: MessageType.SEND_FILE,
      data: {
        dataType: DataType.FILE,
        file: blob,
        fileName: file.name,
        fileType: file.type,
      },
    });

    // PeerConnection.
    console.log("aaa");
  }

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <Card className="w-[30vw] flex gap-10">
        <div className="flex justify-between w-full">
          <ConnectionStatus />
          <code className="text-2xl">{sig.map((n) => n).join("")}</code>
        </div>
        <Button
          variant="tertiary"
          onClick={() =>
            copyTextToClipboard(`${window.location.href}w/${myId}`)
          }
        >
          Copy invite link
        </Button>
        {/* <a
          href={`${window.location.href}w/${myId}`}
          target="_blank"
          rel="noreferrer"
        >
          open in tab
        </a> */}
        {connection && (
          <>
            <input
              type="file"
              onChange={(e) => {
                request();
                setFiles(e.target.files);
              }}
            />
            {peerConsent === "pending" && (
              <Badge intent="info">waiting for peer consent</Badge>
            )}
            {files?.length > 0 && peerConsent === "yes" && (
              <Button onClick={send} className="w-full">
                send
              </Button>
            )}
          </>
        )}
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
