import { Outlet } from "@remix-run/react";
import { WeaveBranding } from "../components/weave-info";

export default function ZeroKnowledgeLayout() {
  return (
    <>
      <WeaveBranding />
      <Outlet />
    </>
  );
}
