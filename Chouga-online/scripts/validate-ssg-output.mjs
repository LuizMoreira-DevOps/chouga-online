import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const distDirectory = resolve(projectDirectory, "dist");
const manifestPath = resolve(distDirectory, "ssg-manifest.json");

async function assertFileExists(filePath, label) {
  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      throw new Error(`${label} nao e um arquivo.`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${label} nao encontrado: ${filePath}`, { cause: error });
    }

    throw error;
  }
}

function resolveRouteHtmlPath(route) {
  const routeSegments = route.split("/").filter(Boolean);

  return resolve(distDirectory, ...routeSegments, "index.html");
}

function assertRequiredMetadata(html, route) {
  const requiredPatterns = [
    {
      label: "title",
      pattern: /<title>[^<]+<\/title>/i,
    },
    {
      label: "meta description",
      pattern: /<meta name="description" content="[^"]+"\s*\/?>/i,
    },
    {
      label: "og:title",
      pattern: /<meta property="og:title" content="[^"]+"\s*\/?>/i,
    },
    {
      label: "og:description",
      pattern: /<meta property="og:description" content="[^"]+"\s*\/?>/i,
    },
    {
      label: "og:type",
      pattern: /<meta property="og:type" content="[^"]+"\s*\/?>/i,
    },
    {
      label: "og:url",
      pattern: /<meta property="og:url" content="[^"]+"\s*\/?>/i,
    },
    {
      label: "canonical",
      pattern: /<link rel="canonical" href="[^"]+"\s*\/?>/i,
    },
  ];

  for (const requirement of requiredPatterns) {
    if (!requirement.pattern.test(html)) {
      throw new Error(
        `Metadado ${requirement.label} ausente na rota ${route}.`,
      );
    }
  }
}

async function validateRoute(route) {
  const htmlPath = resolveRouteHtmlPath(route);

  await assertFileExists(htmlPath, `HTML da rota ${route}`);

  const html = await readFile(htmlPath, "utf-8");

  assertRequiredMetadata(html, route);
}

async function validateSsgOutput() {
  await assertFileExists(manifestPath, "Manifesto SSG");

  const manifestContent = await readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestContent);

  if (!Array.isArray(manifest.staticRoutes)) {
    throw new Error("staticRoutes deve ser um array.");
  }

  if (!Array.isArray(manifest.productRoutes)) {
    throw new Error("productRoutes deve ser um array.");
  }

  const routes = [...manifest.staticRoutes, ...manifest.productRoutes];

  if (manifest.totalRoutes !== routes.length) {
    throw new Error(
      `Total inconsistente: manifesto informa ${manifest.totalRoutes}, mas possui ${routes.length} rotas.`,
    );
  }

  if (new Set(routes).size !== routes.length) {
    throw new Error("O manifesto contem rotas duplicadas.");
  }

  for (const route of routes) {
    await validateRoute(route);
    console.log(`[SSG Validate] Rota valida: ${route}`);
  }

  console.log(`[SSG Validate] Artefato validado com ${routes.length} rotas.`);
}

validateSsgOutput().catch((error) => {
  console.error(`[SSG Validate] Falha: ${error.message}`);
  process.exitCode = 1;
});
