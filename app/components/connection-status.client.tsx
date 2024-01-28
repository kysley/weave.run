import { useAtom } from "jotai";
import { connectionAtom } from "../state";

export function ConnectionStatus() {
  const connection = useAtom(connectionAtom)[0];

  if (!connection) return <code>{">> waiting for peer"}</code>;

  if (connection.peer) return <code>{"> connected"}</code>;

  return null;
}
