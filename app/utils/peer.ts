import Peer, { DataConnection } from "peerjs";

export enum MessageType {
  SEND_FILE = "SEND_FILE",
  SEND_MESSAGE = "SEND_MESSAGE",
  SEND_GRANT = "SEND_GRANT",
  SEND_REQUEST = "SEND_REQUEST",
}

export type Message =
  | { type: MessageType.SEND_FILE; data: Data }
  | { type: MessageType.SEND_MESSAGE; data: string }
  | { type: MessageType.SEND_GRANT; data: boolean }
  | { type: MessageType.SEND_REQUEST; data: undefined };

export enum DataType {
  FILE = "FILE",
  OTHER = "OTHER",
}
export interface Data {
  dataType: DataType;
  file?: Blob;
  fileName?: string;
  fileType?: string;
  message?: string;
}

let peer: Peer | undefined;
const connectionMap: Map<string, DataConnection> = new Map<
  string,
  DataConnection
>();

export const PeerConnection = {
  getPeer: () => peer,
  startPeerSession: () =>
    new Promise<string>((resolve, reject) => {
      try {
        peer = new Peer({
          config: {
            iceServers: [
              // { urls: "stun:stun2.1.google.com:19302" },
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
              { urls: "stun:stun3.l.google.com:19302" },
              { urls: "stun:stun4.l.google.com:19302" },
              { urls: "stun:stun.ekiga.net" },
              { urls: "stun:stun.stunprotocol.org:3478" },
              { urls: "stun:stun.voipbuster.com" },
              { urls: "stun:stun.voipstunt.com" },
            ],
          },
        });
        peer
          .on("open", (id) => {
            console.log(`My ID: ${id}`);
            resolve(id);
          })
          .on("error", (err) => {
            console.log(err);
            // message.error(err.message);
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  closePeerSession: () =>
    new Promise<void>((resolve, reject) => {
      try {
        if (peer) {
          peer.destroy();
          peer = undefined;
        }
        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  connectPeer: (id: string) =>
    new Promise<void>((resolve, reject) => {
      if (!peer) {
        reject(new Error("Peer doesn't start yet"));
        return;
      }
      if (connectionMap.has(id)) {
        reject(new Error("Connection existed"));
        return;
      }
      try {
        const conn = peer.connect(id, { reliable: true });
        if (!conn) {
          reject(new Error("Connection can't be established"));
        } else {
          conn
            .on("open", () => {
              console.log(`Connect to: ${id}`);
              connectionMap.set(id, conn);
              resolve(conn);
            })
            .on("error", (err) => {
              console.log(err);
              reject(err);
            });
        }
      } catch (err) {
        reject(err);
      }
    }),
  onIncomingConnection: (callback: (conn: DataConnection) => void) => {
    peer?.on("connection", (conn) => {
      console.log(`Incoming connection: ${conn.peer}`);
      connectionMap.set(conn.peer, conn);
      callback(conn);
    });
  },
  onConnectionDisconnected: (id: string, callback: () => void) => {
    if (!peer) {
      throw new Error("Peer doesn't start yet");
    }
    if (!connectionMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    const conn = connectionMap.get(id);
    if (conn) {
      conn.on("close", () => {
        console.log(`Connection closed: ${id}`);
        connectionMap.delete(id);
        callback();
      });
    }
  },
  sendConnection: (id: string, data: Message): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!connectionMap.has(id)) {
        reject(new Error("Connection didn't exist"));
      }
      try {
        const conn = connectionMap.get(id);
        if (conn) {
          conn.send(data);
          // conn.
        }
      } catch (err) {
        reject(err);
      }
      resolve();
    }),
  onConnectionReceiveData: (id: string, callback: (f: Message) => void) => {
    if (!peer) {
      throw new Error("Peer doesn't start yet");
    }
    if (!connectionMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    const conn = connectionMap.get(id);
    if (conn) {
      conn.on("data", (receivedData) => {
        console.log(`Receiving data from ${id}`);
        const data = receivedData as Message;
        callback(data);
      });
    }
  },
};
