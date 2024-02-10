import { useAtom, useAtomValue } from "jotai";
import { connectionAtom } from "../state";
import { Badge } from "./ui/badge.client";
import { useInternetConnection } from "../hooks/use-internet-connection";

export function ConnectionStatus() {
  const connection = useAtomValue(connectionAtom);
  const { online } = useInternetConnection();

  if (!online) return <Badge intent="error">Offline</Badge>;

  if (!connection)
    return (
      <Badge intent="warning">
        <code>Waiting for peer</code>
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
