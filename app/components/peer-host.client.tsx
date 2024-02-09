import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { connectionAtom, myPeerIdAtom, transferDataAtom } from "../state";
import { ConnectionStatus } from "./connection-status.client";
import { Button } from "./ui/button.client";
import { Card } from "./ui/card.client";
import { copyTextToClipboard } from "../utils/copy";
import { usePeer } from "../hooks/use-peer";
import {
  FileTabPanel,
  SecretTabPanel,
  TransferTypeTabs,
} from "./transfer-type-tabs";
import { TransferButton } from "./transfer-button";
import { usePeerTransfer } from "../hooks/use-peer-transfer";
import { ShareSecret } from "./share-secret";

export function PeerHost() {
  usePeer();
  const { requestPeerConsent } = usePeerTransfer();

  const [zkMode, setZkMode] = useState(false);
  const [data, setData] = useAtom(transferDataAtom);
  const myId = useAtomValue(myPeerIdAtom);
  const connection = useAtomValue(connectionAtom);

  const [tab, setTab] = useState("file");
  // const [sig, setSig] = useState(() => {
  //   const randomNumbers: number[] = [];
  //   for (let i = 0; i < 4; i++) {
  //     randomNumbers.push(Math.floor(Math.random() * 10));
  //   }
  //   return randomNumbers;
  // });

  useEffect(() => {
    // Consent not required for secrets since its not a download
    if (data && data instanceof File) {
      requestPeerConsent();
    }
  }, [data]);

  if (!myId) return <span>connecting...</span>;

  return (
    <div className="host-container">
      <Card className="sm:w-[80vw] md:w-[50vw] flex gap-10">
        <div className="flex justify-between w-full">
          {!zkMode && <ConnectionStatus />}
          {/* <code className="text-2xl">{sig.map((n) => n).join("")}</code> */}
        </div>
        {!connection && (
          <>
            {zkMode ? (
              <ShareSecret />
            ) : (
              <>
                <Button
                  variant="tertiary"
                  onPress={() =>
                    copyTextToClipboard(`${window.location.href}w/${myId}`)
                  }
                >
                  Copy session invite
                </Button>
                <Button onPress={() => setZkMode(true)}>
                  Share a zero-knowledge secret
                </Button>
              </>
            )}
          </>
        )}
        {connection && (
          <>
            <TransferTypeTabs
              onSelectionChange={(key) => {
                setTab(key as string);
                setData(undefined);
              }}
              selectedKey={tab}
            >
              <FileTabPanel
                onFileChange={(files) => {
                  console.log(files);
                  setData(files[0]);
                }}
              />
              <SecretTabPanel
                value={data as string}
                onChange={(e) => {
                  setData(e.target.value);
                }}
              />
            </TransferTypeTabs>

            {(data || tab === "secret") && <TransferButton data={data} />}
          </>
        )}
        <span className="text-zinc-700 pt-5">{myId}</span>
      </Card>
    </div>
  );
}
