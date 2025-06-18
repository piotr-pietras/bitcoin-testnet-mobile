export const hexToUint8Array = (hex: string) => {
  if (hex.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};
