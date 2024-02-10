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
import { Link, NavLink } from "@remix-run/react";
import { Spinner } from "./ui/spinner";

export function PeerHost() {
  usePeer();
  const { requestPeerConsent } = usePeerTransfer();

  const [zkMode, setZkMode] = useState(false);
  const [data, setData] = useAtom(transferDataAtom);
  const myId = useAtomValue(myPeerIdAtom);
  const connection = useAtomValue(connectionAtom);

  const [tab, setTab] = useState("file");

  useEffect(() => {
    // Consent not required for secrets since its not a download
    if (data && data instanceof File) {
      requestPeerConsent();
    }
  }, [data]);

  // if (!myId) return <span>connecting...</span>;

  return (
    <Card className="sm:w-[80vw] md:w-[50vw] flex gap-10">
      {!zkMode && (
        <div className="flex justify-between w-full">
          <ConnectionStatus />
        </div>
      )}
      {!connection && (
        <>
          <Button
            variant="tertiary"
            isDisabled={!myId}
            onPress={() =>
              copyTextToClipboard(`${window.location.href}w/${myId}`)
            }
          >
            {myId ? (
              "Copy session invite"
            ) : (
              <>
                Connecting
                <Spinner className="w-[20px]" />
              </>
            )}
          </Button>
          <Link to={"/zk"}>
            <Button onPress={() => setZkMode(true)}>
              Share a zero-knowledge secret
            </Button>
          </Link>
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
  );
}
