import {
  DropZone,
  FileDropItem,
  FileTrigger,
  Text,
} from "react-aria-components";
import { Button } from "./ui/button.client";
import { useState } from "react";

type DragAndDropProps = {
  onFileChange?(files: File[], fileNames: string[]): void;
};
export function DragAndDrop({ onFileChange }: DragAndDropProps) {
  const [files, setFiles] = useState<string>();

  console.log(files);

  return (
    <DropZone
      onDrop={async (e) => {
        const dropItemFiles = e.items.filter(
          (file) => file.kind === "file"
        ) as FileDropItem[];
        const filenames = dropItemFiles.map((file) => file.name);

        const files: File[] = [];
        for await (const dropItemFile of dropItemFiles) {
          const file = await dropItemFile.getFile();
          files.push(file);
        }

        onFileChange?.(files, filenames);
        setFiles(filenames.join(", "));
      }}
      className="border-2 border-dashed border-zinc-500 hover:border-zinc-600 rounded-sm flex flex-col justify-center p-4"
    >
      <Text slot="label" className="text-center font-bold">
        {files || "Drop the file you would like to send."}
      </Text>

      {!files && (
        <>
          <Text slot="label" className="text-center mb-4">
            {files || "Alternatively, you can select a file."}
          </Text>
          <FileTrigger
            // allowsMultiple
            onSelect={(e) => {
              if (!e) return;
              const files = Array.from(e);
              const filenames = files.map((file) => file.name);
              onFileChange?.(files, filenames);
              setFiles(filenames.join(", "));
            }}
          >
            <Button variant="tertiary" className="self-center">
              Select file
            </Button>
          </FileTrigger>
        </>
      )}
    </DropZone>
  );
}
