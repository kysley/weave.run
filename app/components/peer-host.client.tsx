import { useEffect, useState } from "react";
import { DataType, PeerConnection } from "../utils/peer";
import { useAtom, useSetAtom } from "jotai";
import { connectionAtom, peerIdAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";

export function PeerHost() {
  const myId = useAtom(peerIdAtom)[0];
  const [files, setFiles] = useState<FileList | null>();

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
      PeerConnection.onConnectionReceiveData(conn.peer, (file) => {
        console.info(`Receiving file ${file.fileName} from ${conn.peer}`);
        if (file.dataType === DataType.FILE) {
          console.log(
            file.file || "",
            file.fileName || "fileName",
            file.fileType
          );
        }
      });
    });
  }, [myId]);

  async function send() {
    if (!files || !connection) return;

    const file = files[0];
    const blob = new Blob([file], { type: file.type });

    PeerConnection.sendConnection(connection.peer, {
      dataType: DataType.FILE,
      file: blob,
      fileName: file.name,
      fileType: file.type,
    });
    console.log("aaa");
  }

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <ConnectionStatus />
      <code>{myId}</code>
      <a
        href={`${window.location.href}w/${myId}`}
        target="_blank"
        rel="noreferrer"
      >
        open in tab
      </a>
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      {files?.length > 0 && <button onClick={send}>send</button>}
    </div>
  );
}
