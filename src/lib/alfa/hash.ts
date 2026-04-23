import crypto from "crypto";

export function generateAlfaHash(
  params: Record<string, string>,
  key1: string,
  key2: string
): string {
  const mapString = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const keyBuf = Buffer.from(key1, "utf8").subarray(0, 16);
  const ivBuf = Buffer.from(key2, "utf8").subarray(0, 16);

  const cipher = crypto.createCipheriv("aes-128-cbc", keyBuf, ivBuf);
  const encrypted = Buffer.concat([
    cipher.update(mapString, "utf8"),
    cipher.final(),
  ]);
  return encrypted.toString("base64");
}
