import type { MetaFunction } from "@remix-run/node";
import { PeerHost } from "../../components/peer-host.client";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  const params = useParams();
  console.log(params);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix (SPA Mode)</h1>
      <PeerHost />
    </div>
  );
}
