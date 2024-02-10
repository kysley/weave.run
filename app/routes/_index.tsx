import type { MetaFunction } from "@remix-run/node";
import { PeerHost } from "../components/peer-host.client";
import {
  Component,
  ErrorInfo,
  PureComponent,
  ReactNode,
  Suspense,
} from "react";
import { WeaveInfo } from "../components/weave-info";

export const meta: MetaFunction = () => {
  return [
    { title: "weave.run - Zero knowledge sharing" },
    {
      name: "description",
      content: "Send secrets and files p2p without a server in the middle.",
    },
  ];
};

class Boundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error);
  }

  render(): ReactNode {
    // @ts-expect-error idc about typing this
    return this.props.children;
  }
}

export default function Index() {
  return (
    <Boundary>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <Suspense>
          <div className="host-container gap-4">
            <WeaveInfo />
            <PeerHost />
          </div>
        </Suspense>
      </div>
    </Boundary>
  );
}
