import { useAtom, useAtomValue } from "jotai";
import { connectionAtom } from "../state";
import { Badge } from "./ui/badge.client";

export function ConnectionStatus() {
  const connection = useAtomValue(connectionAtom);

  if (!connection)
    return (
      <Badge intent="warning">
        <code>Waiting for peer to connect</code>
      </Badge>
    );

  if (connection.peer)
    return (
      <Badge intent="success">
        <code>Connected</code>
      </Badge>
    );

  return null;
}
