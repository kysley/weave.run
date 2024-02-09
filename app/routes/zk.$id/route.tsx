import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { PeerConnection } from "../../utils/peer";
import { PeerReceiver } from "../../components/peer-receiver.client";
import { Card } from "../../components/ui/card.client";
import { decryptMessage } from "../../utils/kdf";
import { Input } from "../../components/ui/input.client";
import { Button } from "../../components/ui/button.client";
import { Label } from "../../components/ui/label";

export default function ZeroKnowledgeId() {
  const [secret, setSecret] = useState<string>();
  const [key, setKey] = useState<string>("");
  const params = useParams();

  const { id } = params;

  async function decryptSecret() {
    if (!id || !key) return;

    const s = await decryptMessage(id, key);
    setSecret(s);
  }

  if (!id) {
    return null;
  }

  return (
    <div className="host-container">
      <Card className="sm:w-[80vw] md:w-[50vw] flex gap-10">
        <div className="flex w-full gap-4 items-end">
          <div className="flex flex-col flex-grow">
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              placeholder="1234"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <Button onPress={decryptSecret} isDisabled={!key}>
            Decrypt
          </Button>
        </div>
        {secret && <pre>{secret}</pre>}
      </Card>
    </div>
  );
}
