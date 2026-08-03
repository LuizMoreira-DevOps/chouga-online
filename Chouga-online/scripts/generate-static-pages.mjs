import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchActiveProducts } from "./lib/fetch-active-products.mjs";
import { validateProductSlugs } from "./lib/validate-product-slugs.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const distDirectory = resolve(projectDirectory, "dist");
const sourceHtmlPath = resolve(distDirectory, "index.html");

const siteUrl = "https://www.chouga.com.br";

const staticPages = [
  {
    route: "/",
    title: "Chouga Skateboard",
    description:
      "Chouga Skateboard. Streetwear, skate e atitude para quem não se veste, se vive.",
    ogType: "website",
  },
  {
    route: "/produtos",
    title: "Produtos | Chouga Skateboard",
    description:
      "Conheça as camisetas, blusas e peças streetwear da Chouga Skateboard.",
    ogType: "website",
  },
  {
    route: "/sobre",
    title: "Sobre a Chouga | Chouga Skateboard",
    description:
      "Conheça a história, a identidade e a essência da Chouga Skateboard.",
    ogType: "website",
  },
  {
    route: "/contato",
    title: "Contato | Chouga Skateboard",
    description:
      "Entre em contato com a Chouga Skateboard e acompanhe nossos canais.",
    ogType: "website",
  },
  {
    route: "/em-breve",
    title: "Em breve | Chouga Skateboard",
    description:
      "Novidades da Chouga Skateboard estão chegando. Acompanhe os próximos lançamentos.",
    ogType: "website",
  },
];

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildAbsoluteUrl(route) {
  return route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
}

function replaceRequired(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(`Tag obrigatoria nao encontrada: ${label}`);
  }

  return html.replace(pattern, replacement);
}

function applyMetadata(sourceHtml, page) {
  const title = escapeHtmlAttribute(page.title);
  const description = escapeHtmlAttribute(page.description);
  const canonicalUrl = escapeHtmlAttribute(buildAbsoluteUrl(page.route));
  const ogType = escapeHtmlAttribute(page.ogType);

  let html = sourceHtml;

  html = replaceRequired(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${title}</title>`,
    "title",
  );

  html = replaceRequired(
    html,
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`,
    "meta description",
  );

  html = replaceRequired(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`,
    "og:title",
  );

  html = replaceRequired(
    html,
    /<meta property="og:description" content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`,
    "og:description",
  );

  html = replaceRequired(
    html,
    /<meta property="og:type" content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${ogType}" />`,
    "og:type",
  );

  html = replaceRequired(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    "og:url",
  );

  html = replaceRequired(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    "canonical",
  );

  return html;
}

function resolveRouteDirectory(route) {
  const routeSegments = route.split("/").filter(Boolean);
  const targetDirectory = resolve(distDirectory, ...routeSegments);
  const relativeTarget = relative(distDirectory, targetDirectory);

  if (relativeTarget.startsWith("..") || isAbsolute(relativeTarget)) {
    throw new Error(`Rota fora do diretorio dist: ${route}`);
  }

  return targetDirectory;
}

async function generateStaticPages() {
  const sourceHtml = await readFile(sourceHtmlPath, "utf-8");
  const fetchedProducts = await fetchActiveProducts(projectDirectory);
  const activeProducts = validateProductSlugs(fetchedProducts);

  console.log(`[SSG] ${activeProducts.length} produtos ativos encontrados.`);

  for (const page of staticPages) {
    const targetDirectory = resolveRouteDirectory(page.route);
    const targetHtmlPath = resolve(targetDirectory, "index.html");
    const pageHtml = applyMetadata(sourceHtml, page);

    await mkdir(targetDirectory, { recursive: true });
    await writeFile(targetHtmlPath, pageHtml, "utf-8");

    console.log(`[SSG] Pagina gerada: ${page.route}`);
  }

  console.log(
    `[SSG] ${staticPages.length} rotas estaticas geradas com sucesso.`,
  );

  for (const product of activeProducts) {
    const productRoute = `/produtos/${product.slug}`;
    const targetDirectory = resolveRouteDirectory(productRoute);
    const targetHtmlPath = resolve(targetDirectory, "index.html");

    const productPage = {
      route: productRoute,
      title: `${product.nome} | Chouga Skateboard`,
      description:
        product.descricao ||
        `Conheça ${product.nome}, uma peça da Chouga Skateboard.`,
      ogType: "product",
    };

    const productHtml = applyMetadata(sourceHtml, productPage);

    await mkdir(targetDirectory, { recursive: true });
    await writeFile(targetHtmlPath, productHtml, "utf-8");

    console.log(`[SSG] Produto gerado: ${productRoute}`);
  }

  console.log(
    `[SSG] ${activeProducts.length} paginas de produto geradas com sucesso.`,
  );
}

generateStaticPages().catch((error) => {
  console.error(`[SSG] Falha na geracao: ${error.message}`);
  process.exitCode = 1;
});
