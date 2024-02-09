import { Button } from "./ui/button.client";
import { Data, DataType } from "../utils/peer";
import { downloadData, makeFullFileName } from "../utils/download";

export function PeerDataDownload({ data }: { data: Data }) {
  function handleDownload() {
    if (!data) return;

    downloadData(data);
  }

  if (data.dataType !== DataType.FILE) return null;

  return (
    <>
      <Button intent="success" onPress={handleDownload}>
        Download {makeFullFileName(data.fileName, data.fileType)}
      </Button>
    </>
  );
}
