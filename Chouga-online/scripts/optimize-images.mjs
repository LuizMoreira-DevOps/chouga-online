import console from "node:console";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("src/assets/images");
const outputDir = path.resolve("src/assets/images/optimized");

const jobs = [
  {
    file: "homeWheels-1.png",
    widths: [640, 960],
    quality: 82,
  },
  {
    file: "homeWheels-2.png",
    widths: [640, 960],
    quality: 82,
  },
  {
    file: "homeWheels-3.png",
    widths: [640, 960],
    quality: 82,
  },
  {
    file: "bg-home.png",
    widths: [1920],
    quality: 78,
  },
];

await fs.mkdir(outputDir, { recursive: true });

for (const job of jobs) {
  const sourcePath = path.join(inputDir, job.file);
  const baseName = path.parse(job.file).name;

  for (const width of job.widths) {
    const outputPath = path.join(outputDir, `${baseName}-${width}.webp`);

    await sharp(sourcePath)
      .resize({
        width,
        withoutEnlargement: true,
      })
      .webp({
        quality: job.quality,
        effort: 6,
      })
      .toFile(outputPath);

    console.log(`Gerado: ${outputPath}`);
  }
}
