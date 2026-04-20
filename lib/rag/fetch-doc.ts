const ALLOWED_HOST = "help.lofty.com";
const MAX_CONTENT_CHARS = 4000;
const FETCH_TIMEOUT_MS = 5000;

function extractArticleId(url: string): string | null {
  const match = url.match(/\/articles\/(\d+)/);
  return match?.[1] ?? null;
}

function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === ALLOWED_HOST;
  } catch {
    return false;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function truncate(text: string): string {
  if (text.length <= MAX_CONTENT_CHARS) return text;
  return text.slice(0, MAX_CONTENT_CHARS).trimEnd() + "…";
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchViaZendeskApi(articleId: string): Promise<string | null> {
  const apiUrl = `https://${ALLOWED_HOST}/api/v2/help_center/articles/${articleId}.json`;
  const response = await fetchWithTimeout(apiUrl);
  if (!response.ok) return null;

  const json = (await response.json()) as {
    article?: { title?: string; body?: string };
  };

  const title = json.article?.title ?? "";
  const body = stripHtml(json.article?.body ?? "");
  if (!body) return null;

  return truncate(title ? `${title}\n\n${body}` : body);
}

async function fetchViaHtmlScrape(url: string): Promise<string | null> {
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const html = await response.text();

  // Extract just the article body element to avoid nav/header noise
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const source = articleMatch?.[1] ?? html;

  return truncate(stripHtml(source));
}

/**
 * Fetches the plain-text content of a Lofty help center article.
 * Tries the Zendesk JSON API first, falls back to HTML scraping.
 * Only allows help.lofty.com URLs to prevent SSRF.
 * Returns null if the URL is not allowed, unreachable, or times out.
 */
export async function fetchDocContent(url: string): Promise<string | null> {
  if (!isAllowedUrl(url)) return null;

  const articleId = extractArticleId(url);

  if (articleId) {
    const apiContent = await fetchViaZendeskApi(articleId).catch(() => null);
    if (apiContent) return apiContent;
  }

  // Fall back to HTML scrape
  return fetchViaHtmlScrape(url).catch(() => null);
}
