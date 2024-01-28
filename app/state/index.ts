import { atom } from "jotai";
import type Peer from "peerjs";
import { PeerConnection } from "../utils/peer";
import { type DataConnection } from "peerjs";

// export const peerIdAtom = atom<string | null>(null);

export const peerIdAtom = atom(async () => {
  const id = await PeerConnection.startPeerSession();
  return id;
});

export const shareLinkAtom = atom((get) => {
  const id = get(peerIdAtom);
  return id ? `${window.location.origin}/w/${id}` : null;
});

export const connectionAtom = atom<DataConnection | undefined>(undefined);
