// Helper functions for Base64 encoding and decoding
const toBase64Url = (buffer: number[]) => {
  return btoa(String.fromCharCode.apply(null, buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const fromBase64Url = (base64: string) => {
  let padding = base64.length % 4;
  if (padding !== 0) {
    padding = 4 - padding;
  }
  const base64Padded = base64 + "=".repeat(padding);
  const binary_string = atob(
    base64Padded.replace(/\-/g, "+").replace(/_/g, "/")
  );
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};

// Function to derive a key from a shared secret
async function deriveKey(sharedSecret: string) {
  const encoder = new TextEncoder();
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const interval = Math.floor(minutes / 5);
  const seed = `${sharedSecret}:${interval}`;
  const keyMaterial = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(seed)
  );
  return await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypts a message; returns IV and encrypted data concatenated as a single Base64-encoded string
export async function encryptMessage(message: string, sharedSecret: string) {
  const key = await deriveKey(sharedSecret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(message)
  );
  // Concatenate IV and encrypted data, then encode
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedData), iv.length);
  return toBase64Url(Array.from(combined));
}

// Decrypts the message using the provided Base64 string that includes both IV and encrypted data
export async function decryptMessage(
  combinedBase64: string,
  sharedSecret: string
) {
  const combined = fromBase64Url(combinedBase64);
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  const key = await deriveKey(sharedSecret);
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Example usage
// (async () => {
//     const sharedSecret = 'secret';
//     const message = 'Hello, World!';
//     const encryptedMessage = await encryptMessage(message, sharedSecret);
//     console.log('Encrypted Message:', encryptedMessage);

//     const decryptedMessage = await decryptMessage(encryptedMessage, sharedSecret);
//     console.log('Decrypted Message:', decryptedMessage);
// })();
