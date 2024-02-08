import { Data } from "./peer";

export function downloadData(data: Data) {
  if (!data.file) return;

  // For some reason we need to create another blob
  const d = new Blob([data.file], { type: data.fileType });
  const url = URL.createObjectURL(d);

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = url;
  a.download = data.fileName || `weave.run-${Date.now()}`; // Set the filename for the download

  // Append the anchor to the document, trigger the download, and then remove the anchor
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Cleanup the blob URL
  URL.revokeObjectURL(url);
}

// Likely unnecessary now since fileName includes the extension but we keep for now
export function makeFullFileName(fileName?: string, fileType?: string) {
  if (!fileName && !fileType)
    throw new Error("Malformed file. No name or extension");

  if (!fileType) return fileName;

  return fileName;
}
