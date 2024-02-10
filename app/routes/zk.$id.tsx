import { useParams } from "@remix-run/react";
import { useState } from "react";
import { Card } from "../components/ui/card.client";
import { decryptMessage } from "../utils/kdf";
import { Input } from "../components/ui/input.client";
import { Button } from "../components/ui/button.client";
import { Label } from "../components/ui/label";
import { Text } from "react-aria-components";

export default function ZeroKnowledgeId() {
  const [secret, setSecret] = useState<string>();
  const [key, setKey] = useState<string>("");
  const [error, setError] = useState<string>();
  const params = useParams();

  const { id } = params;

  async function decryptSecret() {
    if (!id || !key) return;

    try {
      const s = await decryptMessage(id, key);
      setSecret(s);
      setError("");
    } catch (e) {
      setError("Malformed key or expired secret.");
    }
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
              disabled={!!secret}
            />
          </div>
          <Button onPress={decryptSecret} isDisabled={!key || !!secret}>
            Decrypt
          </Button>
        </div>
        {error && <Text className="font-bold">{error}</Text>}
        {secret && (
          <pre className="min-h-[200px] bg-zinc-800 w-full rounded p-2">
            {secret}
          </pre>
        )}
      </Card>
    </div>
  );
}
