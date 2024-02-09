import { useAtomValue } from "jotai";
import { peerConsentAtom } from "../state";
import { usePeerTransfer } from "../hooks/use-peer-transfer";
import { Button } from "./ui/button.client";
import { useEffect, useState } from "react";

export function TransferButton({ data }: { data?: string | File }) {
  const [sent, setSent] = useState(false);
  const { sendToPeer } = usePeerTransfer();
  const peerConsent = useAtomValue(peerConsentAtom);

  useEffect(() => {
    setSent(false);
  }, [data]);

  const hasConsent = peerConsent === "yes";

  const buttonCopy = sent
    ? "Sent"
    : data instanceof File
    ? "Send file"
    : "Send secret";

  const requiresConsent = data instanceof File;

  return (
    <Button
      onPress={() => {
        if (!data) return;
        sendToPeer(data);
        setSent(true);
      }}
      className="w-full"
      intent={
        sent
          ? "success"
          : !requiresConsent || hasConsent
          ? undefined
          : "warning"
      }
      isDisabled={(requiresConsent && !hasConsent) || !data}
    >
      {requiresConsent && !hasConsent
        ? "Waiting for peer to accept"
        : buttonCopy}
    </Button>
  );
}
