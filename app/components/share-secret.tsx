import { useState } from "react";
import { Button } from "./ui/button.client";
import { TextArea } from "./ui/input.client";
import { Text } from "react-aria-components";
import { encryptMessage } from "../utils/kdf";
import { copyTextToClipboard } from "../utils/copy";

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
    const enc = await encryptMessage(secret, "123");
    copyTextToClipboard(`${window.location.origin}/zk/${enc}`);
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <Text>secret: {sig}. Valid for: 1 hour</Text>
      <TextArea onChange={(e) => setSecret(e.target.value)} value={secret} />
      <Button className="self-end" onPress={handleCopy}>
        Copy secret link
      </Button>
    </div>
  );
}
