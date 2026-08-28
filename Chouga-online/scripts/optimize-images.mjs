import console from "node:console";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("src/assets/images");
const outputDir = path.resolve("src/assets/images/optimized");

const DEFAULT_WEBP_QUALITY = 82;
const MIN_SAVINGS_PERCENT = 10;

/*
 * Imagens com tratamento responsivo específico.
 *
 * Essas imagens não entram no processamento automático abaixo,
 * porque possuem larguras e qualidades próprias.
 */
const responsiveJobs = [
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

const responsiveSourceFiles = new Set(
  responsiveJobs.map((job) => path.normalize(job.file)),
);

const supportedExtensions = new Set([".jpg", ".jpeg", ".png"]);

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

function calculateSavings(originalSize, optimizedSize) {
  return ((originalSize - optimizedSize) / originalSize) * 100;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/*
 * Remove diretórios vazios deixados por candidatos WebP rejeitados.
 */
async function removeEmptyDirectory(directory) {
  if (directory === outputDir) {
    return;
  }

  try {
    const entries = await fs.readdir(directory);

    if (entries.length === 0) {
      await fs.rmdir(directory);
    }
  } catch {
    // Diretório inexistente ou já removido.
  }
}

/*
 * Home
 *
 * Mantém geração responsiva explícita porque essas imagens
 * possuem necessidades diferentes das imagens comuns.
 */
async function optimizeResponsiveImages() {
  console.log("\n=== IMAGENS RESPONSIVAS ===\n");

  for (const job of responsiveJobs) {
    const sourcePath = path.join(inputDir, job.file);
    const baseName = path.parse(job.file).name;

    if (!(await fileExists(sourcePath))) {
      console.warn(`Ignorado: ${job.file} não encontrado.`);
      continue;
    }

    for (const width of job.widths) {
      const outputPath = path.join(outputDir, `${baseName}-${width}.webp`);

      await fs.mkdir(path.dirname(outputPath), {
        recursive: true,
      });

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

      const sourceStat = await fs.stat(sourcePath);
      const outputStat = await fs.stat(outputPath);

      const savings = calculateSavings(sourceStat.size, outputStat.size);

      console.log(`✓ ${job.file} → ${path.basename(outputPath)}`);
      console.log(
        `  ${formatKb(sourceStat.size)} → ${formatKb(outputStat.size)} ` +
          `(${savings.toFixed(1)}% menor)`,
      );
    }
  }
}

async function collectImages(directory) {
  const files = [];

  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      /*
       * Nunca processamos novamente os arquivos já otimizados.
       */
      if (fullPath === outputDir) {
        continue;
      }

      files.push(...(await collectImages(fullPath)));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (!supportedExtensions.has(extension)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

/*
 * Imagens comuns
 *
 * Cria um candidato WebP e só o mantém quando a redução
 * for igual ou superior ao limite definido.
 */
async function optimizeRegularImage(sourcePath) {
  const relativePath = path.relative(inputDir, sourcePath);

  /*
   * As imagens responsivas já possuem pipeline próprio.
   */
  if (responsiveSourceFiles.has(path.normalize(relativePath))) {
    return;
  }

  const parsedPath = path.parse(relativePath);

  const outputPath = path.join(
    outputDir,
    parsedPath.dir,
    `${parsedPath.name}.webp`,
  );

  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await sharp(sourcePath)
    .webp({
      quality: DEFAULT_WEBP_QUALITY,
      effort: 6,
    })
    .toFile(outputPath);

  const originalStat = await fs.stat(sourcePath);
  const optimizedStat = await fs.stat(outputPath);

  const savings = calculateSavings(originalStat.size, optimizedStat.size);

  if (savings < MIN_SAVINGS_PERCENT) {
    await fs.unlink(outputPath);
    await removeEmptyDirectory(path.dirname(outputPath));

    console.log(`○ ${relativePath}`);
    console.log(
      `  mantido original: ${formatKb(originalStat.size)} → ` +
        `${formatKb(optimizedStat.size)} ` +
        `(${savings.toFixed(1)}%)`,
    );

    return;
  }

  console.log(`✓ ${relativePath}`);
  console.log(
    `  WebP: ${formatKb(originalStat.size)} → ` +
      `${formatKb(optimizedStat.size)} ` +
      `(${savings.toFixed(1)}% menor)`,
  );
}

async function optimizeRegularImages() {
  console.log("\n=== IMAGENS AUTOMÁTICAS ===\n");

  const images = await collectImages(inputDir);

  for (const image of images) {
    await optimizeRegularImage(image);
  }
}

async function main() {
  await fs.mkdir(outputDir, {
    recursive: true,
  });

  await optimizeResponsiveImages();
  await optimizeRegularImages();

  console.log("\n=== OTIMIZAÇÃO CONCLUÍDA ===\n");
}

await main();
