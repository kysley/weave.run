import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import clsx from "clsx";
import { Button } from "./ui/button.client";
import { DragAndDrop, DragAndDropProps } from "./drag-and-drop";
import { ReactNode } from "react";

export function TransferTypeTabs({ children }: { children: ReactNode }) {
  return (
    <Tabs defaultSelectedKey="file" className="flex flex-col gap-4 w-full">
      <TabList className="flex bg-zinc-800 border border-solid border-white/30 rounded-md overflow-hidden p-1">
        <Tab
          id="file"
          className={({ isSelected }) =>
            clsx(
              "w-full text-center rounded-sm cursor-pointer",
              isSelected && "bg-zinc-700"
            )
          }
        >
          File
        </Tab>
        <Tab
          id="secret"
          className={({ isSelected, isPressed }) =>
            clsx(
              "w-full text-center rounded-sm cursor-pointer",
              isSelected && "bg-zinc-700"
            )
          }
        >
          Secret
        </Tab>
      </TabList>
      {children}
    </Tabs>
  );
}

export function FileTabPanel(props: DragAndDropProps) {
  return (
    <TabPanel id="file">
      <div className="flex flex-col gap-2">
        <DragAndDrop {...props} />
        {/* <Button className="w-full">hey</Button> */}
      </div>
    </TabPanel>
  );
}
