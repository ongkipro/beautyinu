import {RichText} from '@shopify/hydrogen';

interface MetafieldContentProps {
  value?: string | null;
  className?: string;
}

/**
 * Checks whether a metafield actually contains visible text/content.
 * Returns false if null, undefined, empty, whitespace-only,
 * or empty rich-text structure (e.g. root without text).
 */
export function hasMetafieldContent(
  metafield?: {value?: string | null} | null,
): boolean {
  if (!metafield?.value) return false;
  const raw = String(metafield.value).trim();
  if (!raw) return false;

  // 1. JSON RichText check
  if (raw.startsWith('{') && raw.endsWith('}')) {
    try {
      const parsed: any = JSON.parse(raw);
      if (parsed?.type === 'root') {
        const extractText = (node: any): string => {
          if (!node) return '';
          if (node.value && typeof node.value === 'string') return node.value;
          if (Array.isArray(node.children)) {
            return node.children.map(extractText).join('');
          }
          return '';
        };
        return extractText(parsed).trim().length > 0;
      }
    } catch {
      // not valid JSON, proceed to HTML/text check
    }
  }

  // 2. HTML check
  const stripped = raw.replace(/<[^>]+>/g, '').trim();
  return stripped.length > 0;
}

const REDUNDANT_HEADER_REGEX =
  /^(?:manfaat(?: utama)?|cara (?:pemakaian|penggunaan|pakai)|hero ingredients(?: & fungsinya)?|kandungan(?: aktif)?)\s*[:：]?\s*$/i;

function cleanRichTextJson(jsonStr: string): string {
  try {
    const parsed: any = JSON.parse(jsonStr);
    if (parsed?.type === 'root' && Array.isArray(parsed.children)) {
      const extractText = (node: any): string => {
        if (!node) return '';
        if (node.value && typeof node.value === 'string') return node.value;
        if (Array.isArray(node.children)) {
          return node.children.map(extractText).join('');
        }
        return '';
      };

      while (parsed.children.length > 0) {
        const firstText = extractText(parsed.children[0]).trim();
        if (!firstText) {
          parsed.children.shift();
          continue;
        }
        if (REDUNDANT_HEADER_REGEX.test(firstText)) {
          parsed.children.shift();
          continue;
        }
        break;
      }
      return JSON.stringify(parsed);
    }
  } catch {
    // ignore, return original
  }
  return jsonStr;
}

/**
 * Robust Metafield Content Renderer:
 * Handles Shopify RichText JSON, HTML, or multi-line plain text
 * with clean typography and zero AI slop styling.
 * Automatically filters out redundant sub-headings that duplicate accordion labels.
 */
export function MetafieldContent({value, className = ''}: MetafieldContentProps) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;

  // 1. Shopify RichText JSON
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const cleaned = cleanRichTextJson(trimmed);
      const parsed: any = JSON.parse(cleaned);
      if (parsed?.type === 'root' && Array.isArray(parsed?.children)) {
        if (parsed.children.length === 0) return null;
        return (
          <div
            className={`text-sm sm:text-base text-text/85 leading-relaxed space-y-2.5 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-text ${className}`}
          >
            <RichText data={cleaned} />
          </div>
        );
      }
    } catch {
      // fallback below
    }
  }

  // 2. HTML
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    const cleanedHtml = trimmed.replace(
      /^<p[^>]*>\s*(?:<strong>)?\s*(?:manfaat(?: utama)?|cara (?:pemakaian|penggunaan|pakai)|hero ingredients(?: & fungsinya)?|kandungan(?: aktif)?)\s*[:：]?\s*(?:<\/strong>)?\s*<\/p>\s*/i,
      '',
    );
    return (
      <div
        className={`text-sm sm:text-base text-text/85 leading-relaxed space-y-2.5 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-text ${className}`}
        dangerouslySetInnerHTML={{__html: cleanedHtml}}
      />
    );
  }

  // 3. Multi-line plain text
  const cleanedText = trimmed.replace(
    /^(?:manfaat(?: utama)?|cara (?:pemakaian|penggunaan|pakai)|hero ingredients(?: & fungsinya)?|kandungan(?: aktif)?)\s*[:：]?\s*\n+/i,
    '',
  );

  return (
    <div
      className={`text-sm sm:text-base text-text/85 leading-relaxed whitespace-pre-line ${className}`}
    >
      {cleanedText}
    </div>
  );
}
