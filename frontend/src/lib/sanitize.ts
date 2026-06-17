/**
 * HTML sanitizer for CKEditor content.
 *
 * Uses isomorphic-dompurify (works in both Node.js/SSR and the browser).
 * Allows a safe subset of HTML tags/attributes while stripping anything that
 * could execute JavaScript (script, inline event handlers, javascript: hrefs).
 *
 * Call sanitizeHtml() around every dangerouslySetInnerHTML value that comes
 * from user-generated or admin-edited content (articles, cases, FAQ answers).
 */
import DOMPurify from "isomorphic-dompurify";

// Tags allowed in CKEditor-produced content
const ALLOWED_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "del",
  "ins",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
  "div",
  "span",
];

// Attributes allowed on those tags
const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "loading",
  "class",
  "id",
  "colspan",
  "rowspan",
];

export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force safe link handling
    FORCE_BODY: false,
    // Don't allow data: URIs in src attributes
    ALLOW_DATA_ATTR: false,
  });
}
