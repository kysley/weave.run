import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import clsx from "clsx";
import { Button } from "./ui/button.client";
import { DragAndDrop } from "./drag-and-drop";

export function TransferTypeTabs() {
  return (
    <Tabs defaultSelectedKey="file" className="flex flex-col gap-4 w-full">
      <TabList className="flex bg-zinc-800 border border-solid border-white/30 rounded-md overflow-hidden">
        <Tab
          id="file"
          className={({ isSelected }) =>
            clsx("w-full text-center", isSelected && "bg-zinc-700")
          }
        >
          File
        </Tab>
        <Tab
          id="secret"
          className={({ isSelected, isPressed }) =>
            clsx("w-full text-center", isSelected && "bg-zinc-700")
          }
        >
          Secret
        </Tab>
      </TabList>
      <FileTabPanel />
    </Tabs>
  );
}

export function FileTabPanel() {
  return (
    <TabPanel id="file">
      <div className="flex flex-col gap-2">
        <DragAndDrop />
        {/* {files?.length > 0 && ( */}
        {/* <Button onClick={send} className="w-full" disabled={!hasConsent}> */}
        <Button className="w-full">
          {/* {hasConsent ? "Send to peer" : "Waiting for peer consent"} */}
          hey
        </Button>
        {/* )} */}
      </div>
    </TabPanel>
  );
}
