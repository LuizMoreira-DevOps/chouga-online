import { Buffer } from "node:buffer";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import sharp from "sharp";

const inputPath = resolve("public/favicon.png");
const outputPath = resolve("public/favicon.ico");

const pngBuffer = await sharp(inputPath)
  .resize(256, 256, {
    fit: "cover",
  })
  .png()
  .toBuffer();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const directory = Buffer.alloc(16);
directory.writeUInt8(0, 0);
directory.writeUInt8(0, 1);
directory.writeUInt8(0, 2);
directory.writeUInt8(0, 3);
directory.writeUInt16LE(1, 4);
directory.writeUInt16LE(32, 6);
directory.writeUInt32LE(pngBuffer.length, 8);
directory.writeUInt32LE(22, 12);

await writeFile(outputPath, Buffer.concat([header, directory, pngBuffer]));
