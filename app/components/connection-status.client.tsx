import { useAtom, useAtomValue } from "jotai";
import { connectionAtom } from "../state";
import { Badge } from "./ui/badge.client";

export function ConnectionStatus() {
  const connection = useAtomValue(connectionAtom);

  if (!connection)
    return (
      <Badge intent="warning">
        <code>waiting for peer</code>
      </Badge>
    );

  if (connection.peer)
    return (
      <Badge intent="success">
        <code>connected</code>
      </Badge>
    );

  return null;
}
