import { Revenue } from './definitions';
export type DirectusRequestInit = RequestInit & {
  logContext?: string;
  next?: { revalidate?: number; tags?: string[] };
};

export function logDirectusRequest(details: {
  context?: string;
  url: string;
  method?: string;
  status?: number;
  durationMs: number;
  error?: string;
  ok?: boolean;
}) {
  console.log(
    JSON.stringify({
      event: 'directus_fetch',
      context: details.context ?? 'directus',
      url: details.url,
      method: details.method ?? 'GET',
      status: details.status,
      durationMs: details.durationMs,
      ok: details.ok,
      error: details.error,
    }),
  );
}

export async function directusFetch(
  url: string,
  init: DirectusRequestInit = {},
): Promise<Response> {
  const { logContext, ...fetchInit } = init;
  const normalizedInit = {
    cache: fetchInit.cache ?? 'no-store',
    ...fetchInit,
  } satisfies RequestInit;
  const startedAt = Date.now();
  try {
    const response = await fetch(url, normalizedInit);
    logDirectusRequest({
      context: logContext,
      url,
      method: normalizedInit.method,
      status: response.status,
      ok: response.ok,
      durationMs: Date.now() - startedAt,
    });
    return response;
  } catch (error) {
    logDirectusRequest({
      context: logContext,
      url,
      method: normalizedInit.method,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export function slugify(str: string) {
  return str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}