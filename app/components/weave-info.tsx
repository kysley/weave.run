import { ReactNode } from "react";
import { Heading, Text } from "react-aria-components";

export function WeaveBranding({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-center pt-5 pb-10 gap-3">
      <img src="/Frame 4.svg" className="h-[100px]" alt="weave.run logo" />
      <Heading className="italic font-bold text-xl text-center">weave</Heading>
      {children}
    </div>
  );
}

export function WeaveInfo() {
  return (
    <WeaveBranding>
      <Text className="text-center">
        <span className="font-bold italic">weave</span> is a{" "}
        <span className="text-blue-500">zero knowledge</span> peer2peer file and
        secret sharing service. <br />
        No files or secrets are handled by a middleman or server.
      </Text>
    </WeaveBranding>
  );
}
