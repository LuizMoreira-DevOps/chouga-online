import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const distDirectory = resolve(projectDirectory, "dist");
const sourceHtmlPath = resolve(distDirectory, "index.html");

const staticRoutes = ["/produtos", "/sobre", "/contato", "/em-breve"];

function resolveRouteDirectory(route) {
  const routeSegments = route.split("/").filter(Boolean);
  const targetDirectory = resolve(distDirectory, ...routeSegments);
  const relativeTarget = relative(distDirectory, targetDirectory);

  if (relativeTarget.startsWith("..") || isAbsolute(relativeTarget)) {
    throw new Error(`Rota fora do diretÃƒÂ³rio dist: ${route}`);
  }

  return targetDirectory;
}

async function generateStaticPages() {
  await readFile(sourceHtmlPath, "utf-8");

  for (const route of staticRoutes) {
    const targetDirectory = resolveRouteDirectory(route);
    const targetHtmlPath = resolve(targetDirectory, "index.html");

    await mkdir(targetDirectory, { recursive: true });
    await copyFile(sourceHtmlPath, targetHtmlPath);

    console.log(`[SSG] Pagina gerada: ${route}`);
  }

  console.log(
    `[SSG] ${staticRoutes.length} rotas estaticas geradas com sucesso.`,
  );
}

generateStaticPages().catch((error) => {
  console.error(`[SSG] Falha na geracao: ${error.message}`);
  process.exitCode = 1;
});

