import { useAtom, useAtomValue } from "jotai";
import { peerDataAtom } from "../state";
import { Button } from "./ui/button.client";
import { DataType } from "../utils/peer";
import { downloadData, makeFullFileName } from "../utils/download";

export function PeerDataInfo() {
  const data = useAtomValue(peerDataAtom);

  function handleDownload() {
    if (!data) return;

    downloadData(data);
  }

  if (!data) return null;

  // Need to support secrets next
  if (data.dataType !== DataType.FILE) return null;

  return (
    <>
      <Button intent="success" onPress={handleDownload}>
        Download {makeFullFileName(data.fileName, data.fileType)}
      </Button>
    </>
  );
}
