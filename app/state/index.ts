import { atom } from "jotai";
import { Data, PeerConnection } from "../utils/peer";
import { type DataConnection } from "peerjs";

type PeerConsent = "yes" | "no" | "pending" | undefined;

export const myConsentAtom = atom<PeerConsent>(undefined);

export const peerConsentAtom = atom<PeerConsent>(undefined);

export const peerDataAtom = atom<Data | undefined>(undefined);

export const transferDataAtom = atom<File | string | undefined>(undefined);

export const myPeerIdAtom = atom(async () => {
  const id = await PeerConnection.startPeerSession();
  return id;
});

export const shareLinkAtom = atom((get) => {
  const id = get(myPeerIdAtom);
  return id ? `${window.location.origin}/w/${id}` : null;
});

export const connectionAtom = atom<DataConnection | undefined>(undefined);
