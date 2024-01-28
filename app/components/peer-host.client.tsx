import { useEffect, useState } from "react";
import { DataType, PeerConnection } from "../utils/peer";

export function PeerHost() {
  const [myId, setMyId] = useState<string>();
  const [theirId, setTheirId] = useState<string>();
  const [files, setFiles] = useState<FileList | null>();

  async function connect() {
    const id = await PeerConnection.startPeerSession();

    PeerConnection.onIncomingConnection((conn) => {
      console.log("peer?", conn.connectionId);
      setTheirId(conn.connectionId);
    });

    setMyId(id);
  }

  async function send() {
    if (!files || !theirId) return;

    const file = files[0];
    const blob = new Blob([file], { type: file.type });

    PeerConnection.sendConnection(theirId, {
      dataType: DataType.FILE,
      file: blob,
      fileName: file.name,
      fileType: file.type,
    });
  }

  // useEffect(() => {
  //   async function init() {
  //   }

  //   if (!myId) {
  //     init();
  //   }
  // }, []);

  return (
    <div>
      {!myId && <button onClick={connect}>connect</button>}
      <span>your peer id: {myId || "not connected..."}</span>
      {myId && (
        <>
          <a href={`${window.location.href}w/${myId}`} target="_blank">
            open in tab
          </a>
          <input type="file" onChange={(e) => setFiles(e.target.files)} />
          {files?.length > 0 && <button onClick={send}>send</button>}
        </>
      )}
    </div>
  );
}
