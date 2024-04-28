import { useState } from "react";
import { Button } from "./ui/button.client";
import { TextArea } from "./ui/input.client";
import { Text } from "react-aria-components";
import { encryptMessage } from "../utils/kdf";
import { copyTextToClipboard } from "../utils/copy";
import { Select } from "./ui/select";
import { Label } from "./ui/label";
import { Link } from "@remix-run/react";
import { WeaveBranding } from "./weave-info";
import { Card } from "./ui/card.client";

export function ShareSecret() {
  const [secret, setSecret] = useState("");
  const [sig, setSig] = useState(() => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < 4; i++) {
      randomNumbers.push(Math.floor(Math.random() * 10));
    }
    return randomNumbers.join("");
  });

  async function handleCopy() {
    const enc = await encryptMessage(secret, sig);
    copyTextToClipboard(`${window.location.origin}/zk/${enc}`);
  }

  return (
    <Card className="sm:w-[80vw] md:w-[50vw] flex gap-10">
      <div className="flex flex-col w-full gap-4">
        <Button variant="outline" className="self-start" asChild>
          <Link to="/">Back</Link>
        </Button>
        <div className="flex flex-grow gap-4 items-end">
          <pre className="bg-zinc-700 rounded py-1 px-2">
            <Text>secret: {sig}</Text>
          </pre>
          <div>
            <Label htmlFor="duration">Expiry</Label>
            <Select id="duration" disabled>
              <option value={5}>5 minutes</option>
              <option value={60}>1 hour</option>
            </Select>
          </div>
        </div>
        <TextArea
          onChange={(e) => setSecret(e.target.value)}
          value={secret}
          className="min-h-[200px]"
        />
        <Button className="self-end" onPress={handleCopy}>
          Copy share link
        </Button>
      </div>
    </Card>
  );
}
